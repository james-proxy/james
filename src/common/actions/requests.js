export const SET_REQUEST_FILTER = 'SET_REQUEST_FILTER';
export const SET_ACTIVE_REQUEST = 'SET_ACTIVE_REQUEST';
export const SET_CONTEXT_REQUEST = 'SET_CONTEXT_REQUEST';
export const ADD_REQUEST = 'ADD_REQUEST';
export const COMPLETE_REQUEST = 'COMPLETE_REQUEST';

export function setRequestFilter(filter = '') {
  return {
    type: SET_REQUEST_FILTER,
    filter
  };
}

export function setActiveRequest(requestId = null) {
  return {
    type: SET_ACTIVE_REQUEST,
    requestId
  };
}

export function setContextRequest(requestId = null) {
  return {
    type: SET_CONTEXT_REQUEST,
    requestId
  };
}

export function addRequest({requestContainer}) {
  return {
    type: ADD_REQUEST,
    requestContainer
  };
}

export function completeRequest({requestContainer}) {
  return {
    type: COMPLETE_REQUEST,
    requestContainer
  };
}
