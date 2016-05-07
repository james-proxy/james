import React from 'react';
import {connect} from 'react-redux';

import Browser from './Browser.js';

const byNameThenVersion = (a, b) => {
  if (a.name < b.name) return -1;
  if (a.name > b.name) return 1;

  if (a.version < b.version) return -1;
  if (a.version > b.version) return 1;

  return 0;
};

const Browsers = ({browsers, launchBrowser}) => {
  const browserElements = browsers
    .sort(byNameThenVersion)
    .map((browser, index) => {
      return <Browser browser={browser} launchBrowser={launchBrowser} key={index} />;
    });

  return <div className="browsers">{browserElements}</div>;
};

Browsers.propTypes = {
  browsers: React.propTypes.array,
  launchBrowser: React.propTypes.fun.isRequired
};


import { launchBrowser } from '../../actions/browsers.js';

const mapStateToProps = (state) => ({
  browsers: state.browsers.browsers
});

const mapDispatchToProps = (dispatch) => ({
  launchBrowser: (browser) => { dispatch(launchBrowser(browser)); }
});

export default connect(mapStateToProps, mapDispatchToProps)(Browsers);
