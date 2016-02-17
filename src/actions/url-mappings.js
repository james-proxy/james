export const ADD_URL_MAPPING = 'ADD_URL_MAPPING';
export const UPDATE_URL_MAPPING = 'UPDATE_URL_MAPPING';
export const REMOVE_URL_MAPPING = 'REMOVE_URL_MAPPING';
export const TOGGLE_URL_MAPPING = 'TOGGLE_URL_MAPPING';

export function addUrlMapping(url, newUrl, isLocal = false) {
  return {
    type: ADD_URL_MAPPING,
    url,
    newUrl,
    isLocal
  };
}

export function updateUrlMapping(url, newUrl, isLocal = false, isActive = true) {
  return {
    type: UPDATE_URL_MAPPING,
    url,
    newUrl,
    isLocal,
    isActive
  }
}

export function removeUrlMapping(id) {
  return {
    type: REMOVE_URL_MAPPING,
    id
  };
}

export function toggleUrlMapping(id) {
  return {
    type: TOGGLE_URL_MAPPING,
    id
  };
}
