"use strict";

import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import D3Chart from './d3-chart';

const testIncomeData = [{"min":0,"max":0,"households":4657 * 0.25},{"code":"DP03_0052E","min":0,"max":9999,"households":4657 * 0.75},{"code":"DP03_0053E","min":10000,"max":14999,"households":3723},{"code":"DP03_0054E","min":15000,"max":24999,"households":10221},{"code":"DP03_0055E","min":25000,"max":34999,"households":7778},{"code":"DP03_0056E","min":35000,"max":49999,"households":11813},{"code":"DP03_0057E","min":50000,"max":74999,"households":11643},{"code":"DP03_0058E","min":75000,"max":99999,"households":8010},{"code":"DP03_0059E","min":100000,"max":149999,"households":7286},{"code":"DP03_0060E","min":150000,"max":199999,"households":2401},{"code":"DP03_0061E","min":200000,"max":225000,"households":2727}];
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

const StateInput = React.createClass({

  onStateSelect: function (event) {
    this.props.getCountiesInState(event.target.value);
  },

  render: function () {
    const listItems = this.props.states.map(function(state) {
      return <option key={'state-'+state.code} value={state.code}>{state.name}</option>
    });
    return (
      <div className="form-group">
        <label className="control-label label-state">State:</label>
        <select value={this.props.currentState} className="form-control select-state" onChange={this.onStateSelect}>
          {listItems}
        </select>
      </div>
    );
  }

});

const CountyInput = React.createClass({
  onCountySelect: function (event) {
    this.props.setCurrentCounty(event.target.value);
  },
  render: function () {
    const listItems = this.props.counties.map(function(county) {
      return <option key={'county-'+county.countyCode} value={county.countyCode}>{county.name}</option>
    });
    return (
      <div className="form-group">
        <label className="control-label label-county">County:</label>
        <select value={this.props.currentCounty} className="form-control select-county" onChange={this.onCountySelect}>
          {listItems}
        </select>
      </div>
    );
  }
});

const LocationBox = React.createClass({
  render: function () {
    const countyInput = this.props.currentState === "0"
        ? null
        : (<CountyInput
        currentCounty={this.props.currentCounty}
        setCurrentCounty={this.props.setCounty}
        counties={this.props.counties} />);
   return (
       <div className="row">
       <div className="box-container col-md-8 col-md-offset-2">
         <div className="box box-location">
           <div className="box-title box-title-location">
             <div className="number-circle">1</div>
           </div>
           <div className="box-body box-body-location">
             <form className="form-flex">
               <StateInput
                   currentState={this.props.currentState}
                   states={this.props.states}
                   getCountiesInState={this.props.getCountiesInState} />
               {countyInput}
             </form>
           </div>
         </div>
       </div>
       </div>
   );
  }
});

