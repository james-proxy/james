import React from 'react';

const {bool} = React.PropTypes;

const HttpsStatus = ({enabled}) => {
  const icon = enabled ? 'fa fa-circle' : 'fa fa-circle-o';
  const label = enabled ? 'Https working' : 'Https failed';

  return <div className='https-status succeeded' title={label}>
    <i className={icon} />
    {label}
  </div>;
};

HttpsStatus.propTypes = {
  enabled: bool.isRequired
};

export default HttpsStatus;
