"use strict";
import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import _ from 'lodash';
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

const PAD = 20;

const TYPES = React.PropTypes;

const propTypes = {
  incomeData: TYPES.array,
  chartWidth: TYPES.number,
  chartData: TYPES.object,
  chartElementID: TYPES.string,
  userIncome: TYPES.number,
  userPercentile: TYPES.number,
  guessedIncome: TYPES.number,
  guessedPercentile: TYPES.number,
  setChartWidth: TYPES.func,
  householdType: TYPES.string,
  locationLevel: TYPES.string
};

function mapStateToProps(state) {
  return {
    chartWidth: state.chartWidth,
    chartData: state.chartData,
    chartElementID: state.chartElementID,
    userIncome: state.userIncome,
    userPercentile: state.userPercentile,
    guessedIncome: state.guessedIncome,
    guessedPercentile: state.guessedPercentile,
    householdType: state.householdType,
    locationLevel: state.locationLevel
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(AmIRichActions, dispatch)
  }
}

class Chart extends React.Component {
  constructor(props) {
    super(props);

    // bind context to class methods
    this.removeChart = this.removeChart.bind(this);
    this.resizeChart = this.resizeChart.bind(this);
    this.drawChart = this.drawChart.bind(this);
    this.calculateChartVars = this.calculateChartVars.bind(this);
  }

  removeChart() {
    this.props.actions.emptyChart(this.props.chart);
    $('#d3-element').empty();
  }

  calculateChartVars() {
    const data = this.props.incomeData;
    const width = Math.min(900, this.props.chartWidth);
    const height = Math.max(200, Math.round(width * 0.5));
    const maxX = d3.max(data, function(d) {
      return d.max;
    });
    const maxY = d3.max(data, function(d) {
      return d.households;
    });
    const margins = _.extend({},  MARGINS, {
      left: this.props.chartWidth / 9,
      bottom: this.props.chartWidth / 10
    });
    const xRange = d3.scale
        .linear()
        .range([margins.left, width - margins.right])
        .domain([0, maxX]);
    const yRange = d3.scale
        .linear()
        .range([height - margins.top, margins.bottom])
        .domain([0, maxY]);
    const xAxis = d3.svg.axis()
        .scale(xRange)
        .tickSize(5)
        .ticks(8)
        .tickSubdivide(true)
        .tickFormat(d3.format("s"));
    const yAxis = d3.svg.axis()
        .scale(yRange)
        .ticks(8)
        .tickSize(5)
        .orient('left')
        .tickSubdivide(true)
        .tickFormat(d3.format("s"));
    const graphArea = d3.svg.area()
        .x(function(d) {
          if (d.max === 0) {
            return xRange(0);
          } else if (d.max) {
            return xRange((d.max + d.min)/2);
          }
        })
        .y0(function() {
          return yRange(0);
        })
        .y1(function(d) {
          return yRange(d.households);
        })
        .interpolate('basis');

    this.props.actions.createChart({
      svgID: 'd3-element',
      width,
      height,
      data,
      maxX,
      maxY,
      margins,
      xRange,
      yRange,
      xAxis,
      yAxis,
      graphArea});
  }

  drawChart() {
    const chart = d3.select('#d3-element');
    window.d3 = d3;
    console.log(chart);
    window.chart = chart;
    const chartData = this.props.chartData;
    window.chartData = chartData;
    chart.selectAll("line.horizontalGrid").data(chartData.yRange.ticks(8).slice(1)).enter()
        .append("line")
        .attr(
            {
              "class":"horizontalGrid",
              "x1" : 0,
              "x2" : chartData.width - chartData.margins.right - chartData.margins.left,
              "y1" : function(d){ return chartData.yRange(d);},
              "y2" : function(d){ return chartData.yRange(d);},
              "fill" : "none",
              "shape-rendering" : "crispEdges",
              "stroke-width" : "1px"
            })
        .attr('transform', 'translate(' + (chartData.margins.left) + ','
            + -(chartData.margins.bottom - chartData.margins.top) + ')');
    chart.selectAll("line.verticalGrid").data(chartData.xRange.ticks(8)).enter()
        .append("line")
        .attr(
            {
              "class":"verticalGrid",
              "y1" : chartData.margins.top,
              "y2" : chartData.height - chartData.margins.bottom,
              "x1" : function(d){ return chartData.xRange(d);},
              "x2" : function(d){ return chartData.xRange(d);},
              "fill" : "none",
              "shape-rendering" : "crispEdges",
              "stroke-width" : "1px"
            })
        .attr('transform', 'translate(' + (0) + ','
            + 0 + ')');
    this.graphElement = chart.append('svg:path')
        .attr('d', chartData.graphArea(chartData.data))
        .attr('transform', 'translate(' + (0) + ',' + -(chartData.margins.bottom - chartData.margins.top) + ')')
        .attr('class', 'graph-area');

    chart.append('svg:g')
        .attr('class', 'x-axis')
        .attr('transform', 'translate(0,' + (chartData.height - chartData.margins.bottom) + ')')
        .call(chartData.xAxis)
        .append("text")
        .attr("class", "x-label")
        .attr("text-anchor", "middle")
        .attr("x", chartData.width / 2)
        .attr("y", chartData.height / 8)
        .text("income per household (dollars)");

    chart.append('svg:g')
        .attr('class', 'y-axis')
        .attr('transform', 'translate(' + (chartData.margins.left) + ',' + -(chartData.margins.bottom - chartData.margins.top) + ')')
        .call(chartData.yAxis)
        .append("text")
        .attr("class", "y-label")
        .attr("text-anchor", "middle")
        .attr("x", -chartData.height / 2)
        .attr("y", -chartData.width / 13)
        .attr("transform", "rotate(-90,0,0)")
        .text("# households");

  }

  resizeChart() {
    const self = this;
    return _.debounce(function () {
      const chartWidth = ReactDOM.findDOMNode(this).offsetWidth - PAD * 2;
      this.props.actions.setChartWidth(chartWidth);
      this.removeChart();
      this.calculateChartVars();
    }.bind(self), 500);
  }

  componentDidMount() {
    this.props.actions.calculatePercentileAndIncome(this.props);

    this.calculateChartVars();
    window.addEventListener('resize', this.resizeChart());
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeChart());
  }

  componentWillReceiveProps(nextProps) {
    // diff this.props.chart with nextProps.chart
    // if there is a change, redraw
  }

  componentDidUpdate(prevProps) {
    // draw d3 chart after initial div has rendered and container width has been determined
    // or if width has changed
    console.log('====');
    console.log('change');
    console.log(prevProps.chartData);
    console.log(this.props.chartData);
    console.log('====');
    if (!_.isNull(this.props.chartData) &&
        (
            ($("#d3-element").children().length === 0)
            || (_.isNull(prevProps.chartData))
        )
    ) {
      console.log('go');
      this.drawChart();
    }
  }

  render() {
    return (
        <svg
            id={"d3-element"}
            width={Math.min(900, this.props.chartWidth)} height={Math.max(200, this.props.chartWidth * 0.5)} />
    );
  }
}

Chart.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(Chart);