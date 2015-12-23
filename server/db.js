const mongoose = require('mongoose');

mongoose.connect('mongodb://amirich:amirich@localhost/census2014?authSource=admin');


const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

const countySchema = new Schema({
  countyCode: String,
  name: String,
  stateCode: String,
  incomeData: Array
});

const stateSchema = new Schema({
  stateCode: String,
  counties: Array
});

const County = mongoose.model('County', countySchema);
const State = mongoose.model('State', stateSchema);

//County.create({countyCode: "01", name: "mr. county", stateCode: "02"}, function(err, newCounty) {
//  if (err) console.log(err);
//  else console.log(newCounty);
//});

exports.County = County;
exports.State = State;