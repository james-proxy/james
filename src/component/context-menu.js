import React from 'react';

const {array} = React.PropTypes;

const ContextMenu = (props) => {
  const {items} = props;

  const contextItems = items.map((item, index) => {
    return <li className="context-menu-item" key={index} onClick={item.onClick}>
      <i className={'fa ' + item.icon}></i><span className="title">{item.title}</span>
    </li>;
  });

  return <ul className="context-menu">
    {contextItems}
  </ul>;
};

ContextMenu.propTypes = {
  items: array.isRequired
};

export default ContextMenu;
