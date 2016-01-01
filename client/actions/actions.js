import {getCountyData, getCountyList, getStateData} from '../helpers/api.js';

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
export function createChart(chart) {
  return { type: 'CREATE_CHART', chart}
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