import React from 'react';
import Browser from './browser.js';

const {array, func} = React.PropTypes;

const Welcome = (props) => {
  const {browsers, openBrowser} = props;

  const browserElements = browsers.map((browser) => {
    return <Browser browserName={browser.name} key={browser.name} openBrowser={openBrowser} />;
  });

  return <div className="setup-instruction">
    <h2>Proxy started on localhost:1338</h2>
    <h3>Launch a browser, using James as a proxy</h3>
    {browserElements}
  </div>;
};

Welcome.propTypes = {
  browsers: array.isRequired,
  openBrowser: func.isRequired
};

export default Welcome;
