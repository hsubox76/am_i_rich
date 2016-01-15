import {getCountyData, getCountyList, getStateData, getCountryData} from '../helpers/api.js';
import { LOCATION_LEVELS } from '../data/types.js';

function receiveCountyData(data, countyCode) {
  return {
    type: 'RECEIVE_COUNTY_DATA',
    incomeData: data,
    countyCode: countyCode
  }
}

function receiveCountyList(data, stateCode) {
  return {
    type: 'RECEIVE_COUNTY_LIST',
    countyData: data,
    stateCode: stateCode
  }
}

function receiveStateData(data, stateCode) {
  return {
    type: 'RECEIVE_STATE_DATA',
    incomeData: data,
    stateCode: stateCode
  }
}

function receiveCountryData(data) {
  return {
    type: 'RECEIVE_COUNTRY_DATA',
    incomeData: data
  }
}

export function setChartWidth(width) {
  return {type: 'SET_CHART_WIDTH', width};
}
export function setCurrentState(code, name) {
  return {type: 'SET_CURRENT_STATE', state: {code, name}};
}
export function requestCountyList(stateCode, stateName) {
  return dispatch => {
    getCountyList(stateCode, stateName, data => {
      dispatch(receiveCountyList(data, stateCode));
      dispatch(requestStateData(stateCode));
    })
  };
}
export function requestStateData(stateCode) {
  return dispatch => {
    getStateData(stateCode, data => {
      dispatch(receiveStateData(data, stateCode))
    })
  };
}
export function requestCountryData() {
  return dispatch => {
    getCountryData(data => {
      dispatch(receiveCountryData(data))
    })
  };
}
export function setCurrentCounty(code, name) {
  return {type: 'SET_CURRENT_COUNTY', county: {code, name}};
}
export function requestCountyData(countyCode, stateCode) {
  return dispatch => {
    getCountyData(countyCode, stateCode, data => {
      dispatch(receiveCountyData(data, countyCode))
    })
  }
}
export function setIncome(userIncome) {
  return {type: 'SET_INCOME', userIncome}
}
export function setPercentile(guessedPercentile) {
  return { type: 'SET_PERCENTILE', guessedPercentile }
}
export function calculatePercentileAndIncome(props) {
  return { type: 'CALCULATE_PERCENTILE_AND_INCOME', props }
}
export function createChart(chartData) {
  return { type: 'CREATE_CHART', chartData}
}
export function emptyChart() {
  return { type: 'EMPTY_CHART' }
}
export function setSelectingLocationLevel() {
  return { type: 'SET_SELECTING_LOCATION_LEVEL'}
}
export function setLocationLevel(level) {
  return { type: 'SET_LOCATION_LEVEL', level }
}
export function setSelectingHouseholdType() {
  return { type: 'SET_SELECTING_HOUSEHOLD_TYPE'}
}
export function setHouseholdType(householdType) {
  return { type: 'SET_HOUSEHOLD_TYPE', householdType }
}
export function resetApp() {
  return { type: 'RESET' }
}
export function setCurrentDataSet() {
  return { type: 'SET_DATA_SET' };
}
export function toggleMarker(markerName) {
  return { type: 'TOGGLE_MARKER', markerName };
}
export function setCurrentPage(pageName) {
  return { type: 'SET_CURRENT_PAGE', pageName };
}