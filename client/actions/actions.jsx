import {getCountyData, getStateData} from '../helpers/api.js';

function receiveCountyData(data, countyCode) {
  return {
    type: 'RECEIVE_COUNTY_DATA',
    incomeData: data,
    countyCode: countyCode
  }
}

function receiveStateData(data, stateCode) {
  return {
    type: 'RECEIVE_STATE_DATA',
    countyData: data,
    stateCode: stateCode
  }
}

export function setChartWidth(width) {
  return {type: 'SET_CHART_WIDTH', width};
}
export function setCurrentState(code, name) {
  return {type: 'SET_CURRENT_STATE', state: {code, name}};
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