import React from 'react';
import CacheButton from './footer/cache';
import Throttle from './footer/throttle';
import RequestCount from './footer/request-count';
import HttpsStatus from './footer/https-status';

const {func, object} = React.PropTypes;

const Footer = (props) => {
  const {
    toggleCaching,
    isCachingEnabled,
    clearRequests,
    requestData,
    ...other
  } = props;

  return <div className="footer">
    <CacheButton isCachingEnabled={isCachingEnabled} toggleCaching={toggleCaching} />
    <Throttle {...other} />
    <RequestCount requestData={requestData} clearRequests={clearRequests} />
    <HttpsStatus enabled={true} />
  </div>;
};

Footer.propTypes = {
  toggleCaching: func.isRequired,
  isCachingEnabled: func.isRequired,
  clearRequests: func.isRequired,
  requestData: object.isRequired
};

export default Footer;
