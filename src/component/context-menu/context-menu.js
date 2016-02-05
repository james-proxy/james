import React from 'react';
import ContextMenuItem from './context-menu-item.js';

const {array} = React.PropTypes;

const ContextMenu = (props) => {
  const {items} = props;

  const contextItems = items.map((item, index) =>
    <ContextMenuItem key={index} {...item} />
  );

  return <ul className="context-menu">
    {contextItems}
  </ul>;
};

ContextMenu.propTypes = {
  items: array.isRequired
};

export default ContextMenu;
