import React from 'react';

const StateInput = React.createClass({

  propTypes: {
    currentState: React.PropTypes.string,
    states: React.PropTypes.array,
    getCountiesInState: React.PropTypes.func
  },

  onStateSelect: function (event) {
    this.props.getCountiesInState(event.target.value);
  },

  render: function () {
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
});

export default StateInput;