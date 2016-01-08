import { LOCATION_LEVELS } from '../data/types.js';

export function getCurrentDataSet(state) {
  switch(state.locationLevel) {
    case LOCATION_LEVELS.COUNTY:
      return state.countyIncomeData[state.householdType];
    case LOCATION_LEVELS.STATE:
      return state.stateIncomeData[state.householdType];
    case LOCATION_LEVELS.US:
      return state.countryIncomeData[state.householdType];
    default:
      return state.countryIncomeData[state.householdType];
  }
}
