'use strict';

const _ = require('lodash');
const express = require('express');
const app = express();

const APIkey = process.env.API_KEY || require('./apikey_local');

const request = require('request');
const bodyParser = require('body-parser');

const incomeBrackets = [
  {code: 'DP03_0052E', min: 0, max: 9999},
  {code: 'DP03_0053E', min: 10000, max: 14999},
  {code: 'DP03_0054E', min: 15000, max: 24999},
  {code: 'DP03_0055E', min: 25000, max: 34999},
  {code: 'DP03_0056E', min: 35000, max: 49999},
  {code: 'DP03_0057E', min: 50000, max: 74999},
  {code: 'DP03_0058E', min: 75000, max: 99999},
  {code: 'DP03_0059E', min: 100000, max: 149999},
  {code: 'DP03_0060E', min: 150000, max: 199999},
  {code: 'DP03_0061E', min: 200000, max: 225000}
];

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/counties', function (req, res) {
  console.log(req.query);

  request({
    url: 'http://api.census.gov/data/2013/acs1/profile',
    qs: {
      'get': 'NAME',
      'for': 'county:*',
      'in': 'state:' + req.query.state,
      'key': APIkey
    },
    json: true
  }, function (error, response) {
    if (!error && response.statusCode === 200) {
      res.send(response.body.slice(1));
    }
  });

});

app.get('/incomes', function (req, res) {
  const allBrackets = _.cloneDeep(incomeBrackets);
  const totalBrackets = incomeBrackets.length;
  let bracketsSoFar = 0;
  _.forEach(allBrackets, function(bracket, index) {
    request({
      url: 'http://api.census.gov/data/2013/acs1/profile',
      qs: {
        'get': bracket.code + ',NAME',
        'for': 'county:' + req.query.countyCode,
        'in': 'state:' + req.query.stateCode,
        'key': APIkey
      },
      json: true
    }, function (error, response) {
      if (!error) {
        bracketsSoFar++;
        allBrackets[index].households = parseInt(response.body[1][0]);
        if (bracketsSoFar === totalBrackets) {
          // Split first point into 2 points to smooth out beginning and have it start at 0
          const zeroBracket = {min: 0, max: 0, households: allBrackets[0].households * 0.25};
          allBrackets[0].households *= 0.75;
          res.send(JSON.stringify(zeroBracket.concat(allBrackets)));
        }
      }
      else {
        console.error(error);
        res.send(error);
      }
    });
  });
});

var port = process.env.PORT || 3000;
app.listen(port);
console.log('listening on port ' + port);