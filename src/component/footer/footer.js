import React from 'react';
import { connect } from 'react-redux';

import CacheButton from './cache.js';
import Throttle from './throttle.js';
import RequestCount from './request-count.js';
import ProxyStatus from './proxy-status.js';

import {
  toggleCaching,
  toggleThrottling as toggleThrottle,
  setThrottleRate,
  clearRequests
} from '../../actions/proxy.js';

import { getRequestData } from '../../reducers/requests.js';
import { getProxyState } from '../../reducers/proxy.js';

const Footer = props =>
  <div className="footer">
    <CacheButton
      cachingEnabled={props.cachingEnabled}
      toggleCaching={props.toggleCaching}
    />
    <Throttle
      toggleThrottle={props.toggleThrottle}
      setThrottleRate={props.setThrottleRate}
      throttleEnabled={props.throttleEnabled}
      throttleRate={props.throttleRate}
    />
    <RequestCount
      requestData={props.requestData}
      clearRequests={props.clearRequests}
    />
    <ProxyStatus
      proxyStatus={props.proxyStatus}
      proxyReason={props.proxyReason}
    />
  </div>;

const mapStateToProps = (state) => {
  const proxy = getProxyState(state);

  return {
    cachingEnabled: proxy.cachingEnabled,
    throttleEnabled: proxy.throttleEnabled,
    throttleRate: proxy.throttleRate,
    requestData: getRequestData(state),
    proxyStatus: proxy.status,
    proxyReason: proxy.statusReason
  };
};

const mapDispatchToProps = {
  toggleCaching,
  toggleThrottle,
  setThrottleRate,
  clearRequests
};

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
