import React from 'react';

const {func} = React.PropTypes;

const CacheButton = ({isCachingEnabled, toggleCaching}) => {
  const enabled = isCachingEnabled();
  const icon = enabled ? 'fa fa-circle' : 'fa fa-circle-o';
  const message = enabled ? 'Caching enabled' : 'Caching disabled';

  return <div className="cache-button">
    <button title="Toggle caching" onClick={toggleCaching}>
      <i className={icon} />
      <span className="message">{message}</span>
    </button>
  </div>;
};

CacheButton.propTypes = {
  isCachingEnabled: func.isRequired,
  toggleCaching: func.isRequired
};

export default CacheButton;
