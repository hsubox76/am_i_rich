import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import STATES from '../data/state-codes.js';
import mainReducer from '../reducers/reducer';

const testIncomeData = [{"min":0,"max":0,"households":4657 * 0.25},
  {"code":"DP03_0052E","min":0,"max":9999,"households":4657 * 0.75},
  {"code":"DP03_0053E","min":10000,"max":14999,"households":3723},
  {"code":"DP03_0054E","min":15000,"max":24999,"households":10221},
  {"code":"DP03_0055E","min":25000,"max":34999,"households":7778},
  {"code":"DP03_0056E","min":35000,"max":49999,"households":11813},
  {"code":"DP03_0057E","min":50000,"max":74999,"households":11643},
  {"code":"DP03_0058E","min":75000,"max":99999,"households":8010},
  {"code":"DP03_0059E","min":100000,"max":149999,"households":7286},
  {"code":"DP03_0060E","min":150000,"max":199999,"households":2401},
  {"code":"DP03_0061E","min":200000,"max":225000, "households":2727}];


const testCountyData = [
  [
    "Anchorage Municipality, Alaska",
    "02",
    "020"
  ],
  [
    "Fairbanks North Star Borough, Alaska",
    "02",
    "090"
  ],
  [
    "Matanuska-Susitna Borough, Alaska",
    "02",
    "170"
  ]
];

const initialState = {
  currentState: "0",
  currentCounty: "0",
  states:
      [{name: "select a state", code: "0"}].concat(STATES),
  counties: [],
  //incomeData: testIncomeData,
  //guessedPercentile: 25,
  //guessedIncome: 50000,
  //userIncome: 100000,
  //userPercentile: 50
};
// create a store that has redux-thunk middleware enabled
const createStoreWithMiddleware = applyMiddleware(
    thunk
)(createStore);

let store = createStoreWithMiddleware(mainReducer, initialState);

export default store;