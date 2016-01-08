'use strict';

const _ = require('lodash');
const express = require('express');
const db = require('./db');
const codes = require('./lookup_codes');

const State = db.State;
const County = db.County;
const Country = db.Country;
const app = express();

const APIkey = process.env.API_KEY || require('./apikey_local');

const request = require('request');
const bodyParser = require('body-parser');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

function getCountiesFromAPI(stateCode, stateName, res) {
  request({
    url: 'http://api.census.gov/data/2013/acs1/profile',
    qs: {
      'get': 'NAME',
      'for': 'county:*',
      'in': 'state:' + stateCode,
      'key': APIkey
    },
    json: true
  }, function (error, response) {
    if (error) {
      console.error(error);
      res.send(error);
    } else if (response.statusCode !== 200) {
      res.send(response);
    } else { // success
      // cache in DB for next time
      State.create({
        stateCode: stateCode,
        name: stateName,
        counties: response.body.slice(1)
      }, function(err, newState) {
        if (err) {
          console.error(err);
        } else {
          res.send(newState.counties);
        }
      });
    }
  });
}

function getCountryIncomeDataFromAPI(res) {
  getIncomeDataFromAPI(null, null, res);
}

function getStateIncomeDataFromAPI(stateCode, res) {
  getIncomeDataFromAPI(stateCode, null, res);
}

function getCountyIncomeDataFromAPI(stateCode, countyCode, res) {
  getIncomeDataFromAPI(stateCode, countyCode, res);
}

function getIncomeDataFromAPI(stateCode, countyCode, res) {
  let queryString;
  if (countyCode) {
    queryString = {
      'for': 'county:' + countyCode,
      'in': 'state:' + stateCode,
      'key': APIkey
    };
  } else if (stateCode) {
    queryString = {
      'for': 'state:' + stateCode,
      'key': APIkey
    };
  } else {
    queryString = {
      'for': 'us:*',
      'key': APIkey
    }
  }
  const allBrackets = codes.ALL_HOUSEHOLDS.concat(codes.FAMILIES);
  const codeHashMap = _.reduce(allBrackets, function(obj, item) {
    obj[item.code] = 0;
    return obj;
  }, {});
  //const allBrackets = _.indexBy(codes.ALL_HOUSEHOLDS.concat(codes.FAMILIES), 'code');
  //const totalBrackets = allBrackets.length;
  const totalBrackets = allBrackets.length;
  let bracketsSoFar = 0;
  _.forEach(codeHashMap, function(code, key) {
    request({
      url: 'http://api.census.gov/data/2013/acs1/profile',
      qs: _.extend({}, queryString, {'get': (key + ',NAME')}),
      json: true
    }, function (error, response) {
      bracketsSoFar++;
      if (error) {
        console.error(error);
        codeHashMap[key].error = error;
        if (bracketsSoFar === totalBrackets) {
          res.send(codeHashMap);
        }
      } else if (response.statusCode !== 200) {
        console.error(response);
        codeHashMap[key].error = response;
        if (bracketsSoFar === totalBrackets) {
          res.send(codeHashMap);
        }
      } else {
        codeHashMap[key] = parseInt(response.body[1][0]);
        if (bracketsSoFar === totalBrackets) {
          const allHouseholds = _.map(codes.ALL_HOUSEHOLDS, function(item) {
            return _.extend({}, item, {households: codeHashMap[item.code]});
          });
          const familyHouseholds = _.map(codes.FAMILIES, function(item) {
            return _.extend({}, item, {households: codeHashMap[item.code]});
          });
          const nonFamilyHouseholds = _.map(codes.NONFAMILIES, function(item) {
            return _.extend({}, item, {households: codeHashMap[item.code1]
            - codeHashMap[item.code2]});
          });
          // Split first point into 2 points to smooth out beginning and have it start at 0
          //const zeroBracket = [{min: 0, max: 0, households: allBrackets[0].households * 0.25}];
          //allBrackets[0].households *= 0.75;
          if (countyCode) {
            County.create({
              stateCode: stateCode,
              countyCode: countyCode,
              name: response.body[1][1].split(',')[0],
              incomeDataAll: addTails(allHouseholds),
              incomeDataFamilies: addTails(familyHouseholds),
              incomeDataNonFamilies: addTails(nonFamilyHouseholds)
            }, function(err, newCounty) {
              if (err) {
                console.error(err);
              } else {
                const incomeData = {
                  all: newCounty.incomeDataAll,
                  family: newCounty.incomeDataFamilies,
                  nonfamily: newCounty.incomeDataNonFamilies
                };
                res.send(JSON.stringify(incomeData));
              }
            });
          } else if (stateCode) {
            State.findOneAndUpdate({stateCode: stateCode}, {
              $set: {
                incomeDataAll: addTails(allHouseholds),
                incomeDataFamilies: addTails(familyHouseholds),
                incomeDataNonFamilies: addTails(nonFamilyHouseholds)
              }
            }, {
              new: true
            }, function(err, newState) {
              if (err) {
                console.error(err);
              } else {
                const incomeData = {
                  all: newState.incomeDataAll,
                  family: newState.incomeDataFamilies,
                  nonfamily: newState.incomeDataNonFamilies
                };
                res.send(JSON.stringify(incomeData));
              }
            });
          } else {
            Country.create({
                name: 'United States',
                incomeDataAll: addTails(allHouseholds),
                incomeDataFamilies: addTails(familyHouseholds),
                incomeDataNonFamilies: addTails(nonFamilyHouseholds)
            }, {
              new: true
            }, function(err, newCountry) {
              if (err) {
                console.error(err);
              } else {
                const incomeData = {
                  all: newCountry.incomeDataAll,
                  family: newCountry.incomeDataFamilies,
                  nonfamily: newCountry.incomeDataNonFamilies
                };
                res.send(JSON.stringify(incomeData));
              }
            });
          }
        }
      }
    });
  });
}

