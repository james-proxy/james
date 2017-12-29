import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import CacheButton from './cache.js';
import Throttle from './throttle.js';
import RequestCount from './request-count.js';
import ProxyStatus from './proxy-status.js';
import UpdateStatus from './update-status';

import { 
  ProxyStatus as ProxyStatusTypes,
  UpdateStatus as UpdateStatusTypes
} from 'common/prop-types';
import {
  toggleCaching,
  toggleThrottling as toggleThrottle,
  setThrottleRate,
  clearRequests
} from 'common/actions/proxy.js';

import { getUpdateStatus } from '../../reducers/app.js';
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
    <UpdateStatus
      status={props.updateStatus}
      info={props.updateInfo}
    />
  </div>;

Footer.propTypes = {
  cachingEnabled: PropTypes.bool.isRequired,
  toggleCaching: PropTypes.func.isRequired,
  proxyStatus: ProxyStatusTypes.isRequired,
  proxyReason: PropTypes.string,
  proxyMessage: PropTypes.string,
  requestData: PropTypes.object.isRequired,
  clearRequests: PropTypes.func.isRequired,
  toggleThrottle: PropTypes.func.isRequired,
  setThrottleRate: PropTypes.func.isRequired,
  throttleEnabled: PropTypes.bool,
  throttleRate: PropTypes.number,
  updateStatus: UpdateStatusTypes,
  updateInfo: PropTypes.any
};

const mapStateToProps = (state) => {
  const proxy = getProxyState(state);
  const update = getUpdateStatus(state);

  return {
    cachingEnabled: proxy.cachingEnabled,
    throttleEnabled: proxy.throttleEnabled,
    throttleRate: proxy.throttleRate,
    requestData: getRequestData(state),
    proxyStatus: proxy.status,
    proxyReason: proxy.statusReason,
    updateStatus: update.status,
    updateInfo: update.info
  };
};

const mapDispatchToProps = {
  toggleCaching,
  toggleThrottle,
  setThrottleRate,
  clearRequests
};

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
