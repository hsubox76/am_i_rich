"use strict";
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import d3 from 'd3';

import * as AmIRichActions from '../actions/actions.jsx';

const NUMBER_BOX_HEIGHT = 60;

const MARGINS = {
  top: 20,
  right: 20,
  bottom: 50,
  left: 50
};

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

class D3Chart extends React.Component {
  componentDidMount() {
    const chartWidth = this.refs.container.offsetWidth - 2 * NUMBER_BOX_HEIGHT;
    this.props.actions.setChartWidth(chartWidth);
    const vis = d3.select('#d3-element'),
        WIDTH = chartWidth,
        HEIGHT = Math.round(chartWidth * 0.66),

        MAX_Y = d3.max(this.props.data, function(d) {
          return d.households;
        }),
        xRange = d3.scale
            .linear()
            .range([MARGINS.left, WIDTH - MARGINS.right])
            .domain([0, 250000]),
        yRange = d3.scale
            .linear()
            .range([HEIGHT - MARGINS.bottom, MARGINS.bottom])
            .domain([0, MAX_Y]),
        xAxis = d3.svg.axis()
            .scale(xRange)
            .tickSize(5)
            .tickSubdivide(true)
            .tickFormat(d3.format("s")),
        yAxis = d3.svg.axis()
            .scale(yRange)
            .tickSize(5)
            .orient('left')
            .tickSubdivide(true)
            .tickFormat(d3.format("s"));

    vis.append('svg:g')
        .attr('class', 'x-axis')
        .attr('transform', 'translate(0,' + (HEIGHT - MARGINS.bottom) + ')')
        .call(xAxis)
        .append("text")
        .attr("class", "x-label")
        .attr("text-anchor", "middle")
        .attr("x", WIDTH / 2)
        .attr("y", 35)
        .text("income per household (dollars)");

    vis.append('svg:g')
        .attr('class', 'y-axis')
        .attr('transform', 'translate(' + (MARGINS.left) + ',' + (0) + ')')
        .call(yAxis)
        .append("text")
        .attr("class", "y-label")
        .attr("text-anchor", "middle")
        .attr("x", -HEIGHT / 2)
        .attr("y", -32)
        .attr("transform", "rotate(-90,0,0)")
        .text("# households");

    const markerLine = d3.svg.line()
        .x(function(d) {
          return (xRange(d.x));
        })
        .y(function(d) {
          return (yRange(d.y));
        })
        .interpolate('linear');

    const graphArea = d3.svg.area()
        .x(function(d) {
          if (d.max === 0) {
            return xRange(1000);
          } else if (d.max) {
            return xRange((d.max + d.min)/2);
          }
        })
        .y0(function() {
          return yRange(100);
        })
        .y1(function(d) {
          return yRange(d.households);
        })
        .interpolate('basis');

    vis.append('svg:path')
        .attr('d', graphArea(this.props.data))
        .attr('class', 'graph-area');

    vis.append('svg:path')
        .attr('d', markerLine([{x: this.props.userIncome, y: 0},
          {x: this.props.userIncome, y: MAX_Y}]))
        .attr('stroke', 'black')
        .attr('fill', 'none');

    vis.append('svg:path')
        .attr('d', markerLine([{x: this.props.guessedIncome, y: 0},
          {x: this.props.guessedIncome, y: MAX_Y}]))
        .attr('stroke', 'black')
        .attr('fill', 'none');
  }

  render() {
    return (
        <div className="row">
          <div className="col-md-8 col-md-offset-2">
            <div
                ref="container"
                className="d3-container">
              <svg
                  id="d3-element"
                  width={this.props.chartWidth} height="400"/>
            </div>
          </div>
        </div>
    );
  }
}

D3Chart.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(D3Chart);