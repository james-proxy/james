export default {
  'DEV': process.env.NODE_ENV !== 'production',

  'UPDATE_OK': 'ok',
  'UPDATE_CHECKING': 'checking',
  'UPDATE_AVAILABLE': 'available',
  'UPDATE_DOWNLOADING': 'downloading',
  'UPDATE_READY': 'ready',
  'UPDATE_ERROR': 'error',
  
  'PROXY_STATUS_STARTING': 'starting',
  'PROXY_STATUS_WORKING': 'working',
  'PROXY_STATUS_NO_HTTPS': 'no_https',
  'PROXY_STATUS_ERROR_GENERIC': 'generic_error',
  'PROXY_STATUS_ERROR_ADDRESS_IN_USE': 'error_address_in_use',

  'NEW_MAPPING_STEP_TARGET': 'target',
  'NEW_MAPPING_STEP_DESTINATION': 'destination'
};
