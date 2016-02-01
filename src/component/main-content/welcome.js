import React from 'react';
import Browser from './browser.js';

const {array, func} = React.PropTypes;

const byNameThenVersion = (a, b) => {
  if (a.name < b.name) return -1;
  if (a.name > b.name) return 1;

  if (a.version < b.version) return -1;
  if (a.version > b.version) return 1;

  return 0;
};

const Welcome = (props) => {
  const {browsers, openBrowser} = props;

  const browserElements = browsers
    .sort(byNameThenVersion)
    .map((browser, index) => {
      return <Browser browser={browser} openBrowser={openBrowser} key={index} />;
    });

  return <div className="setup-instruction">
    <h2>Proxy started on localhost:1338</h2>
    <h3>Launch a browser, using James as a proxy</h3>
    <div className="browsers">{browserElements}</div>
  </div>;
};

Welcome.propTypes = {
  browsers: array.isRequired,
  openBrowser: func.isRequired
};

export default Welcome;
