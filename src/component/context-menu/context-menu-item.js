import React from 'react';

const {func, string} = React.PropTypes;

const ContextMenuItem = (props) => {
  const {onClick, icon, title} = props;

  return <li className="context-menu-item" onClick={onClick}>
    <i className={`fa ${icon}`} />
    <span className="title">{title}</span>
  </li>;
};

ContextMenuItem.propTypes = {
  onClick: func.isRequired,
  icon: string.isRequired,
  title: string.isRequired
};

export default ContextMenuItem;
