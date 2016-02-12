import React from 'react';

const {array} = React.PropTypes;

const Toolbar = (props) => {
  const {actions} = props;

  const actionNodes = actions.map((action, index) => {
    const {description, icon, onClick} = action;
    return <div className="toolbar-action primary" key={index} onClick={onClick}>
      <i className={`action fa ${icon}`} />
      <span className="description">{description}</span>
    </div>;
  });

  return <div className="toolbar">
    {actionNodes}
  </div>;
};

Toolbar.propTypes = {
  actions: array
};

export default Toolbar;
