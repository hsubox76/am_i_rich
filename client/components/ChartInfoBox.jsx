import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { HOUSEHOLD_TYPES, LOCATION_LEVELS } from '../data/types.js';

import * as AmIRichActions from '../actions/actions';

const propTypes = {
  locationLevel: React.PropTypes.string,
  selectingLocationLevel: React.PropTypes.bool,
  setLocationLevel: React.PropTypes.func,
  setSelectingLocationLevel: React.PropTypes.func,
  householdType: React.PropTypes.string,
  selectingHouseholdType: React.PropTypes.bool,
  countyIncomeData: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    countyIncomeData: state.countyIncomeData,
    currentState: state.currentState,
    currentCounty: state.currentCounty,
    userIncome: state.userIncome,
    guessedIncome: state.guessedIncome,
    userPercentile: state.userPercentile,
    guessedPercentile: state.guessedPercentile,
    selectingLocationLevel: state.selectingLocationLevel,
    locationLevel: state.locationLevel,
    householdType: state.householdType,
    selectingHouseholdType: state.selectingHouseholdType
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(AmIRichActions, dispatch)
  }
}

class ChartInfoBox extends React.Component {
  constructor() {
    super();
  }

  componentWillReceiveProps(nextProps) {
    if ((nextProps.locationLevel !== this.props.locationLevel)
        || (nextProps.householdType !== this.props.householdType)) {
      this.props.actions.calculatePercentileAndIncome(nextProps);
    }
  }

  render() {
    const props = this.props;
    const actions = this.props.actions;
    const locationLevels = [
      {mode: LOCATION_LEVELS.COUNTY, text: props.currentCounty.name + ', ' + props.currentState.name},
      {mode: LOCATION_LEVELS.STATE, text: props.currentState.name},
      {mode: LOCATION_LEVELS.US, text: 'United States'}];
    if (_.isUndefined(props.countyIncomeData)) {
      locationLevels.shift();
    }
    const locationItems = locationLevels.map(function(level, index) {
      if (level.mode !== props.locationLevel) {
        return (
            <div
                className="user-info-item"
                key={index}
                onClick={props.actions.setLocationLevel.bind(null, level.mode)}>
              {level.text.split(',')[0]}
            </div>
        );
      } else {
        return null;
      }
    });
    const householdItems = _.map(HOUSEHOLD_TYPES, function(type, index) {
      if (type !== props.householdType) {
        return (
            <div
                className="user-info-item"
                key={index}
                onClick={props.actions.setHouseholdType.bind(null, type)}>
              {type}
            </div>
        );
      }
    });
    const locationLevelSelector = props.selectingLocationLevel ? (
        <div className="user-info-select">
          {locationItems}
        </div>
    ) : null;
    const householdTypeSelector = props.selectingHouseholdType ? (
        <div className="user-info-select">
          {householdItems}
        </div>
    ) : null;
    return (
            <div className="box box-user-info row">
              <div className="user-info-container col-xs-12">
                <div className="user-info-text">You're a "{(100 - props.userPercentile)}-percenter"
                  among
                </div>
                <div className="user-info" onClick={actions.setSelectingHouseholdType}>
                  <span className="user-info-select-display">
                    {props.householdType}
                  </span>
                  <span className="fa fa-caret-down"></span>
                  {householdTypeSelector}
                </div>
                <div className="user-info-text">
                    households in
                </div>
                <div className="user-info" onClick={actions.setSelectingLocationLevel}>
                  <span className="user-info-select-display">
                    {_.result(_.find(locationLevels, {'mode': props.locationLevel}), 'text')}
                  </span>
                  <span className="fa fa-caret-down"></span>
                  {locationLevelSelector}
                </div>
              </div>
            </div>
    );
  }
}

ChartInfoBox.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(ChartInfoBox);