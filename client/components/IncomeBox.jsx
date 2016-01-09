import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as AmIRichActions from '../actions/actions';

const propTypes = {
  setIncome: React.PropTypes.func
};

function mapStateToProps() {
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
                      <button className="btn-next btn">
                      <span
                          className="glyphicon glyphicon-circle-arrow-down"
                      />
                      </button>
                  </div>
                  </div>
                </form>
              </div>
            </div>
    );
  }
}

IncomeBox.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(IncomeBox);