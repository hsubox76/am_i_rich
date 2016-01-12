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
    this.renderGraphArea = this.renderGraphArea.bind(this);
    this.renderGrid = this.renderGrid.bind(this);
    this.updateChart = this.updateChart.bind(this);
  }

  removeChart() {
    this.props.actions.emptyChart(this.props.chart);
    //$('g.y-axis').remove();
    $('#bg-grid').empty();
    $('#x-axis').empty();
    $('#y-axis').empty();
  }

  calculateChartVars() {
    const data = this.props.incomeData;
    const svgWidth = Math.min(900, this.props.chartWidth);
    const svgHeight = Math.max(200, Math.round(svgWidth * 0.5));
    const width = svgWidth * 0.8;
    const height = svgHeight * 0.8;
    const maxX = d3.max(data, function(d) {
      return d.max;
    });
    const maxY = d3.max(data, function(d) {
      return d.households;
    });
    window.maxY = maxY;
    const margins = _.extend({},  MARGINS, {
      left: width / 9,
      bottom: width / 10
    });
    window.margins = margins;
    const xRange = d3.scale
        .linear()
        .range([0, width])
        .domain([0, maxX]);
    const yRange = d3.scale
        .linear()
        .range([height, 0])
        .domain([0, maxY]);
    window.xRange = xRange;
    window.yRange = yRange;
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

    // marker stuff
    const markers = [
      {
        title: 'your income',
        xValue: this.props.userIncome,
        className: 'user-income-label',
        percentile: this.props.userPercentile,
        show: true
      },
      {
        title: 'your guess',
        xValue: this.props.guessedIncome,
        className: 'user-guess-label',
        percentile: this.props.guessedPercentile,
        show: true
      }
    ];

    this.props.actions.createChart({
      svgID: 'd3-element',
      svgWidth,
      svgHeight,
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
      graphArea,
      markers
    });
  }

  drawChart() {
    const chart = d3.select('#d3-element');
    const chartData = this.props.chartData;
    let xPos = chartData.xRange(chartData.xValue);
    if (xPos > chartData.width - chartData.margins.right) {
      xPos = (chartData.width - chartData.margins.right);
      chartData.percentile = '99+';
    }
    const LABEL_PADDING = chartData.width / 150;
    const LABEL_SPACING = chartData.width / 100;
    const LABEL_BORDER_SIZE = chartData.width / 150;

    const gridEl = d3.select("#bg-grid");

    gridEl.selectAll("line.horizontalGrid").data(chartData.yRange.ticks(8).slice(1)).enter()
        .append("line")
        .attr(
            {
              "class":"horizontalGrid",
              "x1" : 0,
              "x2" : chartData.width,
              "y1" : function(d){ return chartData.yRange(d);},
              "y2" : function(d){ return chartData.yRange(d);},
              "fill" : "none",
              "shape-rendering" : "crispEdges",
              "stroke-width" : "1px"
            });
        //.attr('transform', 'translate(' + (chartData.margins.left) + ','
        //    + -(chartData.margins.bottom - chartData.margins.top) + ')');
    gridEl.selectAll("line.verticalGrid").data(chartData.xRange.ticks(8)).enter()
        .append("line")
        .attr(
            {
              "class":"verticalGrid",
              "y1" : 0,
              "y2" : chartData.height,
              "x1" : function(d){ return chartData.xRange(d);},
              "x2" : function(d){ return chartData.xRange(d);},
              "fill" : "none",
              "shape-rendering" : "crispEdges",
              "stroke-width" : "1px"
            });
        //.attr('transform', 'translate(' + (0) + ','
        //    + chartData.margins.top + ')');
    //this.graphElement = chart.append('svg:path')
    //    .attr('d', chartData.graphArea(chartData.data))
    //    .attr('transform', 'translate(' + (0) + ',' + -(chartData.margins.bottom - chartData.margins.top) + ')')
    //    .attr('class', 'graph-area');

    //chart.append('svg:g')
    //    .attr('class', 'x-axis')
    //    .attr('transform', 'translate(0,' + (chartData.height - chartData.margins.bottom) + ')')
    d3.select("#x-axis").call(chartData.xAxis)
        .append("text")
        .attr("class", "x-label")
        .attr("text-anchor", "middle")
        .attr("x", chartData.width / 2)
        .attr("y", chartData.height / 8)
        .text("income per household (dollars)");

    //chart.append('svg:g')
    //    .attr('class', 'y-axis')
    //    .attr('transform', 'translate(' + (chartData.margins.left) + ',' + -(chartData.margins.bottom - chartData.margins.top) + ')')
    d3.select("#y-axis").call(chartData.yAxis)
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
  }

  componentWillUnmount() {
  }

  componentWillReceiveProps(nextProps) {
    //if (nextProps.chartWidth !== this.props.chartWidth) {
    //  console.log('WILL RECEIVE PROPS');
    //  this.removeChart();
    //  this.calculateChartVars();
    //}
  }

  componentDidUpdate(prevProps) {
    if (prevProps.chartWidth !== this.props.chartWidth) {
      console.log('--DID UPDATE--');
      this.removeChart();
      this.calculateChartVars();
      //this.drawChart();
    }
    // draw d3 chart after initial div has rendered and container width has been determined
    // or if width has changed
    if (this.props.chartData &&
        (
            $("#d3-element").children().length === 0
            || _.isNull(prevProps.chartData)
            || !_.isEqual(this.props.chartData, prevProps.chartData)
        )
    ) {
      console.log('===DRAW CHART==');
      this.drawChart();
    }
  }

  updateChart() {
    d3.select('.graph-area').attr('d', this.props.chartData.graphArea(this.props.data));
    d3.select('#bg-grid.verticalGrid').attr(
        {
          "class":"verticalGrid",
          "y1" : chartData.margins.top,
          "y2" : chartData.height - chartData.margins.bottom,
          "x1" : function(d){ return chartData.xRange(d);},
          "x2" : function(d){ return chartData.xRange(d);},
          "fill" : "none",
          "shape-rendering" : "crispEdges",
          "stroke-width" : "1px"
        });
    d3.select('#bg-grid.horizontalGrid').attr(
            {
              "class":"horizontalGrid",
              "x1" : 0,
              "x2" : chartData.width - chartData.margins.right - chartData.margins.left,
              "y1" : function(d){ return chartData.yRange(d);},
              "y2" : function(d){ return chartData.yRange(d);},
              "fill" : "none",
              "shape-rendering" : "crispEdges",
              "stroke-width" : "1px"
            });
  }

  renderGraphArea() {
    const chartData = this.props.chartData;
    if (chartData) {
      return (
          <path
              d={chartData.graphArea(chartData.data)}
              transform={'translate(' + (0) + ',' + 0 + ')'}
              className="graph-area other-class"
          />
      );
    }
    return null;
  }

  renderGrid() {
    const chartData = this.props.chartData;
    if (chartData) {
      return (
          <g id="bg-grid" />
      );
    }
    return null;
  }

  render() {
    //transform={'translate(0,' + (chartData.height - chartData.margins.bottom) + ')'}
    //transform={'translate(' + (chartData.margins.left) + ',' + -chartData.margins.bottom + ')'}
    const chartData = this.props.chartData;
    if (chartData) {
      console.log('width: ' + chartData.width);
      console.log('height: ' + chartData.height);
      console.log('margin-left: ' + chartData.margins.left);
      console.log('margin-bottom: ' + chartData.margins.bottom);
      console.log('maxY: ' + chartData.maxY);
      console.log('maxX: ' + chartData.maxX);
      return (
          <svg
              id={"d3-element"}
              width={this.props.chartData.svgWidth} height={this.props.chartData.svgHeight}>
            <g id="grid-container"
               transform={"translate(" + (chartData.svgWidth * 0.1) + "," + chartData.svgHeight * 0.05 + ")"}
               width={this.props.chartWidth} height={this.props.chartData.height}>
              <g id="bg-grid" />
              <g className="x-axis"
                 id="x-axis"
                 transform={'translate(0,' + this.props.chartData.height + ')'} />
              <g className="y-axis"
                 id="y-axis"
                 transform={'translate(0,0)'} />
              {this.renderGraphArea()}
            </g>
          </svg>
      );
    }
    return (<div>empty</div>);
  }
}

Chart.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(Chart);