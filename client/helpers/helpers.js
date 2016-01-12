import { LOCATION_LEVELS } from '../data/types.js';

export function getCurrentDataSet(locationLevel, householdType) {
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
