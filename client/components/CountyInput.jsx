import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as AmIRichActions from '../actions/actions.jsx';

const propTypes = {
  currentCounty: React.PropTypes.string,
  counties: React.PropTypes.array,
  setCurrentCounty: React.PropTypes.func
};

function mapStateToProps(state) {
  return {
    currentState: state.currentState,
    currentCounty: state.currentCounty,
    counties: state.counties
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(AmIRichActions, dispatch)
  }
}

class CountyInput extends React.Component {
  constructor() {
    super();
    this.onCountySelect = this.onCountySelect.bind(this);
  }
  onCountySelect (event) {
    this.props.actions.setCurrentCounty(event.target.value, this.props.currentState);
  }

  render () {
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
}

CountyInput.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(CountyInput);