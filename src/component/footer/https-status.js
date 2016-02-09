import React from 'react';

const {string, oneOf} = React.PropTypes;

const HttpsStatus = ({state, message}) => {
  const icon = state !== 'failed' ? 'fa fa-circle' : 'fa fa-circle-o';
  const label = message ? message : 'Https: ' + state;
  const classes = ['https-status'];
  classes.push(state);

  return <div className={classes.join(' ')} title={label}>
    <i className={icon} />
    {label}
  </div>;
};

HttpsStatus.propTypes = {
  state: oneOf(['working', 'partial', 'failed']),
  message: string
};

export default HttpsStatus;
