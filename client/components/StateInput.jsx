import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as AmIRichActions from '../actions/actions.jsx';


function mapStateToProps(state) {
  return {
    currentState: state.currentState,
    states: state.states
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(AmIRichActions, dispatch)
  }
}

const propTypes = {
  currentState: React.PropTypes.string,
  states: React.PropTypes.array,
  getCountiesInState: React.PropTypes.func
};

class StateInput extends React.Component {
  constructor() {
    super();
    this.onStateSelect = this.onStateSelect.bind(this);
  }

  onStateSelect(event) {
    this.props.actions.setCurrentState(event.target.value);
  }

  render() {
    const listItems = this.props.states.map(function(state) {
      return <option key={'state-'+state.code} value={state.code}>{state.name}</option>
    });
    return (
        <div className="form-group">
          <label className="control-label label-state">State:</label>
          <select
              value={this.props.currentState}
              className="form-control select-state"
              onChange={this.onStateSelect}>
            {listItems}
          </select>
        </div>
    );
  }
}

StateInput.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(StateInput);