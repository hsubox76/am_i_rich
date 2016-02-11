"use strict";
import React from 'react';

class About extends React.Component {
  render() {
    return (
      <div className="about-page container">
        <div className="row">
          <div className="box-container col-md-10 col-md-offset-1 col-sm-12">
            <h3>About</h3>
            <p>Income data for this project is sourced from the
              <a href="https://www.census.gov/programs-surveys/acs/data.html"> 2014 US Census
              American Community Survey</a>.
            </p>
            <hr />
            <h3>FAQ</h3>
            <p className="faq-q">
              Why isn't my county included?
            </p>
            <p className="faq-a">
              The ACS is a survey so apparently it only includes a sampling of counties, 26%
              to be exact.  If you can't find your county, you can pick a nearby one, or pick
              "My county isn't listed" to just get the info for your state.
            </p>
            <p className="faq-q">Why doesn't the median marker line up with your calculated
              "50th percentile"?
            </p>
            <p className="faq-a">The census data comes in the form of # of households in each
              income bracket, where
              income brackets are $10,000 wide or more.  I had to do some hacky math to get rough
              percentile cutoffs for each integer percent, so it's not exact.
              It's pretty close at least I hope.
            </p>
            <p className="faq-q">Are you storing any of the data I type in?
            </p>
            <p className="faq-a">
              Nope.
            </p>
          </div>
        </div>
      </div>
    );
  }
}


export default About;