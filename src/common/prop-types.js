import PropTypes from 'prop-types';

import constants from './constants.js';

export const ProxyStatus = PropTypes.oneOf([
  constants.PROXY_STATUS_STARTING,
  constants.PROXY_STATUS_WORKING,
  constants.PROXY_STATUS_NO_HTTPS,
  constants.PROXY_STATUS_ERROR_ADDRESS_IN_USE,
  constants.PROXY_STATUS_ERROR_GENERIC
]);

export const UpdateStatus = PropTypes.oneOf([
  constants.UPDATE_OK,
  constants.UPDATE_CHECKING,
  constants.UPDATE_AVAILABLE,
  constants.UPDATE_DOWNLOADING,
  constants.UPDATE_READY,
  constants.UPDATE_ERROR
]);
