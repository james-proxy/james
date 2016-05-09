import { push } from 'react-router-redux';

export const ADD_URL_MAPPING = 'ADD_URL_MAPPING';
export const UPDATE_URL_MAPPING = 'UPDATE_URL_MAPPING';
export const REMOVE_URL_MAPPING = 'REMOVE_URL_MAPPING';
export const TOGGLE_URL_MAPPING = 'TOGGLE_URL_MAPPING';
export const SYNC_URL_MAPPINGS = 'SYNC_URL_MAPPINGS';

export function showAddUrlMapping(url) {
  return (dispatch) => {
    dispatch(push({
      pathname: '/url-mappings',
      state: {
        url
      }
    }));
  };
}
export function setUrlMapping(url, newUrl, isLocal = false, isActive: true) {
  return {
    type: ADD_URL_MAPPING,
    mapping: {
      url,
      newUrl,
      isLocal,
      isActive
    }
  };
}

export function removeUrlMapping(url) {
  return {
    type: REMOVE_URL_MAPPING,
    mapping: {
      url
    }
  };
}

export function toggleUrlMapping(url) {
  return {
    type: TOGGLE_URL_MAPPING,
    mapping: {
      url
    }
  };
}

export function syncUrlMappings(mappings = []) {
  return {
    type: SYNC_URL_MAPPINGS,
    mappings
  };
}
