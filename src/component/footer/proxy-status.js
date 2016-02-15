import React from 'react';
import constants from '../../constants.js';

const {string, oneOf, func} = React.PropTypes;
const iconMap = {
  [constants.PROXY_STATUS_WORKING]: 'fa-check',
  [constants.PROXY_STATUS_NO_HTTPS]: 'fa-check',
  [constants.PROXY_STATUS_ERROR_ADDRESS_IN_USE]: 'fa-exclamation-triangle',
  [constants.PROXY_STATUS_ERROR_GENERIC]: 'fa-exclamation-triangle'
};

const labelMap = {
  [constants.PROXY_STATUS_WORKING]: 'Online',
  [constants.PROXY_STATUS_NO_HTTPS]: 'HTTPs disabled',
  [constants.PROXY_STATUS_ERROR_ADDRESS_IN_USE]: 'Address already in use',
  [constants.PROXY_STATUS_ERROR_GENERIC]: 'Error'
};

const getLabel = (label) => {
  if (!labelMap[label]) {
    return label;
  }
  return labelMap[label];
};

const ProxyStatus = ({proxyStatus, proxyWindow}) => {
  const icon = 'fa ' + iconMap[proxyStatus];
  const label = 'Proxy: ' + getLabel(proxyStatus);
  const classes = ['proxy-status', proxyStatus];

  if (proxyWindow) {
    classes.push('with-info');
  }

  return <div className={classes.join(' ')} title={label} onClick={proxyWindow}>
    <i className={icon} />
    {label}
  </div>;
};

ProxyStatus.propTypes = {
  proxyStatus: oneOf(Object.keys(constants).map(key => constants[key])).isRequired,
  proxyWindow: func,
  proxyMessage: string
};

export default ProxyStatus;