function addTails(brackets) {
  const zeroBracket = [{min: 0, max: 0, households: brackets[0].households * 0.25}];
  brackets[0].households *= 0.75;
  const lastBracket = brackets[brackets.length-1];
  const highBracket = [{min: 225000, max: 225000, households: lastBracket.households * 0.25}];
  const bracketsWithTails = zeroBracket
      .concat(brackets.slice(0,-1))
      .concat([{min: 205000, max: 205000, households: lastBracket.households * 0.75}])
      .concat(highBracket);
  return bracketsWithTails;
}

app.get('/counties', function (req, res) {
  State.find({stateCode: req.query.state})
      .exec(function(error, results) {
        if (error) {
          console.error(error);
        } else if (results.length === 0) { // not found in DB
          getCountiesFromAPI(req.query.state, req.query.stateName, res);
        } else { // found in DB
          res.send(results[0].counties);
        }
      });
});

app.get('/incomes', function (req, res) {
  const state = req.query.state;
  const county = req.query.county;
  if (county) {
    County.find({stateCode: state, countyCode: county})
        .exec(function(error, results) {
          if (error) {
            console.error(error);
          } else if (results.length === 0) { // not found in DB
            getCountyIncomeDataFromAPI(state, county, res);
          } else { // found in DB
            const incomeData = {
              all: results[0].incomeDataAll,
              family: results[0].incomeDataFamilies,
              nonfamily: results[0].incomeDataNonFamilies
            };
            res.send(JSON.stringify(incomeData));
          }
        });
  } else if (state) {
    State.find({stateCode: req.query.state})
      .exec(function(error, results) {
        if (error) {
          console.error(error);
        } else if (results.length === 0 || results[0].incomeDataAll.length === 0) {
          getStateIncomeDataFromAPI(state, res);
        } else {
          const incomeData = {
            all: results[0].incomeDataAll,
            family: results[0].incomeDataFamilies,
            nonfamily: results[0].incomeDataNonFamilies
          };
          res.send(JSON.stringify(incomeData));
        }
      })
  } else {
    Country.find({name: 'United States'})
        .exec(function(error, results) {
          if (error) {
            console.error(error);
          } else if (results.length === 0 || results[0].incomeDataAll.length === 0) {
            getCountryIncomeDataFromAPI(res);
          } else {
            const incomeData = {
              all: results[0].incomeDataAll,
              family: results[0].incomeDataFamilies,
              nonfamily: results[0].incomeDataNonFamilies
            };
            res.send(JSON.stringify(incomeData));
          }
        })
  }
});

var port = process.env.PORT || 3000;
app.listen(port);
console.log('listening on port ' + port);