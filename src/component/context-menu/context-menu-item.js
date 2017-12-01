import React from 'react';
import PropTypes from 'prop-types';

const ContextMenuItem = (props) => {
  const {onClick, icon, title} = props;

  return <li className="context-menu-item" onClick={onClick}>
    <i className={`fa ${icon}`} />
    <span className="title">{title}</span>
  </li>;
};

ContextMenuItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
};

export default ContextMenuItem;
