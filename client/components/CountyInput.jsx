import React from 'react';

const CountyInput = React.createClass({
  propTypes: {
    currentCounty: React.PropTypes.string,
    counties: React.PropTypes.array,
    setCurrentCounty: React.PropTypes.func
  },
  onCountySelect: function (event) {
    this.props.setCurrentCounty(event.target.value);
  },
  render: function () {
    const listItems = this.props.counties.map(function(county) {
      return (
          <option
              key={'county-'+county.countyCode}
              value={county.countyCode}>{county.name}
          </option>
      )
    });
    return (
        <div className="form-group">
          <label className="control-label label-county">County:</label>
          <select
              value={this.props.currentCounty}
              className="form-control select-county"
              onChange={this.onCountySelect}>
            {listItems}
          </select>
        </div>
    );
  }
});

export default CountyInput;