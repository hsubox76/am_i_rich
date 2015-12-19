import React from 'react';
import { connect } from 'react-redux';

import StateInput from './StateInput';
import CountyInput from './CountyInput';

const propTypes = {
  currentState: React.PropTypes.string
};

function mapStateToProps(state) {
  return {
    currentState: state.currentState
  }
}

class LocationBox extends React.Component {
  render () {
    const countyInput = this.props.currentState === "0"
        ? null
        : (<CountyInput />);
    return (
        <div className="row">
          <div className="box-container col-md-8 col-md-offset-2">
            <div className="box box-location">
              <div className="box-title box-title-location">
                <div className="number-circle">1</div>
              </div>
              <div className="box-body box-body-location">
                <form className="form-flex">
                  <StateInput />
                  {countyInput}
                </form>
              </div>
            </div>
          </div>
        </div>
    );
  }
}

LocationBox.propTypes = propTypes;

export default connect(mapStateToProps)(LocationBox);