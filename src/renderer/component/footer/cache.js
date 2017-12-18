import React from 'react';
import PropTypes from 'prop-types';

const CacheButton = ({cachingEnabled, toggleCaching}) => {
  const icon = cachingEnabled ? 'fa fa-circle' : 'fa fa-circle-o';
  const message = cachingEnabled ? 'Caching enabled' : 'Caching disabled';

  return <div className="cache-button">
    <button title="Toggle caching" onClick={toggleCaching}>
      <i className={icon} />
      <span className="message">{message}</span>
    </button>
  </div>;
};

CacheButton.propTypes = {
  cachingEnabled: PropTypes.bool.isRequired,
  toggleCaching: PropTypes.func.isRequired
};

export default CacheButton;
