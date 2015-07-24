var React = require('react');

var StateInput = React.createClass({

  getInitialState: function() {
    return {
      value: '01'
    }
  },

  handleStateSelect: function (event) {
    this.setState({value: event.target.value});
    console.log(event.target.value);
    this.props.getCountiesInState(event.target.value);
  },

  render: function () {
    var listItems = this.props.states.map(function(state) {
      return <option key={'state-'+state.code} value={state.code}>{state.name}</option>
    });
    return (
      <div className="form-group">
        <label className="col-sm-2 control-label">State:</label>
        <div className="col-sm-10">
          <select value={this.state.value} className="form-control" onChange={this.handleStateSelect}>
            {listItems}
          </select>
        </div>
      </div>
    );
  }

});

var CountyInput = React.createClass({
  render: function () {
    var listItems = this.props.counties.map(function(county) {
      return <option key={'county-'+county.countyCode} value={county.countyCode}>{county.name}</option>
    });
    return (
      <div className="form-group">
        <label className="col-sm-2 control-label">County:</label>
        <div className="col-sm-10">
          <select className="form-control">
            {listItems}
          </select>
        </div>
      </div>
    );
  }
});

// Home page container for the DisplayBox component
var Home = React.createClass({
  getInitialState: function (){
    return {
      states: [
        {name: "Alabama", code: "01"},
        {name: "Alaska", code: "02"},
        {name: "Arizona", code: "04"},
        {name: "Arkansas", code: "05"},
        {name: "California", code: "06"},
        {name: "Colorado", code: "08"},
        {name: "Connecticut", code: "09"},
        {name: "Delaware", code: "10"},
        {name: "District of Columbia", code: "11"},
        {name: "Florida", code: "12"},
        {name: "Georgia", code: "13"},
        {name: "Hawaii", code: "15"},
        {name: "Idaho", code: "16"},
        {name: "Illinois", code: "17"},
        {name: "Indiana", code: "18"},
        {name: "Iowa", code: "19"},
        {name: "Kansas", code: "20"},
        {name: "Kentucky", code: "21"},
        {name: "Louisiana", code: "22"},
        {name: "Maine", code: "23"},
        {name: "Maryland", code: "24"},
        {name: "Massachusetts", code: "25"},
        {name: "Michigan", code: "26"},
        {name: "Minnesota", code: "27"},
        {name: "Mississippi", code: "28"},
        {name: "Missouri", code: "29"},
        {name: "Montana", code: "30"},
        {name: "Nebraska", code: "31"},
        {name: "Nevada", code: "32"},
        {name: "New Hampshire", code: "33"},
        {name: "New Jersey", code: "34"},
        {name: "New Mexico", code: "35"},
        {name: "New York", code: "36"},
        {name: "North Carolina", code: "37"},
        {name: "North Dakota", code: "38"},
        {name: "Ohio", code: "39"},
        {name: "Oklahoma", code: "40"},
        {name: "Oregon", code: "41"},
        {name: "Pennsylvania", code: "42"},
        {name: "Rhode Island", code: "44"},
        {name: "South Carolina", code: "45"},
        {name: "South Dakota", code: "46"},
        {name: "Tennessee", code: "47"},
        {name: "Texas", code: "48"},
        {name: "Utah", code: "49"},
        {name: "Vermont", code: "50"},
        {name: "Virginia", code: "51"},
        {name: "Washington", code: "53"},
        {name: "West Virginia", code: "54"},
        {name: "Wisconsin", code: "55"},
        {name: "Wyoming", code: "56"},
        {name: "Puerto Rico", code: "72"}
      ],
      counties: []
    };
  },

  getCountiesInState: function(stateCode) {
    $.ajax({
      url: 'counties',
      dataType: 'json',
      type: 'GET',
      data: {state: stateCode},
      success: function(data) {
        this.setState({
          counties: data.map(function(county) {
            return {
              name: county[0].split(',')[0],
              stateCode: county[1],
              countyCode: county[2]
            }
          })
        })
      }.bind(this)
    });
  },

  render: function() {
    return (
      <div className="main-page">
        <div className="row">
          <div className="col-xs-6 col-md-4 col-md-offset-2">
            <div className="panel panel-default">
              <div className="panel-heading">
                <h3 className="panel-title">Where Are You At?</h3>
              </div>
              <div className="panel-body">
                <form className="form-horizontal">
                <StateInput
                  states={this.state.states}
                  getCountiesInState={this.getCountiesInState} />
                <CountyInput counties={this.state.counties} />
                </form>
              </div>
            </div>
          </div>
          <div className="col-xs-6 col-md-4">
            <div className="panel panel-default">
              <div className="panel-heading">
                <h3 className="panel-title">How Much Do You Make?</h3>
              </div>
              <div className="panel-body">

              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Home;