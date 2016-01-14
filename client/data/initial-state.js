import {LOCATION_LEVELS, HOUSEHOLD_TYPES, MARKERS} from './types';
import STATES from './state-codes';
import _ from 'lodash';

export const initialState = {
  currentState: {code: "0", name: "TestState"},
  currentCounty: {code: "0", name: "TestCounty"},
  states:
      [{name: "select a state", code: "0"}].concat(STATES),
  counties: [],
  locationLevel: LOCATION_LEVELS.COUNTY,
  householdType: HOUSEHOLD_TYPES.NONFAMILY,
  currentIncomeData: null,
  currentMedianValue: null,
  currentPage: 'app',
  chartData: null,
  markerShowState: _.reduce(MARKERS, function(obj, marker) {
    obj[marker.title] = marker.show;
    return obj;
  }, {})
};