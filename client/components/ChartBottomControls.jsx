import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { HOUSEHOLD_TYPES, LOCATION_LEVELS } from '../data/types.js';

import * as AmIRichActions from '../actions/actions';
import {postToFacebook} from '../helpers/helpers';

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
    locationLevel: state.locationLevel,
    householdType: state.householdType
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(AmIRichActions, dispatch)
  }
}

class ChartBottomControls extends React.Component {
  render() {
    const props = this.props;
    const actions = this.props.actions;
    const locationLevels = [
      {mode: LOCATION_LEVELS.COUNTY, text: props.currentCounty.name + ', ' + props.currentState.name},
      {mode: LOCATION_LEVELS.STATE, text: props.currentState.name},
      {mode: LOCATION_LEVELS.US, text: 'United States'}];
    let accuracyText;
    if (props.guessedPercentile === props.userPercentile) {
      accuracyText = <span>perfect!</span>;
    } else if (props.guessedPercentile > props.userPercentile) {
      accuracyText = <span><span className="stat">
        {(props.guessedPercentile - props.userPercentile)}</span>
          percentile points higher than your actual income.</span>;
    } else {
      accuracyText = <span><span className="stat">
        {(props.userPercentile - props.guessedPercentile)}</span>
          percentile points lower than your actual income.</span>;
    }
    const userPercenter = (100 - props.userPercentile);
    const location = _.result(_.find(locationLevels, {'mode': props.locationLevel}), 'text');
    const shareMessage = "I'm a " + userPercenter + "-percenter! (Among "
      + props.householdType + " households in " + location + ".) What are you?";
    return (
        <div className="box row box-chart-bottom">
          <div className="col-xs-12">
            <p className="summary-text">You make less
              than <span className="stat">{userPercenter}%</span> of
              <span className="stat">{props.householdType}</span> households
              in
              <span className="stat">{location}</span>.
            </p>
            <p className="summary-text">(Or, you make more than
              <span className="stat">{props.userPercentile}%</span>
              of those households.)</p>
            <p className="summary-text">You guessed that you made less than
              <span className="stat">{(100 - props.guessedPercentile)}%</span> of households.
                Your guess was {accuracyText}</p>
          </div>
          <div className="col-xs-12">
            <button
                className="btn btn-start-over pull-right"
                onClick={actions.resetApp}>Start Over
            </button>
            <div className="share-buttons">
              Share on
              <span
                  onClick={_.wrap(shareMessage, postToFacebook)}
                  className="fa fa-facebook-official"></span>
            </div>
          </div>
        </div>
    );
  }
}

ChartBottomControls.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(ChartBottomControls);