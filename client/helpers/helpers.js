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

export function postToFacebook(message) {
  FB.ui({
    method: 'feed',
    link: "http://percentilizer.com",
    picture: "http://percentilizer.com/images/chart-thumb.png",
    description: message,
    "redirect-uri": "http://percentilizer.com/"
  });
}