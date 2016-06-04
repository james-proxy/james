import React from 'react';
import { connect } from 'react-redux';

import CacheButton from './cache.js';
import Throttle from './throttle.js';
import RequestCount from './request-count.js';
import ProxyStatus from './proxy-status.js';

const {func, number, object, bool, string} = React.PropTypes;

const Footer = (props) => {
  const {
    cachingEnabled, toggleCaching,
    throttleEnabled, throttleRate, setThrottleRate, toggleThrottle,
    requestData, clearRequests,
    proxyStatus
  } = props;

  return <div className="footer">
    <CacheButton {...{cachingEnabled, toggleCaching}} />
    <Throttle {...{throttleEnabled, throttleRate, setThrottleRate, toggleThrottle}} />
    <RequestCount {...{requestData, clearRequests}} />
    <ProxyStatus {...{proxyStatus}} />
  </div>;
};

Footer.propTypes = {
  cachingEnabled: bool.isRequired,
  toggleCaching: func.isRequired,
  throttleEnabled: bool.isRequired,
  throttleRate: number.isRequired,
  setThrottleRate: func.isRequired,
  toggleThrottle: func.isRequired,
  requestData: object.isRequired,
  clearRequests: func.isRequired,
  proxyStatus: string.isRequired
};

import {
  toggleCaching,
  toggleThrottling as toggleThrottle,
  setThrottleRate,
  clearRequests
} from '../../actions/proxy.js';

const mapStateToProps = (state) => ({
  cachingEnabled: state.proxy.cachingEnabled,
  throttleEnabled: state.proxy.throttleEnabled,
  throttleRate: state.proxy.throttleRate,
  proxyStatus: state.proxy.status,
  requestData: state.requests.data
});

const mapDispatchToProps = {
  toggleCaching,
  toggleThrottle,
  setThrottleRate,
  clearRequests
};

// export default Footer;
export default connect(mapStateToProps, mapDispatchToProps)(Footer);
