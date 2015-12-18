import React from 'react';
import StateInput from './StateInput';
import CountyInput from './CountyInput';

const LocationBox = React.createClass({
  propTypes: {
    currentState: React.PropTypes.string,
    currentCounty: React.PropTypes.string,
    states: React.PropTypes.array,
    counties: React.PropTypes.array,
    getCountiesInState: React.PropTypes.func,
    setCounty: React.PropTypes.func
  },
  render: function () {
    const countyInput = this.props.currentState === "0"
        ? null
        : (<CountyInput
        currentCounty={this.props.currentCounty}
        setCurrentCounty={this.props.setCounty}
        counties={this.props.counties} />);
    return (
        <div className="row">
          <div className="box-container col-md-8 col-md-offset-2">
            <div className="box box-location">
              <div className="box-title box-title-location">
                <div className="number-circle">1</div>
              </div>
              <div className="box-body box-body-location">
                <form className="form-flex">
                  <StateInput
                      currentState={this.props.currentState}
                      states={this.props.states}
                      getCountiesInState={this.props.getCountiesInState} />
                  {countyInput}
                </form>
              </div>
            </div>
          </div>
        </div>
    );
  }
});

export default LocationBox;