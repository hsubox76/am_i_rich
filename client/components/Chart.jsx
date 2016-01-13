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

import { MARKERS, HOUSEHOLD_TYPES, LOCATION_LEVELS } from '../data/types.js';
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
  locationLevel: TYPES.string,
  markerShowState: TYPES.object
};

function mapStateToProps(state) {
  return {
    incomeData: state.currentIncomeData,
    chartWidth: state.chartWidth,
    chartData: state.chartData,
    chartElementID: state.chartElementID,
    userIncome: state.userIncome,
    userPercentile: state.userPercentile,
    guessedIncome: state.guessedIncome,
    guessedPercentile: state.guessedPercentile,
    householdType: state.householdType,
    locationLevel: state.locationLevel,
    markerShowState: state.markerShowState
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
    this.drawMarker = this.drawMarker.bind(this);
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
    $('g.graph-label').remove();
  }

  calculateChartVars() {
    const data = this.props.incomeData;
    // larger area includes axes
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
        title: MARKERS[0].title,
        xValue: this.props.userIncome,
        className: MARKERS[0].className,
        percentile: this.props.userPercentile
      },
      {
        title: MARKERS[1].title,
        xValue: this.props.guessedIncome,
        className: MARKERS[1].className,
        percentile: this.props.guessedPercentile
      },
      {
        title: MARKERS[2].title,
        xValue: 1,
        className: MARKERS[2].className,
        percentile: 1
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

  intersectRect(r1, r2) {
    var r1 = r1.getBoundingClientRect();    //BOUNDING BOX OF THE FIRST OBJECT
    var r2 = r2.getBoundingClientRect();    //BOUNDING BOX OF THE SECOND OBJECT

    //CHECK IF THE TWO BOUNDING BOXES OVERLAP
    return !(r2.left > r1.right ||
    r2.right < r1.left ||
    r2.top > r1.bottom ||
    r2.bottom < r1.top);
  }

  drawMarker(marker) {
    const gridContainer = d3.select('#grid-container');
    const chartData = this.props.chartData;
    let percentile = marker.percentile;
    const xValue = marker.xValue;
    const title = marker.title;
    const className = marker.className;

    if (title === 'your income') {
      d3.select("#lower-clip-shape").attr("width", chartData.xRange(xValue));
      d3.select("#higher-clip-shape")
          .attr("x", chartData.xRange(xValue))
          .attr("width", chartData.xRange(chartData.maxX) - chartData.xRange(xValue));
    }

    const LABEL_PADDING = chartData.width * 0.012;
    const LABEL_SPACING = chartData.width * 0.01;
    const LABEL_BORDER_SIZE = chartData.width * 0.005;
    const LABEL_FONT_SIZE = (chartData.width * 0.025) + 'px';
    let xPos = chartData.xRange(xValue);
    if (xPos > chartData.width - chartData.margins.right) {
      xPos = (chartData.width - chartData.margins.right);
      percentile = '99+';
    }
    const g = gridContainer.append('g').attr('class', 'graph-label ' + className);
    const line = g.append('svg:line')
        .attr('x1', 0)
        .attr('x2', 0)
        .attr('y2', chartData.height)
        .attr('class', 'label-line')
        .attr('stroke-width', LABEL_BORDER_SIZE);
    const box = g.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('stroke-width', LABEL_BORDER_SIZE)
        .attr('fill-opacity', 0.75)
        .attr('class', 'label-box');
    const labelText = g.append('g')
        .attr('class', 'label-text-group')
        .attr ('transform', 'translate(' + (LABEL_PADDING + LABEL_BORDER_SIZE) + ', '
            + (chartData.margins.top + 32 + LABEL_PADDING + LABEL_BORDER_SIZE) + ')');
    const labelTitle = labelText.append('text')
        .attr('alignment-baseline', 'middle')
        .attr('text-anchor', 'middle')
        .attr('font-size', LABEL_FONT_SIZE)
        .attr('class', 'label-text')
        .text(title);
    const labelIncome = labelText.append('text')
        .attr('alignment-baseline', 'middle')
        .attr('text-anchor', 'middle')
        .attr('font-size', LABEL_FONT_SIZE)
        .attr('class', 'label-text')
        .text('$' + Math.round(xValue).toLocaleString());
    const labelPercentile = labelText.append('text')
        .attr('alignment-baseline', 'middle')
        .attr('text-anchor', 'middle')
        .attr('font-size', LABEL_FONT_SIZE)
        .attr('class', 'label-text')
        .text(percentile + '%');
    const textBBox = labelTitle[0][0].getBBox();
    const labelHeight = textBBox.height * 2 + LABEL_PADDING * 4;
    const labelWidth = textBBox.width + LABEL_PADDING * 2;
    let boxOffset = 0;
    let orientation = 'right';
    if (xPos > chartData.width - labelWidth - chartData.margins.right) {
      // if flag will fall off right edge, flip flag to left side
      boxOffset = -labelWidth;
      orientation = 'left';
    }
    const offset = 0; // set this programmatically
    const textX = labelWidth / 2;
    const textY = (labelHeight / 2) + chartData.height * 0.05 + ((labelHeight + LABEL_SPACING) * offset);
    labelTitle.attr('transform', 'translate(0, ' + (-textBBox.height) + ')');
    labelPercentile.attr('transform', 'translate(0, ' + (textBBox.height) + ')');
    box.attr('width', labelWidth)
        .attr('height', labelHeight)
        .attr ('transform', 'translate(' + boxOffset + ', ' + (((labelHeight + LABEL_SPACING) * offset)
            + chartData.height * 0.05) + ')');
    labelText.attr('transform', 'translate(' + (textX + boxOffset) + ',' + textY + ')');
    line.attr('y1', ((labelHeight + LABEL_SPACING) * offset) + chartData.height * 0.05);
    g.attr('transform', 'translate(' + xPos + ', 0)');

    return {
      element: g[0][0],
      orientation,
      xPos
    };
  }

  drawChart() {
    const self = this;
    const chartData = this.props.chartData;
    const AXIS_TICK_FONT_SIZE = (chartData.width * 0.025) + 'px';
    const AXIS_LABEL_FONT_SIZE = (chartData.width * 0.03) + 'px';

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

    d3.select("#x-axis").call(chartData.xAxis)
        .attr("font-size", AXIS_TICK_FONT_SIZE)
        .append("text")
        .attr("class", "x-label")
        .attr("text-anchor", "middle")
        .attr("x", chartData.width * 0.5)
        .attr("y", chartData.height * 0.15)
        .attr("font-size", AXIS_LABEL_FONT_SIZE)
        .text("income per household (dollars)");

    d3.select("#y-axis").call(chartData.yAxis)
        .attr("font-size", AXIS_TICK_FONT_SIZE)
        .append("text")
        .attr("class", "y-label")
        .attr("text-anchor", "middle")
        .attr("x", -chartData.height * 0.5)
        .attr("y", -chartData.width * 0.1)
        .attr("font-size", AXIS_LABEL_FONT_SIZE)
        .attr("transform", "rotate(-90,0,0)")
        .text("# households");

    const markerElements = _(chartData.markers)
        .map(function(marker) {
          if (!self.props.markerShowState[marker.title]) {
            return null;
          }
          return self.drawMarker(marker);
        })
        .filter(function(marker) {
          return marker;
        })
        .value();

    _.forEach(markerElements, function(markerElement, markerIndex) {
      _.forEach(markerElements, function(otherElement, otherIndex) {
        if (self.intersectRect($(markerElement.element).find('rect')[0], $(otherElement.element).find('rect')[0]) ) {
          let topElement = null;
          let bottomElement = null;
          if (otherElement.xPos > markerElement.xPos) {
            if (markerElement.orientation === 'right'
                && otherElement.orientation === 'right') {
              topElement = markerElement.element;
              bottomElement = otherElement.element;
            } else if (markerElement.orientation === 'left'
                && otherElement.orientation === 'left') {
              bottomElement = markerElement.element;
              topElement = otherElement.element;
            } else if (markerElement.orientation === 'right'
                && otherElement.orientation === 'left') {
              // really should flip markerElement flag in this case
              // but just put the front one on top for now
              if (markerIndex > otherIndex) {
                bottomElement = markerElement.element;
                topElement = otherElement.element;
              } else {
                topElement = markerElement.element;
                bottomElement = otherElement.element;
              }
              $(bottomElement).find('rect').attr('fill-opacity', 0.9);
            }
          }
          if (otherElement.xPos < markerElement.xPos) {
            if (markerElement.orientation === 'right'
                && otherElement.orientation === 'right') {
              bottomElement = markerElement.element;
              topElement = otherElement.element;
            } else if (markerElement.orientation === 'left'
                && otherElement.orientation === 'left') {
              topElement = markerElement.element;
              bottomElement = otherElement.element;
            } else if (markerElement.orientation === 'right'
                && otherElement.orientation === 'left') {
              // really should flip otherElement flag in this case
              // but just put the front one on top for now
              if (markerIndex > otherIndex) {
                topElement = markerElement.element;
                bottomElement = otherElement.element;
              } else {
                bottomElement = markerElement.element;
                topElement = otherElement.element;
              }
              $(bottomElement).find('rect').attr('fill-opacity', 0.9);
            }
          }

          if (topElement && bottomElement) {
            const topElementHeight = $(topElement).find('rect')[0].getBBox().height;
            const $bottomElementText = $(bottomElement).find('.label-text-group');
            const $bottomElementFlag = $(bottomElement).find('rect');
            const $bottomElementLine = $(bottomElement).find('line');
            const bottomLineOriginalY1 = parseInt($bottomElementLine.attr('y1'));
            const bottomFlagOriginalX = $bottomElementFlag[0].transform.baseVal.getItem(0).matrix.e;
            const bottomFlagOriginalY = $bottomElementFlag[0].transform.baseVal.getItem(0).matrix.f;
            const bottomTextOriginalX = $bottomElementText[0].transform.baseVal.getItem(0).matrix.e;
            const bottomTextOriginalY = $bottomElementText[0].transform.baseVal.getItem(0).matrix.f;
            $bottomElementLine.attr('y1', bottomLineOriginalY1 + topElementHeight + 10);
            $bottomElementFlag.attr("transform", "translate(" + bottomFlagOriginalX + ", " + (bottomFlagOriginalY + topElementHeight + 10) + ")");
            $bottomElementText.attr("transform", "translate(" + bottomTextOriginalX + ", " + (bottomTextOriginalY + topElementHeight + 10) + ")");
          }
        }
      });
    });

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
    this.props.actions.calculatePercentileAndIncome();
    //this.calculateChartVars();
  }


  componentDidUpdate(prevProps) {
    if (
        prevProps.chartWidth !== this.props.chartWidth
        || prevProps.guessedIncome !== this.props.guessedIncome
        || !_.isEqual(prevProps.markerShowState, this.props.markerShowState)
        || !_.isEqual(prevProps.incomeData, this.props.incomeData)
    ) {
      console.log('--DID UPDATE--');
      this.removeChart();
      this.props.actions.calculatePercentileAndIncome();
      this.calculateChartVars();
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

  // currently not being called anywhere...
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

  renderGraphArea(clipID) {
    const chartData = this.props.chartData;
    if (chartData) {
      return (
          <path
              d={chartData.graphArea(chartData.data)}
              transform={'translate(' + (0) + ',' + 0 + ')'}
              className={"graph-area" + " graph-" + clipID}
              clipPath={"url(#" + clipID + ")"}
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
              <defs>
                <clipPath id="lower-clip">
                  <rect id="lower-clip-shape" x="0" y="0" height={this.props.chartData.svgHeight} />
                </clipPath>
                <clipPath id="higher-clip">
                  <rect id="higher-clip-shape" x="0" y="0" height={this.props.chartData.svgHeight} />
                </clipPath>
              </defs>
              {this.renderGraphArea('lower-clip')}
              {this.renderGraphArea('higher-clip')}
            </g>
          </svg>
      );
    }
    return (<div>empty</div>);
  }
}

Chart.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(Chart);