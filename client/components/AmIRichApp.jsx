"use strict";

import React from 'react';
import ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import _ from 'lodash';

import * as AmIRichActions from '../actions/actions.jsx';

import LocationBox from './LocationBox';
import IncomeBox from './IncomeBox';
import PercentileBox from './PercentileBox';
import ChartBox from './ChartBox';
import UserInfoBox from './UserInfoBox';

function mapStateToProps(state) {
  return {
    incomeData: state.incomeData,
    userIncome: state.userIncome,
    guessedPercentile: state.guessedPercentile
  }
}

const propTypes = {
  currentState: React.PropTypes.object,
  currentCounty: React.PropTypes.string,
  states: React.PropTypes.array,
  counties: React.PropTypes.array,
  incomeData: React.PropTypes.array,
  userIncome: React.PropTypes.number,
  userPercentile: React.PropTypes.number,
  guessedIncome: React.PropTypes.number,
  guessedPercentile: React.PropTypes.number
};

// Main AmIRichApp component
class AmIRichApp extends React.Component {
  render() {
    const props = this.props;
    const d3Chart = _.isUndefined(props.guessedPercentile)
        ? null
        : (
        <ChartBox />);
    const incomeBox = _.isUndefined(props.incomeData)
        ? null
        : <IncomeBox />;
    const percentileBox = _.isUndefined(props.userIncome)
        ? null
        : <PercentileBox />;
    const userInfoBox = _.isUndefined(props.incomeData)
        ? null
        : <UserInfoBox />;
    const locationBox = _.isUndefined(props.incomeData)
        ? <LocationBox />
        : null;
    return (
      <div className="main-page container">
        <div className="row">
          <div className="box-container col-md-8 col-md-offset-2">
            {userInfoBox}
            {locationBox}
            {incomeBox}
            {percentileBox}
            {d3Chart}
          </div>
        </div>
      </div>
    );
  }
}

AmIRichApp.propTypes = propTypes;

export default connect(mapStateToProps)(AmIRichApp);