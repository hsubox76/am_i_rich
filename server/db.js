const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/census2014');


const Schema = mongoose.Schema;

const countySchema = new Schema({
  countyCode: String,
  name: String,
  stateCode: String,
  incomeDataAll: Array,
  incomeDataFamilies: Array,
  incomeDataNonFamilies: Array
});

const stateSchema = new Schema({
  stateCode: String,
  name: String,
  counties: Array,
  incomeDataAll: Array,
  incomeDataFamilies: Array,
  incomeDataNonFamilies: Array
});

const County = mongoose.model('County', countySchema);
const State = mongoose.model('State', stateSchema);

exports.County = County;
exports.State = State;