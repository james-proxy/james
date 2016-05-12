const {app} = require('electron').remote;

export default {
  'PROXY_STATUS_WORKING': 'working',
  'PROXY_STATUS_NO_HTTPS': 'no_https',
  'PROXY_STATUS_ERROR_GENERIC': 'generic_error',
  'PROXY_STATUS_ERROR_ADDRESS_IN_USE': 'error_address_in_use',
  'NEW_MAPPING_STEP_TARGET': 'target',
  'NEW_MAPPING_STEP_DESTINATION': 'destination',
  'DEV': process.env.NODE_ENV !== 'production',
  'VERSION': '0.0.0'//app.getVersion()
};
