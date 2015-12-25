import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as AmIRichActions from '../actions/actions.jsx';

const propTypes = {
  setPercentile: React.PropTypes.func
};

function mapStateToProps(state) {
  return {
    currentState: state.currentState,
    currentCounty: state.currentCounty,
    userIncome: state.userIncome,
    guessedIncome: state.guessedIncome,
    userPercentile: state.userPercentile,
    guessedPercentile: state.guessedPercentile
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(AmIRichActions, dispatch)
  }
}

class UserInfoBox extends React.Component {
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
    return (
            <div className="box box-user-info">
              {props.currentCounty.name + ', ' + props.currentState.name}
            </div>
    );
  }
}

UserInfoBox.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(UserInfoBox);