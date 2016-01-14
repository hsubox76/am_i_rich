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