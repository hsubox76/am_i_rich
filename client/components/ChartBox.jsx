"use strict";
import React from 'react';
import $ from 'jquery';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import d3 from 'd3';

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

const NUMBER_BOX_HEIGHT = 60;

const TYPES = React.PropTypes;

const propTypes = {
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
  componentDidMount() {
    const chartWidth = this.refs.container.offsetWidth - 2 * NUMBER_BOX_HEIGHT;
    this.props.actions.setChartWidth(chartWidth);
  }

  componentWillUpdate(nextProps) {
    if (this.props.chart &&
        ((nextProps.locationLevel !== this.props.locationLevel)
        || (nextProps.householdType !== this.props.householdType))){
      $('#d3-element').empty();
      this.props.actions.calculatePercentileAndIncome(nextProps);
    }
  }

  componentDidUpdate() {
    // draw d3 chart after initial div has rendered and container width has been determined
    if (this.props.chartWidth && $('#d3-element').children().length === 0) {
      const data = getCurrentDataSet(this.props);
      const chart = new D3Chart({
            margins: MARGINS,
            width: this.props.chartWidth,
            elementId: 'd3-element'
          },
          data
      );
      this.props.actions.createChart(chart);
      const offsets = this.props.userIncome > this.props.guessedIncome ? [1, 0] : [0, 1];
      chart.drawMarkerLine(this.props.userIncome, 'user-income-label', 'your income', this.props.userPercentile, offsets[0]);
      chart.drawMarkerLine(this.props.guessedIncome, 'user-guess-label', 'your guess', this.props.guessedPercentile, offsets[1]);
    }
  }

  render() {
    const svgElement = this.props.chartWidth ? (
        <svg
            id="d3-element"
            width={this.props.chartWidth} height={this.props.chartWidth * 0.5} />
    ) : null;
    return (
            <div
                ref="container"
                className="d3-container">
              {svgElement}
            </div>
    );
  }
}

ChartBox.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(ChartBox);