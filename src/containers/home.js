import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import Browsers from '../component/home/browsers.js';

const HomeContainer = ({port}) =>
  <div className="setup-instructions">
    <div className="setup-instructions-wrapper">
      <h2>Proxy started on localhost:{port}</h2>
      <h3>Launch a browser, using James as a proxy</h3>
      <Browsers />
    </div>
  </div>;

HomeContainer.propTypes = {
  port: PropTypes.number.isRequired
};

import { getProxyPort } from '../reducers/app.js';

const mapStateToProps = (state) => ({
  port: getProxyPort(state)
});

export default connect(mapStateToProps)(HomeContainer);
