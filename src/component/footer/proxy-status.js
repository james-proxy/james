import React from 'react';

const {string, oneOf} = React.PropTypes;

const ProxyStatus = ({proxyStatus, proxyMessage}) => {
  const icon = proxyStatus !== 'failed' ? 'fa fa-circle' : 'fa fa-circle-o';
  const label = proxyMessage ? proxyMessage : 'Proxy: ' + proxyStatus;
  const classes = ['proxy-status'];
  classes.push(proxyStatus);

  return <div className={classes.join(' ')} title={label}>
    <i className={icon} />
    {label}
  </div>;
};

ProxyStatus.propTypes = {
  state: oneOf(['working', 'partial', 'failed']),
  message: string
};

export default ProxyStatus;
