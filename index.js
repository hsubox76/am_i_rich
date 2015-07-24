var express = require('express');
var app = express();

var request = require('request');
var bodyParser = require('body-parser');

var APIkey = 'fdc3a832f54351b9f6e2c40313d6232c8af5c71e';

app.use(express.static('client'));
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

var port = process.env.PORT || 3000;
app.listen(port);
console.log('listening on port ' + port);