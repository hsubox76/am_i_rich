import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { INCOME_TIME_PERIODS } from '../data/types';

import * as AmIRichActions from '../actions/actions';

const propTypes = {
  setIncome: React.PropTypes.func
};

function mapStateToProps(state) {
  return {
    incomeTimePeriod: state.incomeTimePeriod,
    faqs: state.faqs
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(AmIRichActions, dispatch)
  }
}

class IncomeBox extends React.Component {
  constructor() {
    super();
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    const self = this;
    this.props.actions.setIncome(parseInt(self.refs.income.value) *
      self.props.incomeTimePeriod.divideBy);
  }

  render() {
    const props = this.props;
    const actions = this.props.actions;
    const incomeTimePeriodButtons = _.map(INCOME_TIME_PERIODS, function(type, key) {
      const btnClass = props.incomeTimePeriod.divideBy === type.divideBy
        ? 'btn-selected' : 'btn-default';
      return (
          <button
              type="button"
              key={key}
              onClick={props.actions.setIncomeTimePeriod.bind(null, type)}
              className={"btn " + btnClass}>
            {type.text}
          </button>
      );
    });
    const incomeTimePeriodButtonGroup = (
        <div className="btn-group button-group-app button-group-income">
          {incomeTimePeriodButtons}
        </div>
    );   
    return (
            <div className="box box-form row">
              <div className="box-title box-title-income col-xs-12">
                <div className="number-circle">How Much You Make</div>
              </div>
              <div className="box-body box-body-income col-xs-12">
                <form
                    className="row"
                    onSubmit={this.onSubmit}
                    ref="form">
                  <div className="form-row col-xs-12">
                    <div className="form-inline">
                    <label className="control-label sr-only">Your Income</label>
                      <div className="input-group input-income">
                        <span className="input-group-addon">$</span>
                        <input
                            type="number"
                            min="0"
                            className="form-control"
                            required
                            ref="income"
                            aria-label="Amount (to the nearest dollar)" />
                        <span className="input-group-addon">.00</span>
                      </div>
                      {incomeTimePeriodButtonGroup}
                      <button className="btn-next btn">
                      <span
                          className="glyphicon glyphicon-circle-arrow-down"
                      />
                      </button>
                  </div>
                  </div>
                  <div className="box-body faq-link col-xs-12 col-sm-8 col-md-6">
                    <span onClick={actions.toggleTooltip.bind(null, 1)}>{props.faqs[1].question}</span>
                    {props.faqs[1].show
                      ? <div onClick={actions.toggleTooltip.bind(null, 1)}
                        className="faq-tooltip">{props.faqs[1].answer}</div>
                        : null}
                  </div>
                </form>

              </div>
            </div>
    );
  }
}

IncomeBox.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(IncomeBox);