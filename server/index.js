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
  const mediansHashMap = _.reduce(codes.MEDIAN_CODES, function(obj, item) {
    obj[item.code] = 0;
    return obj;
  }, {});
  //const allBrackets = _.indexBy(codes.ALL_HOUSEHOLDS.concat(codes.FAMILIES), 'code');
  //const totalBrackets = allBrackets.length;
  const totalBrackets = allBrackets.length;
  let bracketsSoFar = 0;
  let mediansSoFar = 0;
  _.forEach(codes.MEDIAN_CODES, function(code, key) {
    request({
      url: 'http://api.census.gov/data/2013/acs1/profile',
      qs: _.extend({}, queryString, {'get': code}),
      json: true
    }, function (error, response) {
      mediansSoFar++;
      if (error) {
        console.error(error);
      } else if (response.statusCode !== 200) {
        console.error(response.statusCode);
      } else {
        mediansHashMap[key] = response.body[1][0];
        if (bracketsSoFar === totalBrackets && mediansSoFar === 3) {
          onRequestsDone(res, response, codeHashMap, mediansHashMap, countyCode, stateCode);
        }
      }
    });
  });
  _.forEach(codeHashMap, function(code, key) {
    request({
      url: 'http://api.census.gov/data/2013/acs1/profile',
      qs: _.extend({}, queryString, {'get': (key + ',NAME')}),
      json: true
    }, function (error, response) {
      bracketsSoFar++;
      if (error) {
        console.error(error);
        codeHashMap[key] = error;
        if (bracketsSoFar === totalBrackets) {
          res.send(codeHashMap);
        }
      } else if (response.statusCode !== 200) {
        console.error(response.statusCode);
        codeHashMap[key] = response.statusCode;
        if (bracketsSoFar === totalBrackets) {
          res.send(codeHashMap);
        }
      } else {
        codeHashMap[key] = parseInt(response.body[1][0]);
        if (bracketsSoFar === totalBrackets && mediansSoFar === 3) {
          onRequestsDone(res, response, codeHashMap, mediansHashMap, countyCode, stateCode);
        }
      }
    });
  });
}

function onRequestsDone(res, data, codeHashMap, mediansHashMap, countyCode, stateCode) {
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

  const documentData = {
    incomeDataAll: addTails(allHouseholds),
    incomeDataFamilies: addTails(familyHouseholds),
    incomeDataNonFamilies: addTails(nonFamilyHouseholds),
    medianAll: mediansHashMap.all,
    medianFamilies: mediansHashMap.family,
    medianNonFamilies: mediansHashMap.nonfamily
  };

  function onInsertDone (err, newEntry) {
    if (err || !newEntry) {
      console.error("Couldn't find entry in DB. Error: " + err);
    } else {
      const incomeData = {
        all: newEntry.incomeDataAll,
        family: newEntry.incomeDataFamilies,
        nonfamily: newEntry.incomeDataNonFamilies,
        "median-all": newEntry.medianAll,
        "median-family": newEntry.medianFamilies,
        "median-nonfamily": newEntry.medianNonFamilies
      };
      res.send(JSON.stringify(incomeData));
    }
  }

  if (countyCode) {
    County.create(_.extend({}, documentData, {
      stateCode: stateCode,
      countyCode: countyCode,
      name: data.body[1][1].split(',')[0]
    }), onInsertDone);
  } else if (stateCode) {
    console.log(documentData);
    State.findOneAndUpdate({stateCode: stateCode}, {
      $set: documentData
    }, {
      new: true
    }, onInsertDone);
  } else {
    Country.create(_.extend({}, documentData, {
      name: 'United States'
    }), {
      new: true
    }, onInsertDone);
  }
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

function sendIncomeData(res, dbData) {
  const incomeData = {
    all: dbData.incomeDataAll,
    family: dbData.incomeDataFamilies,
    nonfamily: dbData.incomeDataNonFamilies,
    "median-all": dbData.medianAll,
    "median-family": dbData.medianFamilies,
    "median-nonfamily": dbData.medianNonFamilies
  };
  res.send(JSON.stringify(incomeData));
}

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
            sendIncomeData(res, results[0]);
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
          sendIncomeData(res, results[0]);
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
            sendIncomeData(res, results[0]);
          }
        })
  }
});

var port = process.env.PORT || 3000;
app.listen(port);
console.log('listening on port ' + port);