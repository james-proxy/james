import React from 'react';
import CacheButton from './cache.js';
import Throttle from './throttle.js';
import RequestCount from './request-count.js';
import ProxyStatus from './proxy-status.js';

const {func, object} = React.PropTypes;

const Footer = (props) => {
  return <div className="footer">
    <CacheButton {...props} />
    <Throttle {...props} />
    <RequestCount {...props} />
    <ProxyStatus {...props} />
  </div>;
};

Footer.propTypes = {
  toggleCaching: func.isRequired,
  isCachingEnabled: func.isRequired,
  clearRequests: func.isRequired,
  requestData: object.isRequired
};

export default Footer;
