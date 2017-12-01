import React from 'react';
import PropTypes from 'prop-types';

import ContextMenuItem from './context-menu-item.js';

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
  items: PropTypes.array.isRequired
};

export default ContextMenu;
