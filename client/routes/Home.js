var React = require('react');
var $ = require('jquery');

var StateInput = React.createClass({

  onStateSelect: function (event) {
    this.props.getCountiesInState(event.target.value);
  },

  render: function () {
    var listItems = this.props.states.map(function(state) {
      return <option key={'state-'+state.code} value={state.code}>{state.name}</option>
    });
    return (
      <div className="form-group">
        <label className="control-label">State:</label>
        <select value={this.props.currentState} className="form-control" onChange={this.onStateSelect}>
          {listItems}
        </select>
      </div>
    );
  }

});

var CountyInput = React.createClass({
  onCountySelect: function (event) {
    this.props.setCurrentCounty(event.target.value);
  },
  render: function () {
    var listItems = this.props.counties.map(function(county) {
      return <option key={'county-'+county.countyCode} value={county.countyCode}>{county.name}</option>
    });
    return (
      <div className="form-group">
        <label className="control-label">County:</label>
        <select value={this.props.currentCounty} className="form-control" onChange={this.onCountySelect}>
          {listItems}
        </select>
      </div>
    );
  }
});

var LocationBox = React.createClass({
  render: function () {
    var countyInput = this.props.currentState === "0"
        ? null
        : (<CountyInput
        currentCounty={this.props.currentCounty}
        setCurrentCounty={this.props.setCounty}
        counties={this.props.counties} />);
   return (
       <div className="box-container">
         <div className="box box-location">
           <div className="box-title box-title-location">
             Where
           </div>
           <div className="box-body box-body-location">
             <form className="form-inline">
               <StateInput
                   currentState={this.props.currentState}
                   states={this.props.states}
                   getCountiesInState={this.props.getCountiesInState} />
               {countyInput}
             </form>
           </div>
         </div>
       </div>
   );
  }
});

// Home page container for the DisplayBox component
var Home = React.createClass({
  getInitialState: function (){
    return {
      currentState: "0",
      currentCounty: "0",
      states: [
        {name: "select a state", code: "0"},
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

  setCounty: function(countyCode) {
    this.setState({currentCounty: countyCode});
  },

  getCountiesInState: function(stateCode) {
    $.ajax({
      url: 'counties',
      dataType: 'json',
      type: 'GET',
      data: {state: stateCode},
      success: function(data) {
        this.setState({
          currentState: stateCode,
          counties: [{
            name: 'select a county',
            stateCode: '0',
            countyCode: '0'
          }].concat(
              data.map(function(county) {
            return {
              name: county[0].split(',')[0],
              stateCode: county[1],
              countyCode: county[2]
            }
          }))
        })
      }.bind(this)
    });
  },

  render: function() {
    return (
      <div className="main-page">
        <LocationBox
            currentState={this.state.currentState}
            currentCounty={this.state.currentCounty}
            states={this.state.states}
            counties={this.state.counties}
            getCountiesInState={this.getCountiesInState}
            setCounty={this.setCounty}
        />
        <div className="row">
          <div className="col-xs-12 col-md-8 col-md-offset-2 box">
            <div className="box box-salary">
              filler text
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Home;