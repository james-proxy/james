import React from 'react';
import ContextMenu from '../context-menu/context-menu.js';

const {object, func} = React.PropTypes;

const RequestContextMenu = (props) => {
  const {
    request,
    showWindow,
    handleContextMenu,
    removeUrlMapping,
    toggleUrlMappingActiveState
  } = props;

  const handleMenuClick = (fn) => (event) => {
    event.preventDefault();
    handleContextMenu();
    fn();
  };

  const contextMenuItems = [{
    title: 'Add mapping',
    icon: 'fa-plus',
    onClick: handleMenuClick(() => {
      showWindow('UrlMapping', {urlInput: request.originalUrl});
    })
  }];

  if (request.isMappedUrl) {
    contextMenuItems.push({
      title: 'Remove mapping',
      icon: 'fa-trash-o',
      onClick: handleMenuClick(() => {
        removeUrlMapping(request.originalUrl);
      })
    }, {
      title: 'Activate/Deactivate',
      icon: 'fa-toggle-on',
      onClick: handleMenuClick(() => {
        toggleUrlMappingActiveState(request.originalUrl);
      })
    });
  }

  return <ContextMenu items={contextMenuItems} />;
};

RequestContextMenu.propTypes = {
  request: object.isRequired,
  showWindow: func.isRequired,
  handleContextMenu: func.isRequired,
  removeUrlMapping: func.isRequired,
  toggleUrlMappingActiveState: func.isRequired
};

export default RequestContextMenu;