const IncomeBox = React.createClass({
  propTypes: {
    setIncome: React.PropTypes.func
  },
  onSubmit(e) {
    e.preventDefault();
    const self = this;
    this.props.setIncome(self.refs.income.getDOMNode().value);
  },
  render: function() {
    return (
      <div className="row">
        <div className="box-container col-md-8 col-md-offset-2">
          <div className="box box-income">
            <div className="box-title box-title-income">
              <div className="number-circle">2</div>
            </div>
            <div className="box-body box-body-income">
              <form
                  className="form-flex"
                  onSubmit={this.onSubmit}
                  ref="form">
                <label className="control-label label-income">How Much Do You Make?</label>
                <div className="input-group input-income">
                  <span className="input-group-addon">$</span>
                  <input
                      type="number"
                      className="form-control"
                      required={true}
                      ref="income"
                      aria-label="Amount (to the nearest dollar)" />
                    <span className="input-group-addon">.00</span>
                </div>
                <button className="button-next">
                  <span
                      className="glyphicon glyphicon-circle-arrow-down"
                  />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

const PercentileBox = React.createClass({
  propTypes: {
    setPercentile: React.PropTypes.func
  },
  onSubmit(e) {
    e.preventDefault();
    const self = this;
    this.props.setPercentile(self.refs.percentile.getDOMNode().value);
  },
  render: function() {
    return (
        <div className="row">
          <div className="box-container col-md-8 col-md-offset-2">
            <div className="box box-income">
              <div className="box-title box-title-percentile">
                <div className="number-circle">3</div>
              </div>
              <div className="box-body box-body-percentile">
                <form
                    className="form-flex"
                    onSubmit={this.onSubmit}
                    ref="form">
                  <label className="control-label label-percentile">Guess Your Percentile:</label>
                  <div className="input-group input-percentile">
                      <input
                          type="number"
                          className="form-control"
                          required={true}
                          ref="percentile"
                          aria-label="Guess your percentile" />
                      <span className="input-group-addon">%</span>
                  </div>
                  <button className="button-next">
                  <span
                      className="glyphicon glyphicon-circle-arrow-down"
                  />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
    );
  }
});

// Home page container for the DisplayBox component
const AmIRichApp = React.createClass({
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

  setChartWidth: function(width) {
    this.setState({chartWidth: width});
  },

  getPercentileMap: function(incomeData) {
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
          const percentilePosition = (householdsInPercentile - bracketMin) / incomeBracket.households;
          percentileMap[percentile] = (percentilePosition * (incomeBracket.max - incomeBracket.min)) + incomeBracket.min;
          return false;
        }
      });
    });
    return percentileMap;
  },

  findPercentileAtIncome: function(income) {
    // TODO: special cases at extremes, error checking for neg or 0
    const percentileMap = this.getPercentileMap(this.state.incomeData);
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
  },

  setIncome: function(userIncome) {
    const userPercentile = this.findPercentileAtIncome(userIncome);
    this.setState({userIncome: parseInt(userIncome), userPercentile});
  },

  setPercentile: function(guessedPercentile) {
    const guessedIncome = this.getPercentileMap(this.state.incomeData)[guessedPercentile];
    this.setState({guessedPercentile: parseInt(guessedPercentile), guessedIncome});
  },

  setCounty: function(countyCode) {
    this.setState({currentCounty: countyCode});
    //$.ajax({
    //  url: 'incomes',
    //  dataType: 'json',
    //  type: 'GET',
    //  data: {countyCode: countyCode, stateCode: this.state.currentState},
    //  success: function(data) {
    //    this.setState({incomeData: data});
    //  }.bind(this)
    //});
    this.setState({incomeData: testIncomeData});
  },

  getCountiesInState: function(stateCode) {
    //$.ajax({
    //  url: 'counties',
    //  dataType: 'json',
    //  type: 'GET',
    //  data: {state: stateCode},
    //  success: function(data) {
    //    this.setState({
    //      currentState: stateCode,
    //      counties: [{
    //        name: 'select a county',
    //        stateCode: '0',
    //        countyCode: '0'
    //      }].concat(
    //          data.map(function(county) {
    //        return {
    //          name: county[0].split(',')[0],
    //          stateCode: county[1],
    //          countyCode: county[2]
    //        }
    //      }))
    //    })
    //  }.bind(this)
    //});
    this.setState(
        {
          currentState: stateCode,
          counties: testCountyData.map(function(county) {
                    return {
                      name: county[0].split(',')[0],
                      stateCode: county[1],
                      countyCode: county[2]
                    }
                  })
        }
    )
  },

  render: function() {
    const d3Chart = _.isUndefined(this.state.guessedPercentile)
        ? null
        : (
        <D3Chart
            data={this.state.incomeData}
            chartWidth={this.state.chartWidth}
            setChartWidth={this.setChartWidth}
            userIncome={this.state.userIncome}
            userPercentile={this.state.userPercentile}
            guessedPercentile={this.state.guessedPercentile}
            guessedIncome={this.state.guessedIncome}
        />);
    const incomeBox = _.isUndefined(this.state.incomeData)
        ? null
        : (
            <IncomeBox
                setIncome={this.setIncome}
            />
          );
    const percentileBox = _.isUndefined(this.state.userIncome)
        ? null
        : (
        <PercentileBox
            setPercentile={this.setPercentile}
        />
    );
    //const d3Chart = <D3Chart
    //                data={testIncomeData}
    //                chartWidth={this.state.chartWidth}
    //                setChartWidth={this.setChartWidth}
    //              />;
    return (
      <div className="main-page container">
        <LocationBox
            currentState={this.state.currentState}
            currentCounty={this.state.currentCounty}
            states={this.state.states}
            counties={this.state.counties}
            getCountiesInState={this.getCountiesInState}
            setCounty={this.setCounty}
        />
        {incomeBox}
        {percentileBox}
        {d3Chart}
      </div>
    );
  }
});

export default AmIRichApp;