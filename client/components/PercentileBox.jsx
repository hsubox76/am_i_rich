import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as AmIRichActions from '../actions/actions.jsx';

const propTypes = {
  setPercentile: React.PropTypes.func
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
                  <button className="button-next">
                  <span
                      className="glyphicon glyphicon-circle-arrow-down"
                  />
                  </button>
                </form>
              </div>
            </div>
    );
  }
}

PercentileBox.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(PercentileBox);