import React from 'react';
import Browsers from './browsers.js';

const Welcome = () =>
  <div className="setup-instructions">
    <div className="setup-instructions-wrapper">
      <h2>Proxy started on localhost:1338</h2>
      <h3>Launch a browser, using James as a proxy</h3>
      <Browsers />
    </div>
  </div>;

export default Welcome;
