"use strict";
import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import d3 from 'd3';

import Chart from './Chart';
import D3Chart from '../helpers/D3Chart';
import { getCurrentDataSet } from '../helpers/helpers.js';

import { HOUSEHOLD_TYPES, LOCATION_LEVELS } from '../data/types.js';
import * as AmIRichActions from '../actions/actions';

const MARKERS = [
  {name: 'your guess'},
  {name: 'your income'},
  {name: 'median'},
];

const PAD = 20;

const TYPES = React.PropTypes;

const propTypes = {
  loadingCountyIncomeData: TYPES.string,
  loadingStateIncomeData: TYPES.string,
  countyIncomeData: TYPES.object,
  stateIncomeData: TYPES.object,
  countryIncomeData: TYPES.object,
  chartWidth: TYPES.number,
  chartData: TYPES.object,
  userIncome: TYPES.number,
  locationLevel: TYPES.string,
  householdType: TYPES.string,
  userPercentile: TYPES.number,
  guessedIncome: TYPES.number,
  guessedPercentile: TYPES.number,
  markerShowState: TYPES.object,
  setChartWidth: TYPES.func,
  currentCounty: TYPES.object
};

function mapStateToProps(state) {
  return {
    loadingCountyIncomeData: state.loadingCountyIncomeData,
    loadingStateIncomeData: state.loadingStateIncomeData,
    countyIncomeData: state.countyIncomeData,
    countryIncomeData: state.countryIncomeData,
    stateIncomeData: state.stateIncomeData,
    locationLevel: state.locationLevel,
    householdType: state.householdType,
    chartWidth: state.chartWidth,
    chartData: state.chartData,
    markerShowState: state.markerShowState,
    userIncome: state.userIncome,
    userPercentile: state.userPercentile,
    guessedIncome: state.guessedIncome,
    guessedPercentile: state.guessedPercentile,
    currentCounty: state.currentCounty
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(AmIRichActions, dispatch)
  }
}

class ChartBox extends React.Component {
  constructor() {
    super();
    this.resizeChart = this.resizeChart.bind(this);
  }

  resizeChart() {
    const self = this;
    return _.debounce(function () {
      const chartWidth = ReactDOM.findDOMNode(this).offsetWidth - PAD * 2;
      this.props.actions.setChartWidth(chartWidth);
      //this.removeChart();
      //this.calculateChartVars();
    }.bind(self), 500);
  }

  componentDidMount() {
    const chartWidth = this.refs.container.offsetWidth - PAD * 2;
    this.props.actions.setChartWidth(chartWidth);
    window.addEventListener('resize', this.resizeChart());
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeChart());
  }

  componentDidUpdate() {
    // draw d3 chart after initial div has rendered and container width has been determined
    if (this.props.chartWidth && $('#d3-element').children().length === 0) {
      //this.drawChart();
    }
  }

  render() {
    const props = this.props;
    const showChart = this.props.chartWidth
        && (
          this.props.loadingCountyIncomeData === 'loaded'
          || (this.props.loadingStateIncomeData === 'loaded'
              && this.props.currentCounty.code === '-1')
        )
        && this.props.guessedPercentile;
    const toggles = _.map(MARKERS, function(marker, index) {
      let selectedClass;
      if (props.chartData) {
        selectedClass = _.some(props.chartData.markers, function(shownMarker) {
          return shownMarker.title === marker.name && props.markerShowState[marker.name];
        }) ? "btn-selected" : "btn-default";
      }
      return (
          <button
              key={index}
              onClick={props.actions.toggleMarker.bind(null, marker.name)}
              className={"btn " + selectedClass}>{marker.name}</button>);
    });
    const togglesBar = showChart ? (
        <div className="marker-toggles-bar">
          Show markers:
          <div className="btn-group">
          {toggles}
          </div>
        </div>
    ) : null;
    const chart = showChart ? (
        <Chart
            chartElementID="d3-element"
        />
    ) : null;
    return (
            <div
                ref="container"
                className="d3-container">
              {togglesBar}
              {chart}
            </div>
    );
  }
}

ChartBox.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(ChartBox);