import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as AmIRichActions from '../actions/actions';

const propTypes = {
  setIncome: React.PropTypes.func
};

function mapStateToProps(state) {
  return {
  }
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
    this.props.actions.setIncome(self.refs.income.value);
  }

  render() {
    return (
            <div className="box box-income">
              <div className="box-title box-title-income">
                <div className="number-circle">2</div>
              </div>
              <div className="box-body box-body-income">
                <form
                    className="form-flex"
                    onSubmit={this.onSubmit}
                    ref="form">
                  <div className="rigid-form-group">
                    <label className="control-label label-income">How Much Do You Make?</label>
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
                  </div>
                  <div className="rigid-form-group">
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

IncomeBox.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(IncomeBox);