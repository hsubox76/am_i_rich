'use strict';

const _ = require('lodash');
const express = require('express');
const db = require('./db');
const codes = require('./lookup_codes');

const State = db.State;
const County = db.County;
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

function getStateIncomeDataFromAPI(stateCode, res) {
  getIncomeDataFromAPI(stateCode, null, res);
}

function getCountyIncomeDataFromAPI(stateCode, countyCode, res) {
  getIncomeDataFromAPI(stateCode, countyCode, res);
}

function getIncomeDataFromAPI(stateCode, countyCode, res) {
  const queryString = countyCode
      ? {
          'for': 'county:' + countyCode,
          'in': 'state:' + stateCode,
          'key': APIkey
        }
      : {
          'for': 'state:' + stateCode,
          'key': APIkey
        };
  const allBrackets = _.cloneDeep(codes.ALL_HOUSEHOLDS);
  const totalBrackets = allBrackets.length;
  let bracketsSoFar = 0;
  _.forEach(allBrackets, function(bracket, index) {
    request({
      url: 'http://api.census.gov/data/2013/acs1/profile',
      qs: _.extend({}, queryString, {'get': (bracket.code + ',NAME')}),
      json: true
    }, function (error, response) {
      bracketsSoFar++;
      if (error) {
        console.error(error);
        allBrackets[index].error = error;
        if (bracketsSoFar === totalBrackets) {
          res.send(allBrackets);
        }
      } else if (response.statusCode !== 200) {
        console.error(response);
        allBrackets[index].error = response;
        if (bracketsSoFar === totalBrackets) {
          res.send(allBrackets);
        }
      } else {
        allBrackets[index].households = parseInt(response.body[1][0]);
        if (bracketsSoFar === totalBrackets) {
          // Split first point into 2 points to smooth out beginning and have it start at 0
          //const zeroBracket = [{min: 0, max: 0, households: allBrackets[0].households * 0.25}];
          //allBrackets[0].households *= 0.75;
          const formattedBrackets = addTails(allBrackets);
          if (countyCode) {
            County.create({
              stateCode: stateCode,
              countyCode: countyCode,
              name: response.body[1][1].split(',')[0],
              incomeData: formattedBrackets
            }, function(err, newCounty) {
              if (err) {
                console.error(err);
              } else {
                res.send(JSON.stringify(newCounty.incomeData));
              }
            });
          } else {
            State.findOneAndUpdate({stateCode: stateCode}, {
              $set: {incomeData: formattedBrackets}
            }, {
              new: true
            }, function(err, newState) {
              console.log(err);
              console.log(newState.incomeData);
              if (err) {
                console.error(err);
              } else {
                res.send(JSON.stringify(newState.incomeData));
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
            res.send(JSON.stringify(results[0].incomeData));
          }
        });
  } else {
    State.find({stateCode: req.query.state})
      .exec(function(error, results) {
        if (error) {
          console.error(error);
        } else if (results.length === 0 || results[0].incomeData.length === 0) {
          getStateIncomeDataFromAPI(state, res);
        } else {
          res.send(JSON.stringify(results[0].incomeData));
        }
      })
  }
});

var port = process.env.PORT || 3000;
app.listen(port);
console.log('listening on port ' + port);