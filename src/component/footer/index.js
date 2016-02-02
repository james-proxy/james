import React from 'react';
import CacheButton from './cache';
import Throttle from './throttle';
import RequestCount from './request-count';

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
  </div>;
};

Footer.propTypes = {
  toggleCaching: func.isRequired,
  isCachingEnabled: func.isRequired,
  clearRequests: func.isRequired,
  requestData: object.isRequired
};

export default Footer;
