"use strict";
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import d3 from 'd3';

import D3Chart from '../helpers/D3Chart';

import * as AmIRichActions from '../actions/actions.jsx';

const MARGINS = {
  top: 20,
  right: 20,
  bottom: 50,
  left: 60
};

const NUMBER_BOX_HEIGHT = 60;

const TYPES = React.PropTypes;

const propTypes = {
  data: TYPES.array,
  chartWidth: TYPES.number,
  chart: TYPES.object,
  userIncome: TYPES.number,
  userPercentile: TYPES.number,
  guessedIncome: TYPES.number,
  guessedPercentile: TYPES.number,
  setChartWidth: TYPES.func
};

function mapStateToProps(state) {
  return {
    data: state.incomeData,
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

  componentDidUpdate() {
    // draw d3 chart after initial div has rendered and container width has been determined
    if (this.props.chartWidth && !this.props.chart) {
      const chart = new D3Chart({
            margins: MARGINS,
            width: this.props.chartWidth,
            elementId: 'd3-element'
          },
          this.props.data
      );
      this.props.actions.createChart(chart);
      const offsets = this.props.userIncome > this.props.guessedIncome ? [1, 0] : [0, 1];
      chart.drawMarkerLine(this.props.userIncome, 'steelblue', 'your income', this.props.userPercentile, offsets[0]);
      chart.drawMarkerLine(this.props.guessedIncome, 'grey', 'your guess', this.props.guessedPercentile, offsets[1]);
    } else if (this.props.chart) {
      this.props.chart.updateGraph(this.props.data);
    }
  }

  render() {
    const svgElement = this.props.chartWidth ? (
        <svg
            id="d3-element"
            width={this.props.chartWidth} height={this.props.chartWidth * 0.66} />
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