"use strict";

import React from 'react';
import ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';


import {postToFacebook} from '../helpers/helpers';
import * as AmIRichActions from '../actions/actions';


function mapStateToProps(state) {
  return {
    currentPage: state.currentPage
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(AmIRichActions, dispatch)
  }
}

const propTypes = {
  currentPage: React.PropTypes.string
};

// Main AmIRichApp component
class Navbar extends React.Component {

  render() {
    const props = this.props;
    return (
        <div className="navbar navbar-inverse navbar-static-top">
          <div className="container-fluid">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <a
                  className="navbar-brand"
                  onClick={props.actions.setCurrentPage.bind(null, "app")}>What "Percenter" Am I?</a>
            </div>
            <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
              <ul className="nav navbar-nav navbar-right">
                <li>
                  <a
                      onClick={props.actions.setCurrentPage.bind(null, "app")}>Calculator</a>
                </li>
                <li>
                  <a
                    onClick={props.actions.setCurrentPage.bind(null, "about")}>About</a>
                </li>
                <li>
                  <a
                      onClick={postToFacebook.bind(null, 'Are you a one-percenter?  Or a 77-percenter?')}
                      className="fa fa-facebook-official"></a>
                </li>
              </ul>
            </div>
          </div>
        </div>
    );
  }
}

Navbar.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);