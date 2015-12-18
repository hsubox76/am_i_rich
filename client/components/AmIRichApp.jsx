"use strict";

import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

import STATES from '../data/state-codes';

import LocationBox from './LocationBox';
import IncomeBox from './IncomeBox';
import PercentileBox from './PercentileBox';
import D3Chart from './D3Chart';

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
// Main AmIRichApp component
const AmIRichApp = React.createClass({
  getInitialState: function (){
    return {
      currentState: "0",
      currentCounty: "0",
      states:
          [{name: "select a state", code: "0"}].concat(STATES),
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
          const percentilePosition =
              (householdsInPercentile - bracketMin) / incomeBracket.households;
          percentileMap[percentile] =
              (percentilePosition * (incomeBracket.max - incomeBracket.min)) + incomeBracket.min;
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