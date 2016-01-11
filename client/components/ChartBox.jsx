"use strict";
import React from 'react';
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

const MARGINS = {
  top: 20,
  right: 20,
  bottom: 50,
  left: 60
};

const PAD = 20;

const TYPES = React.PropTypes;

const propTypes = {
  loadingCountyIncomeData: TYPES.string,
  countyIncomeData: TYPES.object,
  stateIncomeData: TYPES.object,
  countryIncomeData: TYPES.object,
  chartWidth: TYPES.number,
  chart: TYPES.object,
  userIncome: TYPES.number,
  locationLevel: TYPES.string,
  householdType: TYPES.string,
  userPercentile: TYPES.number,
  guessedIncome: TYPES.number,
  guessedPercentile: TYPES.number,
  setChartWidth: TYPES.func
};

function mapStateToProps(state) {
  return {
    loadingCountyIncomeData: state.loadingCountyIncomeData,
    countyIncomeData: state.countyIncomeData,
    countryIncomeData: state.countryIncomeData,
    stateIncomeData: state.stateIncomeData,
    locationLevel: state.locationLevel,
    householdType: state.householdType,
    chartWidth: state.chartWidth,
    chart: state.chart,
    userIncome: state.userIncome,
    userPercentile: state.userPercentile,
    guessedIncome: state.guessedIncome,
    guessedPercentile: state.guessedPercentile
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
  }

  componentDidMount() {
    const chartWidth = this.refs.container.offsetWidth - PAD * 2;
    this.props.actions.setChartWidth(chartWidth);
    this.props.actions.calculatePercentileAndIncome(this.props);
  }

  componentDidUpdate() {
    // draw d3 chart after initial div has rendered and container width has been determined
    if (this.props.chartWidth && $('#d3-element').children().length === 0) {
      //this.drawChart();
    }
  }

  render() {
    const chart = this.props.chartWidth && this.props.loadingCountyIncomeData === 'loaded' ? (
        <Chart
            chartElementID="d3-element"
            incomeData={getCurrentDataSet(this.props)}
        />
    ) : null;
    return (
            <div
                ref="container"
                className="d3-container">
              {chart}
            </div>
    );
  }
}

ChartBox.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(ChartBox);