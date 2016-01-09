import React from 'react';
import { connect } from 'react-redux';

import StateInput from './StateInput';
import CountyInput from './CountyInput';

const propTypes = {
  currentState: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    currentState: state.currentState
  }
}

class LocationBox extends React.Component {
  render () {
    const countyInput = this.props.currentState.code === "0"
        ? null
        : (<CountyInput />);
    return (
            <div className="box box-location row">
              <div className="box-title box-title-location col-xs-12">
                Where You Work
              </div>
              <div className="box-body box-body-location col-xs-12">
                <form className="row">
                  <StateInput />
                  {countyInput}
                </form>
              </div>
            </div>
    );
  }
}

LocationBox.propTypes = propTypes;

export default connect(mapStateToProps)(LocationBox);