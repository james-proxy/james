import React from 'react';
import PropTypes from 'prop-types';

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
  actions: PropTypes.array
};

export default Toolbar;
