import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as AmIRichActions from '../actions/actions.jsx';

const propTypes = {
  currentCounty: React.PropTypes.object,
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
    const countyInfo = event.target.value.split('-');
    this.props.actions.setCurrentCounty(countyInfo[0], countyInfo[1]);
    this.props.actions.requestCountyData(countyInfo[0], this.props.currentState.code);
  }

  render () {
    const listItems = this.props.counties.map(function(county) {
      return (
          <option
              key={'county-'+county.countyCode}
              value={county.countyCode + '-' + county.name}>{county.name}
          </option>
      )
    });
    return (
        <div className="form-group">
          <label className="control-label label-county">County:</label>
          <select
              value={this.props.currentCounty.code + '-' +
               this.props.currentCounty.name}
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