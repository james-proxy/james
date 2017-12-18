import React from 'react';
import PropTypes from 'prop-types';

import constants from 'common/constants.js';

const iconMap = {
  [constants.PROXY_STATUS_STARTING]: 'fa-hourglass-half',
  [constants.PROXY_STATUS_WORKING]: 'fa-check',
  [constants.PROXY_STATUS_NO_HTTPS]: 'fa-check',
  [constants.PROXY_STATUS_ERROR_ADDRESS_IN_USE]: 'fa-exclamation-triangle',
  [constants.PROXY_STATUS_ERROR_GENERIC]: 'fa-exclamation-triangle'
};

const messageMap = {
  [constants.PROXY_STATUS_STARTING]: 'Starting...',
  [constants.PROXY_STATUS_WORKING]: 'Online',
  [constants.PROXY_STATUS_NO_HTTPS]: 'HTTPS disabled',
  [constants.PROXY_STATUS_ERROR_ADDRESS_IN_USE]: 'Address already in use',
  [constants.PROXY_STATUS_ERROR_GENERIC]: 'Error'
};

const getMessage = (status) => {
  if (!messageMap[status]) {
    return label;
  }
  return messageMap[status];
};

const ProxyStatus = ({proxyStatus, proxyReason}) => {
  const icon = 'fa ' + iconMap[proxyStatus];
  const message = 'Proxy: ' + getMessage(proxyStatus);
  const title = proxyReason;
  const classes = ['proxy-status', proxyStatus];

  return <div className={classes.join(' ')} title={title}>
    <i className={icon} />
    <span className="message">{message}</span>
  </div>;
};

ProxyStatus.propTypes = {
  proxyStatus: PropTypes.oneOf([
    constants.PROXY_STATUS_STARTING,
    constants.PROXY_STATUS_WORKING,
    constants.PROXY_STATUS_NO_HTTPS,
    constants.PROXY_STATUS_ERROR_ADDRESS_IN_USE,
    constants.PROXY_STATUS_ERROR_GENERIC
  ]).isRequired,
  proxyReason: PropTypes.string,
  proxyMessage: PropTypes.string
};

export default ProxyStatus;
