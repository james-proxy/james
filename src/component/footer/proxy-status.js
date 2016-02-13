import React from 'react';

const {string, oneOf, func} = React.PropTypes;
const iconMap = {
  'working': 'fa-check',
  'partial': 'fa-check',
  'offline': 'fa-exclamation-triangle'
};

const ProxyStatus = ({proxyStatus, proxyMessage, proxyWindow}) => {
  const icon = 'fa ' + iconMap[proxyStatus];
  const label = 'Proxy: ' + (proxyMessage ? proxyMessage : proxyStatus);
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
  proxyStatus: oneOf(['working', 'partial', 'offline']).isRequired,
  proxyWindow: func,
  proxyMessage: string
};

export default ProxyStatus;
