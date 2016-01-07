import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { HOUSEHOLD_TYPES } from '../data/types';

import * as AmIRichActions from '../actions/actions';

const propTypes = {
  householdType: React.PropTypes.string,
  setHouseholdType: React.PropTypes.func,
  setPercentile: React.PropTypes.func
};

function mapStateToProps(state) {
  return {
    householdType: state.householdType
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(AmIRichActions, dispatch)
  }
}

class PercentileBox extends React.Component {
  constructor() {
    super();
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    this.props.actions.setPercentile(this.refs.percentile.value);
  }

  render() {
    const props = this.props;
    const householdTypeButtons = _.map(HOUSEHOLD_TYPES, function(type, key) {
      const btnClass = props.householdType === type ? 'btn-selected' : 'btn-default';
      return (
          <button
              type="button"
              key={key}
              onClick={props.actions.setHouseholdType.bind(null, type)}
              className={"btn " + btnClass}>
            {type}
          </button>
      );
    });
    const householdTypeButtonGroup = (
        <div className="btn-group button-group-income">
          {householdTypeButtons}
        </div>
    );
    return (
            <div className="box box-income">
              <div className="box-title box-title-percentile">
                <div className="number-circle">3</div>
              </div>
              <div className="box-body box-body-percentile">
                <form
                    className="form-flex"
                    onSubmit={this.onSubmit}
                    ref="form">
                  <div className="rigid-form-group">
                    <label className="control-label label-percentile">Guess Your Percentile:</label>
                    <div className="input-group input-percentile">
                      <input
                          type="number"
                          min="0"
                          max="99"
                          className="form-control"
                          required
                          ref="percentile"
                          aria-label="Guess your percentile" />
                      <span className="input-group-addon">%</span>
                    </div>
                  </div>

                  <div className="rigid-form-group">
                  <label className="control-label label-income">Household Type</label>
                  {householdTypeButtonGroup}
                  <button className="button-next">
                  <span
                      className="glyphicon glyphicon-circle-arrow-down"
                  />
                  </button>
                    </div>
                </form>
              </div>
            </div>
    );
  }
}

PercentileBox.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(PercentileBox);