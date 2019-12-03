import React from 'react';
import PropTypes from 'prop-types';

const UrlMapping = (props) => {
  const {
    mapping,
    toggleActive,
    remove,
    edit
  } = props;

  const toggleIsActive = () => {
    toggleActive(mapping.url);
  };

  const removeMapping = () => {
    remove(mapping.url);
  };

  const editMapping = () => {
    edit(mapping.url);
  };

  /* eslint-disable react/no-multi-comp */
  const newUrlContent = (newUrl) => {
    if (!newUrl) return null;
    return [
      <span className="seperator">
        <i className="fa fa-chevron-right" />
      </span>,
      <span className="col text-ellipsis new-url">
        {newUrl}
      </span>
    ];
  };

  /* eslint-disable react/no-multi-comp */
  const editContent = (isMerge) => {
    if (!isMerge) return null;
    return <a className="secondary-content" onClick={editMapping}>
      <i className="fa fa-edit" />
    </a>;
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
      {newUrlContent(mapping.newUrl)}
      <a className="secondary-content" onClick={toggleIsActive}>
        <i className={'fa fa-toggle-' + isActiveClass} />
      </a>
      <a className="secondary-content" onClick={removeMapping}>
        <i className="fa fa-remove" />
      </a>
      {editContent(mapping.isMerge)}
    </div>
  </li>;
};

UrlMapping.propTypes = {
  mapping: PropTypes.object.isRequired,
  toggleActive: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
  edit: PropTypes.func.isRequired
};

export default UrlMapping;
