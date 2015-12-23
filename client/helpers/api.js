import $ from 'jquery';

export function getCountyData(countyCode, stateCode, cb) {
  $.ajax({
    url: 'incomes',
    dataType: 'json',
    type: 'GET',
    data: {county: countyCode, state: stateCode},
    success: function(data) {
      cb(data);
      //this.setState({incomeData: data});
    }.bind(this)
  });
}

export function getStateData(stateCode, cb) {
  $.ajax({
    url: 'counties',
    dataType: 'json',
    type: 'GET',
    data: {state: stateCode},
    success: function(data) {
      cb(data);
      //this.setState({
      //  currentState: stateCode,
      //  counties: [{
      //    name: 'select a county',
      //    stateCode: '0',
      //    countyCode: '0'
      //  }].concat(
      //      data.map(function(county) {
      //    return {
      //      name: county[0].split(',')[0],
      //      stateCode: county[1],
      //      countyCode: county[2]
      //    }
      //  }))
      //})
    }.bind(this)
  });
}