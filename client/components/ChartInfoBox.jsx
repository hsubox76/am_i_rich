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
  selectingHouseholdType: React.PropTypes.bool
};

function mapStateToProps(state) {
  return {
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

class UserInfoBox extends React.Component {
  constructor() {
    super();
  }

  render() {
    const props = this.props;
    const actions = this.props.actions;
    const locationLevels = [
      {mode: LOCATION_LEVELS.COUNTY, text: props.currentCounty.name + ', ' + props.currentState.name},
      {mode: LOCATION_LEVELS.STATE, text: props.currentState.name},
      {mode: LOCATION_LEVELS.US, text: 'United States'}];
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
    const locationLevelSelector = props.selectingLocationLevel ? (
        <div className="user-info-select">
          {locationItems}
        </div>
    ) : null;
    const otherHouseholdType = _.find(HOUSEHOLD_TYPES, function(type) {
      return type !== props.householdType
    });
    const householdTypeSelector = props.selectingHouseholdType ? (
        <div className="user-info-select">
          <div
              onClick={props.actions.setHouseholdType.bind(null, otherHouseholdType)}
              className="user-info-item">{otherHouseholdType}</div>
        </div>
    ) : null;
    return (
            <div className="box box-user-info">
              <div className="user-info-income">
                {'$' + Math.round(props.userIncome).toLocaleString()} in
              </div>
              <div className="user-info" onClick={actions.setSelectingLocationLevel}>
                <span className="user-info-text">
                  {_.result(_.find(locationLevels, {'mode': props.locationLevel}), 'text')}
                </span>
                <span className="fa fa-caret-down"></span>
                {locationLevelSelector}
              </div>
              <div className="user-info" onClick={actions.setSelectingHouseholdType}>
                <span className="user-info-text">
                  for a {props.householdType}
                </span>
                <span className="fa fa-caret-down"></span>
                {householdTypeSelector}
              </div>
            </div>
    );
  }
}

UserInfoBox.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(UserInfoBox);