import _ from 'lodash';
import { HOUSEHOLD_TYPES, LOCATION_LEVELS, LOADING_STATES } from '../data/types.js';
//import { getCurrentDataSet } from '../helpers/helpers.js';
import {initialState} from '../data/initial-state.js';

export function getCurrentDataSet(state, locationLevel, householdType) {
  switch(locationLevel) {
    case LOCATION_LEVELS.COUNTY:
      return state.countyIncomeData[householdType];
    case LOCATION_LEVELS.STATE:
      return state.stateIncomeData[householdType];
    case LOCATION_LEVELS.US:
      return state.countryIncomeData[householdType];
    default:
      return state.countryIncomeData[householdType];
  }
}

export function getCurrentMedian(state, locationLevel, householdType) {
  const key = 'median-' + householdType;
  switch(locationLevel) {
    case LOCATION_LEVELS.COUNTY:
      return state.countyIncomeData[key];
    case LOCATION_LEVELS.STATE:
      return state.stateIncomeData[key];
    case LOCATION_LEVELS.US:
      return state.countryIncomeData[key];
    default:
      return state.countryIncomeData[key];
  }
}

function getPercentileMap(state) {
  const incomeData = getCurrentDataSet(state, state.locationLevel, state.householdType);
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

function findPercentileAtIncome(state) {
  // TODO: special cases at extremes, error checking for neg or 0
  const percentileMap = getPercentileMap(state);
  const income = state.userIncome;
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
    case 'RESET':
      return Object.assign({}, initialState, {countryIncomeData: state.countryIncomeData});
    case 'SET_CURRENT_PAGE':
      return Object.assign({}, state, {currentPage: action.pageName});
    case 'SET_CHART_WIDTH':
      return Object.assign({}, state, {chartWidth: action.width});
    case 'RECEIVE_COUNTRY_DATA':
      return Object.assign({}, state, {
        countryIncomeData: action.incomeData,
        loadingCountryIncomeData: LOADING_STATES.LOADED
      });
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
      const stateWithNewData =
          Object.assign({}, state, {
            countyIncomeData: action.incomeData
          });
      return Object.assign({}, state, {
        countyIncomeData: action.incomeData,
        loadingCountyIncomeData: LOADING_STATES.LOADED,
        currentMedianValue: getCurrentMedian(stateWithNewData,
            state.locationLevel,
            state.householdType),
        currentIncomeData: getCurrentDataSet(stateWithNewData,
            state.locationLevel,
            state.householdType)
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
        chartData: action.chartData
      });
    case 'EMPTY_CHART':
      return Object.assign({}, state, {
        chartData: null
      });
    case 'SET_INCOME':
      const userIncome = action.userIncome || state.userIncome;
      //const userPercentile = findPercentileAtIncome(state, userIncome);
      return Object.assign({}, state, {userIncome: parseInt(userIncome)});
    case 'SET_PERCENTILE':
      const guessedPercentile = action.guessedPercentile || state.guessedPercentile;
      //const guessedIncome = getPercentileMap(state)[guessedPercentile];
      return Object.assign({}, state, {
        guessedPercentile: parseInt(guessedPercentile)
      });
    case 'CALCULATE_PERCENTILE_AND_INCOME':
      const userPercentile = findPercentileAtIncome(state);
      const guessedIncome = getPercentileMap(state)[state.guessedPercentile];
      return Object.assign({}, state, {
        userPercentile,
        guessedIncome
      });
    case 'SET_SELECTING_LOCATION_LEVEL':
      return Object.assign({}, state, {selectingLocationLevel: !state.selectingLocationLevel});
    case 'SET_LOCATION_LEVEL':
      return Object.assign({}, state, {
        locationLevel: action.level,
        currentMedianValue: getCurrentMedian(state, action.level, state.householdType),
        currentIncomeData: getCurrentDataSet(state, action.level, state.householdType)
      });
    case 'SET_SELECTING_HOUSEHOLD_TYPE':
      return Object.assign({}, state, {selectingHouseholdType: !state.selectingHouseholdType});
    case 'SET_HOUSEHOLD_TYPE':
      return Object.assign({}, state, {
        householdType: action.householdType,
        currentMedianValue: getCurrentMedian(state, state.locationLevel, action.householdType),
        currentIncomeData: getCurrentDataSet(state, state.locationLevel, action.householdType)
      });
    case 'SET_DATA_SET':
      return Object.assign({}, state, {
        currentIncomeData: getCurrentDataSet(state, state.locationLevel, state.householdType)
      });
    case 'TOGGLE_MARKER':
        const newMarkerShowState = _.clone(state.markerShowState);
        newMarkerShowState[action.markerName] = !state.markerShowState[action.markerName];
      return Object.assign({}, state, {
        markerShowState: newMarkerShowState
      });
    default:
      return state;
  }
}
