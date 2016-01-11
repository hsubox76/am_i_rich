import d3 from 'd3';

export function drawChart() {

};

class D3Chart {
  constructor(options, data) {
    this.options = options;
    this.margins = options.margins;
    this.width = Math.min(900, options.width);
    this.data = data;
    this.height = Math.max(200, Math.round(this.width * 0.5));
    this.elementId = options.elementId;
    this.plot = d3.select('#' + this.elementId);
    this.initRanges();
    this.initAxes();
    this.initDrawFunctions();
    this.drawGraph();
  }

  getPlot() {
    return this.plot;
  }

  initRanges() {
    this.maxX = d3.max(this.data, function(d) {
      return d.max;
    });
    this.maxY = d3.max(this.data, function(d) {
      return d.households;
    });
    this.xRange = d3.scale
        .linear()
        .range([this.margins.left, this.width - this.margins.right])
        .domain([0, this.maxX]);
    this.yRange = d3.scale
        .linear()
        .range([this.height - this.margins.top, this.margins.bottom])
        .domain([0, this.maxY]);
  }

  initAxes() {
    this.xAxis = d3.svg.axis()
        .scale(this.xRange)
        .tickSize(5)
        .ticks(8)
        .tickSubdivide(true)
        .tickFormat(d3.format("s"));
    this.yAxis = d3.svg.axis()
        .scale(this.yRange)
        .ticks(8)
        .tickSize(5)
        .orient('left')
        .tickSubdivide(true)
        .tickFormat(d3.format("s"));
  }

  initDrawFunctions() {
    this.graphArea = d3.svg.area()
        .x(function(d) {
          if (d.max === 0) {
            return this.xRange(0);
          } else if (d.max) {
            return this.xRange((d.max + d.min)/2);
          }
        })
        .y0(function() {
          return this.yRange(0);
        })
        .y1(function(d) {
          return this.yRange(d.households);
        })
        .interpolate('basis');
  }

  drawGraph() {
    const self = this;
    this.plot.selectAll("line.horizontalGrid").data(this.yRange.ticks(8).slice(1)).enter()
      .append("line")
      .attr(
          {
            "class":"horizontalGrid",
            "x1" : 0,
            "x2" : self.width - self.margins.right - self.margins.left,
            "y1" : function(d){ return self.yRange(d);},
            "y2" : function(d){ return self.yRange(d);},
            "fill" : "none",
            "shape-rendering" : "crispEdges",
            "stroke-width" : "1px"
          })
        .attr('transform', 'translate(' + (self.margins.left) + ','
            + -(self.margins.bottom - self.margins.top) + ')');
    this.plot.selectAll("line.verticalGrid").data(this.xRange.ticks(8)).enter()
        .append("line")
        .attr(
            {
              "class":"verticalGrid",
              "y1" : self.margins.top,
              "y2" : self.height - self.margins.bottom,
              "x1" : function(d){ return self.xRange(d);},
              "x2" : function(d){ return self.xRange(d);},
              "fill" : "none",
              "shape-rendering" : "crispEdges",
              "stroke-width" : "1px"
            })
        .attr('transform', 'translate(' + (0) + ','
            + 0 + ')');
    this.graphElement = this.plot.append('svg:path')
        .attr('d', this.graphArea(this.data))
        .attr('transform', 'translate(' + (0) + ',' + -(this.margins.bottom - this.margins.top) + ')')
        .attr('class', 'graph-area');

    this.plot.append('svg:g')
        .attr('class', 'x-axis')
        .attr('transform', 'translate(0,' + (this.height - this.margins.bottom) + ')')
        .call(this.xAxis)
        .append("text")
        .attr("class", "x-label")
        .attr("text-anchor", "middle")
        .attr("x", this.width / 2)
        .attr("y", this.height / 8)
        .text("income per household (dollars)");

    this.plot.append('svg:g')
        .attr('class', 'y-axis')
        .attr('transform', 'translate(' + (this.margins.left) + ',' + -(this.margins.bottom - this.margins.top) + ')')
        .call(this.yAxis)
        .append("text")
        .attr("class", "y-label")
        .attr("text-anchor", "middle")
        .attr("x", -this.height / 2)
        .attr("y", -this.width / 13)
        .attr("transform", "rotate(-90,0,0)")
        .text("# households");
  }

  updateGraph(data) {
    this.data = data;
    this.graphElement.attr('d', this.graphArea(this.data));
  }

  drawMarkerLine(xValue, className, title, percentile, offset = 0) {
    const LABEL_PADDING = this.width / 150;
    const LABEL_SPACING = this.width / 100;
    const LABEL_BORDER_SIZE = this.width / 150;
    let xPos = this.xRange(xValue);
    if (xPos > this.width - this.margins.right) {
      xPos = (this.width - this.margins.right);
      percentile = '99+';
    }
    const g = this.plot.append('g').attr('class', 'graph-label ' + className);
    const line = g.append('svg:line')
        .attr('x1', 0)
        .attr('x2', 0)
        .attr('y2', this.height - this.margins.bottom)
        .attr('class', 'label-line')
        .attr('stroke-width', LABEL_BORDER_SIZE);
    const box = g.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('stroke-width', LABEL_BORDER_SIZE)
        .attr('fill-opacity', 0.75)
        .attr('class', 'label-box');
    const labelText = g.append('g')
        .attr ('transform', 'translate(' + (LABEL_PADDING + LABEL_BORDER_SIZE) + ', '
            + (this.margins.top + 32 + LABEL_PADDING + LABEL_BORDER_SIZE) + ')');
    const labelTitle = labelText.append('text')
        .attr('alignment-baseline', 'middle')
        .attr('text-anchor', 'middle')
        .attr('class', 'label-text')
        .text(title);
    const labelIncome = labelText.append('text')
        .attr('alignment-baseline', 'middle')
        .attr('text-anchor', 'middle')
        .attr('class', 'label-text')
        .text('$' + Math.round(xValue).toLocaleString());
    const labelPercentile = labelText.append('text')
        .attr('alignment-baseline', 'middle')
        .attr('text-anchor', 'middle')
        .attr('class', 'label-text')
        .text(percentile + '%');
    const textBBox = labelTitle[0][0].getBBox();
    const labelHeight = textBBox.height * 2 + LABEL_PADDING * 4;
    const labelWidth = textBBox.width + LABEL_PADDING * 2;
    let boxOffset = 0;
    if (xPos > this.width - labelWidth - this.margins.right) {
      // if flag will fall off right edge, flip flag to left side
      boxOffset = -labelWidth;
    }
    const textX = labelWidth / 2;
    const textY = (labelHeight / 2) + this.margins.top + 32 + ((labelHeight + LABEL_SPACING) * offset);
    labelTitle.attr('transform', 'translate(0, ' + (-textBBox.height) + ')');
    labelPercentile.attr('transform', 'translate(0, ' + (textBBox.height) + ')');
    box.attr('width', labelWidth)
        .attr('height', labelHeight)
        .attr ('transform', 'translate(' + boxOffset + ', ' + (((labelHeight + LABEL_SPACING) * offset)
            + this.margins.top + 32) + ')');
    labelText.attr('transform', 'translate(' + (textX + boxOffset) + ',' + textY + ')');
    line.attr('y1', ((labelHeight + LABEL_SPACING) * offset) + this.margins.top + 32);
    g.attr('transform', 'translate(' + xPos + ', 0)');
  }

}


export default D3Chart;