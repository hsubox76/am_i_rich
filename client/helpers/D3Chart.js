import d3 from 'd3';

const LABEL_PADDING = 5;
const LABEL_BORDER_SIZE = 1;

class D3Chart {
  constructor(options, data) {
    this.options = options;
    this.margins = options.margins;
    this.width = options.width;
    this.data = data;
    this.height = Math.round(this.width * 0.66);
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
            return this.xRange(1000);
          } else if (d.max) {
            return this.xRange((d.max + d.min)/2);
          }
        })
        .y0(function() {
          return this.yRange(100);
        })
        .y1(function(d) {
          return this.yRange(d.households);
        })
        .interpolate('basis');
  }

  drawGraph() {
    this.plot.append('svg:g')
        .attr('class', 'x-axis')
        .attr('transform', 'translate(0,' + (this.height - this.margins.bottom) + ')')
        .call(this.xAxis)
        .append("text")
        .attr("class", "x-label")
        .attr("text-anchor", "middle")
        .attr("x", this.width / 2)
        .attr("y", 35)
        .text("income per household (dollars)");

    this.plot.append('svg:g')
        .attr('class', 'y-axis')
        .attr('transform', 'translate(' + (this.margins.left) + ',' + -(this.margins.bottom - this.margins.top) + ')')
        .call(this.yAxis)
        .append("text")
        .attr("class", "y-label")
        .attr("text-anchor", "middle")
        .attr("x", -this.height / 2)
        .attr("y", -32)
        .attr("transform", "rotate(-90,0,0)")
        .text("# households");

    this.plot.append('svg:path')
        .attr('d', this.graphArea(this.data))
        .attr('transform', 'translate(' + (0) + ',' + -(this.margins.bottom - this.margins.top) + ')')
        .attr('class', 'graph-area');
  }

  drawMarkerLine(xValue, color, labelText, offset = 0) {
    const xPos= this.xRange(xValue);
    const g = this.plot.append('g');
    const line = g.append('svg:line')
        .attr('x1', 0)
        .attr('x2', 0)
        .attr('y2', this.height - this.margins.bottom)
        .attr('stroke-width', 3)
        .attr('stroke', color);
    const box = g.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('stroke', 'none')
        .attr('fill', color);
    const text = g.append('text')
        .attr('alignment-baseline', 'middle')
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .attr ('transform', 'translate(' + (LABEL_PADDING + LABEL_BORDER_SIZE) + ', '
            + (this.margins.top + 32 + LABEL_PADDING + LABEL_BORDER_SIZE) + ')')
        .text(labelText);
    const textBBox = text[0][0].getBBox();
    const labelHeight = textBBox.height + LABEL_PADDING * 2;
    const labelWidth = textBBox.width + LABEL_PADDING * 2;
    const textX = labelWidth / 2;
    const textY = (labelHeight / 2) + this.margins.top + 32 + (labelHeight * offset);
    box.attr('width', labelWidth)
        .attr('height', labelHeight)
        .attr ('transform', 'translate(0, ' + ((labelHeight * offset)
            + this.margins.top + 32) + ')');
    text.attr('transform', 'translate(' + textX + ',' + textY + ')');
    line.attr('y1', (labelHeight * offset) + this.margins.top + 32)
    g.attr('transform', 'translate(' + xPos + ', 0)');
  }

}


export default D3Chart;