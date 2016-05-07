import React from 'react';
import { connect } from 'react-redux';

import {
  showAddUrlMapping,
  toggleUrlMapping,
  removeUrlMapping
} from '../../actions/url-mappings.js';

import ContextMenu from '../context-menu/context-menu.js';

const {object, func} = React.PropTypes;

const RequestContextMenu = (props) => {
  const {
    request,
    handleContextMenu,
    showAddMapping,
    toggleMapping,
    removeMapping
  } = props;
  const fullUrl = request.original.fullUrl;

  const handleMenuClick = (fn) => (event) => {
    event.preventDefault();
    handleContextMenu();
    fn();
  };

  const contextMenuItems = [{
    title: 'Add mapping',
    icon: 'fa-plus',
    onClick: handleMenuClick(() => {
      showAddMapping(fullUrl);
    })
  }];

  if (request.isMappedUrl) {
    contextMenuItems.push({
      title: 'Remove mapping',
      icon: 'fa-trash-o',
      onClick: handleMenuClick(() => {
        removeMapping(fullUrl);
      })
    }, {
      title: 'Activate/Deactivate',
      icon: 'fa-toggle-on',
      onClick: handleMenuClick(() => {
        toggleMapping(fullUrl);
      })
    });
  }

  return <ContextMenu items={contextMenuItems} />;
};

RequestContextMenu.propTypes = {
  request: object.isRequired,
  handleContextMenu: func.isRequired,
  showAddMapping: func.isRequired,
  toggleMapping: func.isRequired,
  removeMapping: func.isRequired
};

const mapDispatchToProps = (dispatch) => ({
  showAddMapping: (url) => { dispatch(showAddUrlMapping(url)); },
  toggleMapping: (url) => { dispatch(toggleUrlMapping(url)); },
  removeMapping: (url) => { dispatch(removeUrlMapping(url)); }
});

export default connect(null, mapDispatchToProps)(RequestContextMenu);
