var React = require('react');
var Router = require('react-router');

// Component for the bootstrap navbar
// React Router routes are included in here
var Navbar = React.createClass({
  render: function() {
    return (
      <nav className="navbar navbar-inverse navbar-fixed-top">
        <div className="container-fluid">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <Router.Link to="home" className="navbar-brand home">ItemChimp</Router.Link>
          </div>

          <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul className="nav navbar-nav navbar-right">
              <li className="active home ">
                <Router.Link to="home">Home</Router.Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
});

// Basic structure of the app
// This is implemented by the React Router, which recognizes the "App" variable
var App = React.createClass({
  render: function() {
    return (
      <div>
        <div className="container">
          <Router.RouteHandler />
        </div>
      </div>
    );
  }
});

// Routes for the React Router
// Identifies the files that each route refers to
var routes = {
  Home: require('../routes/Home')
};

// Identifies "App" variable as the handler
// Sets up the app for routing
var routes = (
  <Router.Route name="app" path="/" handler={App}>
    <Router.Route name="home" path="/" handler={routes.Home}/>
    <Router.DefaultRoute handler={routes.Home}/>
  </Router.Route>
);

// Runs the router with proper parameters
Router.run(routes, Router.HistoryLocation, function (Handler) {
  // Route exists in the DOM element with ID "content"
  React.render(<Handler/>, document.getElementById('content'));
});
