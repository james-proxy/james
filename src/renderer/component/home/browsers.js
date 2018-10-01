import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import Browser from './browser.js';

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
  browsers: PropTypes.array,
  launchBrowser: PropTypes.func.isRequired
};


import { launchBrowser } from '../../../common/actions/browsers.js';
import { getBrowsers } from '../../reducers/browsers.js';

const mapStateToProps = (state) => ({
  browsers: getBrowsers(state)
});

const mapDispatchToProps = {
  launchBrowser
};

export default connect(mapStateToProps, mapDispatchToProps)(Browsers);
