export const SET_REQUEST_FILTER = 'SET_REQUEST_FILTER';
export const SET_ACTIVE_REQUEST = 'SET_ACTIVE_REQUEST';
export const SET_CONTEXT_REQUEST = 'SET_CONTEXT_REQUEST';
export const SYNC_REQUESTS = 'SYNC_REQUESTS';

export function setRequestFilter(filter = '') {
  return {
    type: SET_REQUEST_FILTER,
    filter
  };
}

export function setActiveRequest(request = null) {
  return {
    type: SET_ACTIVE_REQUEST,
    request
  };
}

export function setContextRequest(request = null) {
  return {
    type: SET_CONTEXT_REQUEST,
    request
  };
}

export function syncRequests({requestData}) {
  return {
    type: SYNC_REQUESTS,
    requestData
  };
}
