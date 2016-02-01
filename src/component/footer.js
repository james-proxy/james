import React from 'react';
import {CacheButton} from './footer/cache';
import Throttle from './footer/throttle';
import {RequestCount} from './footer/requestCount';

const {func, object} = React.PropTypes;

export const Footer = (props) => {
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
