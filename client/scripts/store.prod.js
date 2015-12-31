import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import STATES from '../data/state-codes';
import mainReducer from '../reducers/reducer';

const initialState = {
  currentState: {code: "0", name: "TestState"},
  currentCounty: {code: "0", name: "TestCounty"},
  states:
      [{name: "select a state", code: "0"}].concat(STATES),
  counties: [],
  locationLevel: 'county'
};

const finalCreateStore = compose(
    // Middleware you want to use in development:
    applyMiddleware(thunk)
)(createStore);

const store = finalCreateStore(mainReducer, initialState);

export default store;