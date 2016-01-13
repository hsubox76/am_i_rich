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

export function postToFacebook() {
  FB.ui({
    method: 'feed',
    link: "http://52.25.45.188/",
    picture: "http://52.25.45.188/images/chart-thumb.png",
    description: "Find out how rich or poor you really are.  (Example results above.)",
    "redirect-uri": "http://localhost:3000/"
  });
}