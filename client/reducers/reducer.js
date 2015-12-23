import _ from 'lodash';


function getPercentileMap(state) {
  const incomeData = state.incomeData;
  const totalHouseholds =_.sum(incomeData, "households");
  const percentileMap = [0];
  _.forEach(_.range(1,99), function(percentile) {
    const householdsInPercentile = percentile / 100 * totalHouseholds;
    // find correct income bracket
    let householdAccumulator = 0;
    _.forEach(incomeData, function(incomeBracket) {
      householdAccumulator = householdAccumulator + incomeBracket.households;
      if (householdAccumulator > householdsInPercentile) { // this is the right bracket
        const bracketMin = householdAccumulator - incomeBracket.households
        const percentilePosition =
            (householdsInPercentile - bracketMin) / incomeBracket.households;
        percentileMap[percentile] =
            (percentilePosition * (incomeBracket.max - incomeBracket.min)) + incomeBracket.min;
        return false;
      }
    });
  });
  return percentileMap;
}

function findPercentileAtIncome(state, income) {
  // TODO: special cases at extremes, error checking for neg or 0
  const percentileMap = getPercentileMap(state);
  const samples = percentileMap.length;
  let i = Math.round(samples / 2);
  let top = samples;
  let bottom = 0;
  while (true) {
    if (income > percentileMap[i] && income > percentileMap[i+1]) {
      bottom = i;
      i = bottom + Math.round((top - i) / 2);
    } else if (income < percentileMap[i] && income < percentileMap[i-1]) {
      top = i;
      i = bottom + Math.round((i - bottom) / 2);
    } else {
      // cases:
      // income === percentileMap[i]
      // percentileMap[i-1] < income < percentileMap[i]
      // percentileMap[i] < income < percentileMap[i+1]
      if (income < percentileMap[i]) {
        // be consistent, income should always be higher than percentile boundary
        i++;
      }
      break;
    }
  }
  return i;
}

export default function mainReducer(state, action) {
  switch (action.type) {
    case 'SET_CHART_WIDTH':
      return Object.assign({}, state, {chartWidth: action.width});
    case 'RECEIVE_STATE_DATA':
      return Object.assign({}, state, {
        currentState: action.stateCode,
        counties: [{name: "select a county", countyCode: "0"}]
            .concat(
                action.countyData.map(function(county) {
                return {
                  name: county[0].split(',')[0],
                  stateCode: county[1],
                  countyCode: county[2],
                  loadingCountyList: false
                }
              })
            )
      });
    case 'RECEIVE_COUNTY_DATA':
      return Object.assign({}, state, {
        currentCounty: action.countyCode,
        incomeData: action.incomeData,
        loadingIncomeData: false
      });
    case 'SET_CURRENT_COUNTY':
      return Object.assign({}, state, {
        loadingIncomeData: true
      });
    case 'SET_CURRENT_STATE':
      return Object.assign({}, state, {
        loadingCountyList: true
      });
    case 'SET_INCOME':
      const userPercentile = findPercentileAtIncome(state, action.userIncome);
      return Object.assign({}, state, {userIncome: parseInt(action.userIncome), userPercentile});
    case 'SET_PERCENTILE':
      const guessedIncome = getPercentileMap(state)[action.guessedPercentile];
      return Object.assign({}, state, {
        guessedPercentile: parseInt(action.guessedPercentile),
        guessedIncome
      });
    default:
      return state;
  }
}
