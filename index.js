var _ = require('lodash');
var express = require('express');
var app = express();

var request = require('request');
var bodyParser = require('body-parser');

var APIkey = 'fdc3a832f54351b9f6e2c40313d6232c8af5c71e';

var incomeBrackets = [
  {code: 'DP03_0052E', min: 0, max: 9999},
  {code: 'DP03_0053E', min: 10000, max: 14999},
  {code: 'DP03_0054E', min: 15000, max: 24999},
  {code: 'DP03_0055E', min: 25000, max: 34999},
  {code: 'DP03_0056E', min: 35000, max: 49999},
  {code: 'DP03_0057E', min: 50000, max: 74999},
  {code: 'DP03_0058E', min: 75000, max: 99999},
  {code: 'DP03_0059E', min: 100000, max: 149999},
  {code: 'DP03_0060E', min: 150000, max: 199999},
  {code: 'DP03_0061E', min: 200000, max: null}
];

app.use(express.static('public'));
app.use(bodyParser());

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
  }, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      res.send(response.body.slice(1));
    }
  });

});

app.get('/incomes', function (req, res) {
  var allBrackets = _.cloneDeep(incomeBrackets);
  //var allBrackets = _.reduce(incomeBrackets, function(bracketMap, bracket) {
  //  bracketMap[bracket.code] = bracket;
  //  return bracketMap;
  //}, {});
  var totalBrackets = incomeBrackets.length;
  var bracketsSoFar = 0;
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
    }, function (error, response, body) {
      if (!error) {
        bracketsSoFar++;
        allBrackets[index].households = parseInt(response.body[1][0]);
        console.log(bracketsSoFar);
        console.log(response.body);
        console.log(totalBrackets);
        if (bracketsSoFar === totalBrackets) {
          res.send(JSON.stringify(allBrackets));
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