import React from 'react';
import constants from '../../constants.js';

const {string, oneOf, func} = React.PropTypes;
const iconMap = {
  [constants.PROXY_STATUS_WORKING]: 'fa-check',
  [constants.PROXY_STATUS_NO_HTTPS]: 'fa-check',
  [constants.PROXY_STATUS_ERROR_ADDRESS_IN_USE]: 'fa-exclamation-triangle',
  [constants.PROXY_STATUS_ERROR_GENERIC]: 'fa-exclamation-triangle'
};

const messageMap = {
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

const ProxyStatus = ({proxyStatus}) => {
  const icon = 'fa ' + iconMap[proxyStatus];
  const message = 'Proxy: ' + getMessage(proxyStatus);
  const classes = ['proxy-status', proxyStatus];

  return <div className={classes.join(' ')} title={message}>
    <i className={icon} />
    <span className="message">{message}</span>
  </div>;
};

ProxyStatus.propTypes = {
  proxyStatus: oneOf([
    constants.PROXY_STATUS_WORKING,
    constants.PROXY_STATUS_NO_HTTPS,
    constants.PROXY_STATUS_ERROR_ADDRESS_IN_USE,
    constants.PROXY_STATUS_ERROR_GENERIC
  ]).isRequired,
  proxyMessage: string
};

export default ProxyStatus;
