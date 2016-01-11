"use strict";

import React from 'react';
import ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';


import * as AmIRichActions from '../actions/actions';


function mapStateToProps(state) {
  return {
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(AmIRichActions, dispatch)
  }
}

const propTypes = {
};

// Main AmIRichApp component
class Navbar extends React.Component {
  render() {
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
              <a className="navbar-brand" href="#">Am I Middle Class?</a>
            </div>
            <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
              <ul className="nav navbar-nav navbar-right">
                <li><a href="#">About</a></li>
                <li>
                  <div
                      className="fb-like"
                      data-share="true"
                      data-width="450"
                      data-show-faces="true">
                  </div>
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