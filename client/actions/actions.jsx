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
export function setCurrentState(stateCode) {
  return dispatch => {
    getStateData(stateCode, data => {
      dispatch(receiveStateData(data, stateCode))
    })
  }
  //return {type: 'SET_CURRENT_STATE', stateCode}
}
export function setCurrentCounty(countyCode, stateCode) {
  return dispatch => {
    getCountyData(countyCode, stateCode, data => {
      dispatch(receiveCountyData(data, countyCode))
    })
  }
  //return {type: 'SET_CURRENT_COUNTY', countyCode}
}
export function setIncome(userIncome) {
  return {type: 'SET_INCOME', userIncome}
}
export function setPercentile(guessedPercentile) {
  return { type: 'SET_PERCENTILE', guessedPercentile }
}