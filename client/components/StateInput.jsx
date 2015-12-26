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
  currentState: React.PropTypes.object,
  states: React.PropTypes.array,
  getCountiesInState: React.PropTypes.func
};

class StateInput extends React.Component {
  constructor() {
    super();
    this.onStateSelect = this.onStateSelect.bind(this);
  }

  onStateSelect(event) {
    const stateInfo = event.target.value.split(':');
    this.props.actions.setCurrentState(stateInfo[0], stateInfo[1]);
    this.props.actions.requestStateData(stateInfo[0]);
  }

  render() {
    const listItems = this.props.states.map(function(state) {
      return <option key={'state-'+state.code} value={state.code + ':' + state.name}>{state.name}</option>
    });
    return (
        <div className="form-group">
          <label className="control-label label-state">State:</label>
          <select
              value={this.props.currentState.code + ':' + this.props.currentState.name}
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