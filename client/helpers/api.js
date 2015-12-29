import $ from 'jquery';

export function getCountyData(countyCode, stateCode, cb) {
  $.ajax({
    url: 'incomes',
    dataType: 'json',
    type: 'GET',
    data: {county: countyCode, state: stateCode},
    success: function(data) {
      cb(data);
    }.bind(this)
  });
}

export function getCountyList(stateCode, stateName, cb) {
  $.ajax({
    url: 'counties',
    dataType: 'json',
    type: 'GET',
    data: {state: stateCode, stateName: stateName},
    success: function(data) {
      cb(data);
    }.bind(this)
  });
}

export function getStateData(stateCode, cb) {
  $.ajax({
    url: 'incomes',
    dataType: 'json',
    type: 'GET',
    data: {state: stateCode},
    success: function(data) {
      cb(data);
    }.bind(this)
  });
}
