import React from 'react';

const IncomeBox = React.createClass({
  propTypes: {
    setIncome: React.PropTypes.func
  },
  onSubmit(e) {
    e.preventDefault();
    const self = this;
    this.props.setIncome(self.refs.income.value);
  },
  render: function() {
    return (
        <div className="row">
          <div className="box-container col-md-8 col-md-offset-2">
            <div className="box box-income">
              <div className="box-title box-title-income">
                <div className="number-circle">2</div>
              </div>
              <div className="box-body box-body-income">
                <form
                    className="form-flex"
                    onSubmit={this.onSubmit}
                    ref="form">
                  <label className="control-label label-income">How Much Do You Make?</label>
                  <div className="input-group input-income">
                    <span className="input-group-addon">$</span>
                    <input
                        type="number"
                        className="form-control"
                        required
                        ref="income"
                        aria-label="Amount (to the nearest dollar)" />
                    <span className="input-group-addon">.00</span>
                  </div>
                  <button className="button-next">
                  <span
                      className="glyphicon glyphicon-circle-arrow-down"
                  />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
    );
  }
});

export default IncomeBox;