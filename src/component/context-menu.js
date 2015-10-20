import React from 'react';

const {array} = React.PropTypes;

export default class ContextMenu extends React.Component {

  render() {
    const contextItems = this.props.items.map((item, index) => {
      return <li className="context-menu-item" key={index} onClick={item.onClick}>
        <i className={'fa ' + item.icon}></i><span className="title">{item.title}</span>
      </li>;
    });

    return <ul className="context-menu">
      {contextItems}
    </ul>;
  }
}

ContextMenu.propTypes = {
  items: array.isRequired
};
