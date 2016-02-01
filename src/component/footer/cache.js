import React from 'react';

const {func} = React.PropTypes;

const CacheButton = ({isCachingEnabled, toggleCaching}) => {
  const enabled = isCachingEnabled();
  const icon = enabled ? 'fa fa-circle' : 'fa fa-circle-o';
  const label = enabled ? 'Caching enabled' : 'Caching disabled';

  return <button title="Toggle caching" onClick={toggleCaching}>
    <i className={icon} />
    {label}
  </button>;
};

CacheButton.propTypes = {
  isCachingEnabled: func.isRequired,
  toggleCaching: func.isRequired
};

export default CacheButton;
