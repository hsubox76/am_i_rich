import { createStore } from 'redux';
import STATES from '../data/state-codes.js';
import mainReducer from '../reducers/reducer';

const initialState = {
  currentState: "0",
  currentCounty: "0",
  states:
      [{name: "select a state", code: "0"}].concat(STATES),
  counties: []
};

let store = createStore(mainReducer, initialState);

export default store;