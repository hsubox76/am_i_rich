import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import STATES from '../data/state-codes.js';
import mainReducer from '../reducers/reducer';

const initialState = {
  currentState: {code: "0", name: "TestState"},
  currentCounty: {code: "0", name: "TestCounty"},
  states:
      [{name: "select a state", code: "0"}].concat(STATES),
  counties: [],
  locationLevel: 'county',
  //countyIncomeData: testIncomeData,
  //stateIncomeData: testIncomeData2,
  //guessedPercentile: 25,
  //guessedIncome: 50000,
  //userIncome: 100000,
  //userPercentile: 50
};
// create a store that has redux-thunk middleware enabled
//const createStoreWithMiddleware = applyMiddleware(
//    thunk
//)(createStore);

const finalCreateStore = compose(
    // Middleware you want to use in development:
    applyMiddleware(thunk)
)(createStore);

const store = finalCreateStore(mainReducer, initialState);

// Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
//if (module.hot) {
//  module.hot.accept('../reducers', () =>
//      store.replaceReducer(require('../reducers')/*.default if you use Babel 6+ */)
//  );
//}

export default store;