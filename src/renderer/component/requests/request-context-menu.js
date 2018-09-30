import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ContextMenu from '../context-menu/context-menu.js';

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
  request: PropTypes.object.isRequired,
  handleContextMenu: PropTypes.func.isRequired,
  showAddMapping: PropTypes.func.isRequired,
  toggleMapping: PropTypes.func.isRequired,
  removeMapping: PropTypes.func.isRequired
};

import {
  showAddUrlMapping,
  toggleUrlMapping,
  removeUrlMapping
} from '../../../common/actions/url-mappings.js';

const mapDispatchToProps = {
  showAddMapping: showAddUrlMapping,
  toggleMapping: toggleUrlMapping,
  removeMapping: removeUrlMapping
};

export default connect(null, mapDispatchToProps)(RequestContextMenu);
