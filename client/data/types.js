export const HOUSEHOLD_TYPES = {
  NONFAMILY: 'nonfamily',
  FAMILY: 'family',
  ALL: 'all'
};

export const LOCATION_LEVELS = {
  COUNTY: 'county',
  STATE: 'state',
  US: 'us'
};

export const LOADING_STATES = {
  LOADING: 'loading',
  LOADED: 'loaded'
};

export const INCOME_TIME_PERIODS = {
  YEAR: {text: 'per year', divideBy: 1},
  WEEK: {text: 'per week', divideBy: 52},
  HOUR: {text: 'per hour', divideBy: 40 * 52}
};

export const MARKERS = [
  {
    title: 'your income',
    className: 'user-income-label',
    show: true
  },
  {
    title: 'your guess',
      className: 'user-guess-label',
      show: true
  },
  {
    title: 'median',
    className: 'median-label',
    show: false
  }
];

export const FAQ = [
  {
    question: "Why isn't my county included?",
    answer: "The ACS is a survey so apparently it only includes " +
    "a sampling of counties, 26% to be exact. If you can't find your " +
    "county, you can pick a nearby one, or pick \"My county isn't listed\" to " +
    "just get the info for your state.",
    show: false
  }
];