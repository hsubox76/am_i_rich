import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as AmIRichActions from '../actions/actions';

import StateInput from './StateInput';
import CountyInput from './CountyInput';

const propTypes = {
  currentState: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    currentState: state.currentState,
    faqs: state.faqs
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(AmIRichActions, dispatch)
  }
}

class LocationBox extends React.Component {
  render () {
    const props = this.props;
    const actions = this.props.actions;
    const countyInput = this.props.currentState.code === "0"
        ? null
        : (<CountyInput />);
    const countyQuestion = this.props.currentState.code === "0"
        ? null
        : (
            <div className="box-body faq-link col-xs-12">
              <span onClick={actions.toggleTooltip.bind(null, 0)}>{props.faqs[0].question}</span>
              {props.faqs[0].show
                ? <div onClick={actions.toggleTooltip.bind(null, 0)}
                  className="faq-tooltip">{props.faqs[0].answer}</div>
                  : null}
            </div>
          );    
    return (
            <div className="box box-form row">
              <div className="box-title box-title-location col-xs-12">
                Where You Work
              </div>
              <div className="box-body box-body-location col-xs-12">
                <form className="row">
                  <StateInput />
                  {countyInput}
                </form>
              </div>
              {countyQuestion}
            </div>
    );
  }
}

LocationBox.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(LocationBox);