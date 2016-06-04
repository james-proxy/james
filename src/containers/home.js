import React from 'react';
import { connect } from 'react-redux';

import Browsers from '../component/home/browsers.js';

const Home = ({port}) =>
  <div className="setup-instructions">
    <div className="setup-instructions-wrapper">
      <h2>Proxy started on localhost:{port}</h2>
      <h3>Launch a browser, using James as a proxy</h3>
      <Browsers />
    </div>
  </div>;

Home.propTypes = {
  port: React.PropTypes.number.isRequired
};

import { getProxyPort } from '../reducers/app.js';

const mapStateToProps = (state) => ({
  port: getProxyPort(state)
});

export default connect(mapStateToProps)(Home);
