
  export function setChartWidth(width) {
    return {type: 'SET_CHART_WIDTH', width};
  }
  export function setCurrentState(stateCode) {
    return {type: 'SET_CURRENT_STATE', stateCode}
  }
  export function setCurrentCounty(countyCode) {
    return {type: 'SET_CURRENT_COUNTY', countyCode}
  }
  export function setIncome(userIncome) {
    return {type: 'SET_INCOME', userIncome}
  }
  export function setPercentile(guessedPercentile) {
    return { type: 'SET_PERCENTILE', guessedPercentile }
  }