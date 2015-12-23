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
  left: 50
};

const NUMBER_BOX_HEIGHT = 60;

const propTypes = {
  data: React.PropTypes.array,
  chartWidth: React.PropTypes.number,
  userIncome: React.PropTypes.number,
  userPercentile: React.PropTypes.number,
  guessedIncome: React.PropTypes.number,
  guessedPercentile: React.PropTypes.number,
  setChartWidth: React.PropTypes.func
};

function mapStateToProps(state) {
  return {
    data: state.incomeData,
    chartWidth: state.chartWidth,
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
    // draw d3 chart after initial box has rendered and container width has been determined
    if (this.props.chartWidth) {
      const chart = new D3Chart({
            margins: MARGINS,
            width: this.props.chartWidth,
            elementId: 'd3-element'
          },
          this.props.data
      );
      const offsets = this.props.userIncome > this.props.guessedIncome ? [1, 0] : [0, 1];
      chart.drawMarkerLine(this.props.userIncome, 'steelblue', 'your income', offsets[0]);
      chart.drawMarkerLine(this.props.guessedIncome, 'grey', 'your guess', offsets[1]);
    }
  }

  render() {
    const svgElement = this.props.chartWidth ? (
        <svg
            id="d3-element"
            width={this.props.chartWidth} height={this.props.chartWidth * 0.66} />
    ) : null;
    return (
        <div className="row">
          <div className="col-md-8 col-md-offset-2">
            <div
                ref="container"
                className="d3-container">
              {svgElement}
            </div>
          </div>
        </div>
    );
  }
}

ChartBox.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(ChartBox);