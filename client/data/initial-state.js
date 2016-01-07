import {LOCATION_LEVELS, HOUSEHOLD_TYPES} from './types';
import STATES from './state-codes';

export const initialState = {
  currentState: {code: "0", name: "TestState"},
  currentCounty: {code: "0", name: "TestCounty"},
  states:
      [{name: "select a state", code: "0"}].concat(STATES),
  counties: [],
  locationLevel: LOCATION_LEVELS.COUNTY,
  householdType: HOUSEHOLD_TYPES.NONFAMILY
};