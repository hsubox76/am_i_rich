"use strict";

import React from 'react';
import ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import _ from 'lodash';

import * as AmIRichActions from '../actions/actions';

import LocationBox from './LocationBox';
import IncomeBox from './IncomeBox';
import PercentileBox from './PercentileBox';
import ChartBox from './ChartBox';
import ChartInfoBox from './ChartInfoBox';
import ChartBottomControls from './ChartBottomControls';
import About from './About';

import { LOADING_STATES } from '../data/types.js';

function mapStateToProps(state) {
  return {
    loadingCountyIncomeData: state.loadingCountyIncomeData,
    loadingStateIncomeData: state.loadingStateIncomeData,
    countryIncomeData: state.countryIncomeData,
    countyIncomeData: state.countyIncomeData,
    stateIncomeData: state.stateIncomeData,
    userIncome: state.userIncome,
    householdType: state.householdType,
    guessedPercentile: state.guessedPercentile,
    guessedIncome: state.guessedIncome,
    locationLevel: state.locationLevel,
    currentPage: state.currentPage
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(AmIRichActions, dispatch)
  }
}

const propTypes = {
  currentState: React.PropTypes.object,
  currentCounty: React.PropTypes.object,
  states: React.PropTypes.array,
  counties: React.PropTypes.array,
  loadingCountyIncomeData: React.PropTypes.string,
  loadingStateIncomeData: React.PropTypes.string,
  countyIncomeData: React.PropTypes.object,
  countryIncomeData: React.PropTypes.object,
  stateIncomeData: React.PropTypes.object,
  userIncome: React.PropTypes.number,
  userPercentile: React.PropTypes.number,
  guessedIncome: React.PropTypes.number,
  guessedPercentile: React.PropTypes.number,
  locationLevel: React.PropTypes.string
};

// Main AmIRichApp component
class AmIRichApp extends React.Component {

  componentWillMount() {
    this.props.actions.requestCountryData();
  }

  componentWillUpdate(nextProps) {
    if (nextProps.loadingCountyIncomeData === 'loaded'
        && nextProps.loadingStateIncomeData === 'loaded'
        && !_.isUndefined(nextProps.userIncome)
        && !_.isUndefined(nextProps.guessedPercentile)
        && _.isUndefined(nextProps.guessedIncome)
        && _.isUndefined(nextProps.userPercentile)
    ) {
    }
  }

  render() {
    const props = this.props;
    const locationBox = _.isUndefined(props.guessedPercentile)
        ? <LocationBox />
        : null;
    const incomeBox = (!_.isUndefined(props.loadingCountyIncomeData)
      && _.isUndefined(props.guessedPercentile))
        ? <IncomeBox />
        : null;
    const percentileBox = (!_.isUndefined(props.userIncome) && _.isUndefined(props.guessedPercentile))
        ? <PercentileBox />
        : null;
    const chartInfoBox = _.isUndefined(props.guessedPercentile)
        ? null
        : <ChartInfoBox />;
    const chartBox = (_.isUndefined(props.guessedPercentile))
        ? null
        : (
        <ChartBox />);
    const chartBottomControls = (_.isUndefined(props.guessedPercentile))
        ? null
        : (
        <ChartBottomControls />);
    const mainApp = this.props.currentPage === 'app' ? (
        <div className="box-container col-md-10 col-md-offset-1 col-sm-12">
          {chartInfoBox}
          {locationBox}
          {incomeBox}
          {percentileBox}
          {chartBox}
          {chartBottomControls}
        </div>
    ) : null;
    const aboutPage = this.props.currentPage === 'about' ? <About /> : null;
    return (
      <div className="main-page container">
        <div className="row">
          {mainApp}
          {aboutPage}
        </div>
      </div>
    );
  }
}

AmIRichApp.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(AmIRichApp);