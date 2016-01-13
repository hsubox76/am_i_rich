import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { HOUSEHOLD_TYPES, LOCATION_LEVELS } from '../data/types.js';

import * as AmIRichActions from '../actions/actions';
import {postToFacebook} from '../helpers/helpers';

const propTypes = {
};

function mapStateToProps(state) {
  return {
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(AmIRichActions, dispatch)
  }
}

class ChartBottomControls extends React.Component {
  render() {
    const props = this.props;
    const actions = this.props.actions;
    return (
        <div className="box row">
          <div className="col-xs-12 box-chart-bottom">
            <button
                className="btn btn-start-over pull-right"
                onClick={actions.resetApp}>Start Over
            </button>
            <div className="share-buttons">
              Share on
              <span
                  onClick={postToFacebook}
                  className="fa fa-facebook-official"></span>
            </div>
          </div>
        </div>
    );
  }
}

ChartBottomControls.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(ChartBottomControls);