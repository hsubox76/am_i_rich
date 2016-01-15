import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { LOCATION_LEVELS, LOADING_STATES } from '../data/types.js';

import * as AmIRichActions from '../actions/actions';

const propTypes = {
  currentCounty: React.PropTypes.object,
  counties: React.PropTypes.array,
  setCurrentCounty: React.PropTypes.func
};

function mapStateToProps(state) {
  return {
    currentState: state.currentState,
    currentCounty: state.currentCounty,
    counties: state.counties,
    loadingCountyList: state.loadingCountyList
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
    const countyInfo = event.target.value.split(':');
    this.props.actions.setCurrentCounty(countyInfo[0], countyInfo[1]);
    if (countyInfo[0] !== '-1') {
      // county exists
      this.props.actions.requestCountyData(countyInfo[0], this.props.currentState.code);
    } else {
      // county not listed
      this.props.actions.setLocationLevel(LOCATION_LEVELS.STATE);
      this.props.actions.setCurrentDataSet();
    }
  }

  render () {
    const listItems = this.props.counties.map(function(county) {
      return (
          <option
              key={'county-' + county.countyCode}
              value={county.countyCode + ':' + county.name}>{county.name}
          </option>
      )
    });
    const selectBox = (
        <div className="form-row col-md-6 col-xs-12">
          <label className="control-label  sr-only">County:</label>
          <select
              value={this.props.currentCounty.code + ':' +
               this.props.currentCounty.name}
              className="form-control select-county"
              onChange={this.onCountySelect}>
            {listItems}
          </select>
        </div>
    );
    return (this.props.loadingCountyList === 'loading'
        ? (<div className="loading-bar"><span className="fa fa-spinner fa-spin"></span></div>)
        : selectBox);
  }
}

CountyInput.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(CountyInput);