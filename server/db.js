const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/census2014');


const Schema = mongoose.Schema;

const countrySchema = new Schema({
  name: String,
  incomeDataAll: Array,
  incomeDataFamilies: Array,
  incomeDataNonFamilies: Array,
  medianAll: Number,
  medianFamilies: Number,
  medianNonFamilies: Number
});

const countySchema = new Schema({
  countyCode: String,
  name: String,
  stateCode: String,
  incomeDataAll: Array,
  incomeDataFamilies: Array,
  incomeDataNonFamilies: Array,
  medianAll: Number,
  medianFamilies: Number,
  medianNonFamilies: Number
});

const stateSchema = new Schema({
  stateCode: String,
  name: String,
  counties: Array,
  incomeDataAll: Array,
  incomeDataFamilies: Array,
  incomeDataNonFamilies: Array,
  medianAll: Number,
  medianFamilies: Number,
  medianNonFamilies: Number
});

const County = mongoose.model('County', countySchema);
const State = mongoose.model('State', stateSchema);
const Country = mongoose.model('Country', countrySchema);

exports.County = County;
exports.State = State;
exports.Country = Country;