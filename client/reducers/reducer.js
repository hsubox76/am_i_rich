import _ from 'lodash';
import { LOADING_STATES } from '../data/types.js';


function getPercentileMap(incomeData) {
  const totalHouseholds =_.sum(incomeData, "households");
  const percentileMap = [0];
  _.forEach(_.range(0,100), function(percentile) {
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

function findPercentileAtIncome(incomeData, income) {
  // TODO: special cases at extremes, error checking for neg or 0
  const percentileMap = getPercentileMap(incomeData);
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
        stateIncomeData: action.incomeData,
        loadingStateIncomeData: LOADING_STATES.LOADED
      });
    case 'RECEIVE_COUNTY_LIST':
      return Object.assign({}, state, {
        loadingCountyList: LOADING_STATES.LOADED,
        counties: [{name: "select a county", countyCode: "0"}]
            .concat(
                action.countyData.map(function(county) {
                  return {
                    name: county[0].split(',')[0],
                    stateCode: county[1],
                    countyCode: county[2],
                    loadingCountyList: LOADING_STATES.LOADED
                  }
                })
            )
      });
    case 'RECEIVE_COUNTY_DATA':
      return Object.assign({}, state, {
        countyIncomeData: action.incomeData,
        loadingCountyIncomeData: LOADING_STATES.LOADED
      });
    case 'SET_CURRENT_COUNTY':
      return Object.assign({}, state, {
        currentCounty: action.county,
        loadingCountyIncomeData: LOADING_STATES.LOADING
      });
    case 'SET_CURRENT_STATE':
      return Object.assign({}, state, {
        currentState: action.state,
        loadingCountyList: LOADING_STATES.LOADING,
        loadingStateIncomeData: LOADING_STATES.LOADING
      });
    case 'CREATE_CHART':
      return Object.assign({}, state, {
        chart: action.chart
      });
    case 'SET_INCOME':
      const userPercentile = findPercentileAtIncome(state.countyIncomeData, action.userIncome);
      return Object.assign({}, state, {userIncome: parseInt(action.userIncome), userPercentile});
    case 'SET_PERCENTILE':
      const guessedIncome = getPercentileMap(state.countyIncomeData)[action.guessedPercentile];
      return Object.assign({}, state, {
        guessedPercentile: parseInt(action.guessedPercentile),
        guessedIncome
      });
    case 'SET_SELECTING_LOCATION_LEVEL':
      return Object.assign({}, state, {selectingLocationLevel: !state.selectingLocationLevel});
    case 'SET_LOCATION_LEVEL':
      return Object.assign({}, state, {locationLevel: action.level});
    case 'SET_SELECTING_HOUSEHOLD_TYPE':
      return Object.assign({}, state, {selectingHouseholdType: !state.selectingHouseholdType});
    case 'SET_HOUSEHOLD_TYPE': {
      return Object.assign({}, state, {householdType: action.type});
    }
    default:
      return state;
  }
}
