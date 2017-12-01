import React from 'react';
import PropTypes from 'prop-types';

const UrlMapping = (props) => {
  const {
    mapping,
    toggleActive,
    remove
  } = props;

  const toggleIsActive = () => {
    toggleActive(mapping.url);
  };

  const removeMapping = () => {
    remove(mapping.url);
  };

  const isActiveClass = mapping.isActive ? 'on' : 'off';

  return <li className="collection-item">
    <div>
      <span className="col protocol">
        http(s)://
      </span>
      <span className="col text-ellipsis mask">
        {mapping.url}
      </span>
      <span className="seperator">
        <i className="fa fa-chevron-right" />
      </span>
      <span className="col text-ellipsis new-url">
        {mapping.newUrl}
      </span>
      <a className="secondary-content" onClick={toggleIsActive}>
        <i className={'fa fa-toggle-' + isActiveClass} />
      </a>
      <a className="secondary-content" onClick={removeMapping}>
        <i className="fa fa-remove" />
      </a>
    </div>
  </li>;
};

UrlMapping.propTypes = {
  mapping: PropTypes.object.isRequired,
  toggleActive: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired
};

export default UrlMapping;
