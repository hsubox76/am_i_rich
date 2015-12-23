import _ from 'lodash';

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

function getPercentileMap(state) {
  const incomeData = state.incomeData;
  const totalHouseholds =_.sum(incomeData, "households");
  const percentileMap = [0];
  _.forEach(_.range(1,99), function(percentile) {
    const householdsInPercentile = percentile / 100 * totalHouseholds;
    // find correct income bracket
    let householdAccumulator = 0;
    _.forEach(incomeData, function(incomeBracket) {
      householdAccumulator = householdAccumulator + incomeBracket.households;
      if (householdAccumulator > householdsInPercentile) { // this is the right bracket
        const bracketMin = householdAccumulator - incomeBracket.households
        const percentilePosition =
            (householdsInPercentile - bracketMin) / incomeBracket.households;
        percentileMap[percentile] =
            (percentilePosition * (incomeBracket.max - incomeBracket.min)) + incomeBracket.min;
        return false;
      }
    });
  });
  return percentileMap;
}

function findPercentileAtIncome(state, income) {
  // TODO: special cases at extremes, error checking for neg or 0
  const percentileMap = getPercentileMap(state);
  const samples = percentileMap.length;
  let i = Math.round(samples / 2);
  let top = samples;
  let bottom = 0;
  while (true) {
    if (income > percentileMap[i] && income > percentileMap[i+1]) {
      bottom = i;
      i = bottom + Math.round((top - i) / 2);
    } else if (income < percentileMap[i] && income < percentileMap[i-1]) {
      top = i;
      i = bottom + Math.round((i - bottom) / 2);
    } else {
      // cases:
      // income === percentileMap[i]
      // percentileMap[i-1] < income < percentileMap[i]
      // percentileMap[i] < income < percentileMap[i+1]
      if (income < percentileMap[i]) {
        // be consistent, income should always be higher than percentile boundary
        i++;
      }
      break;
    }
  }
  return i;
}

export default function mainReducer(state, action) {
  switch (action.type) {
    case 'SET_CHART_WIDTH':
      return Object.assign({}, state, {chartWidth: action.width});
    case 'RECEIVE_STATE_DATA':
      return Object.assign({}, state, {
        currentState: action.stateCode,
        counties: [{name: "select a county", countyCode: "0"}]
            .concat(
                action.countyData.map(function(county) {
                return {
                  name: county[0].split(',')[0],
                  stateCode: county[1],
                  countyCode: county[2],
                  loadingCountyList: false
                }
              })
            )
      });
    case 'RECEIVE_COUNTY_DATA':
      return Object.assign({}, state, {
        currentCounty: action.countyCode,
        incomeData: action.incomeData,
        loadingIncomeData: false
      });
    case 'SET_CURRENT_COUNTY':
      return Object.assign({}, state, {
        loadingIncomeData: true
      });
    case 'SET_CURRENT_STATE':
      return Object.assign({}, state, {
        loadingCountyList: true
      });
    case 'SET_INCOME':
      const userPercentile = findPercentileAtIncome(state, action.userIncome);
      return Object.assign({}, state, {userIncome: parseInt(action.userIncome), userPercentile});
    case 'SET_PERCENTILE':
      const guessedIncome = getPercentileMap(state)[action.guessedPercentile];
      return Object.assign({}, state, {
        guessedPercentile: parseInt(action.guessedPercentile),
        guessedIncome
      });
    default:
      return state;
  }
}
