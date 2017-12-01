import { combineReducers } from 'redux';

import * as actions from 'common/actions/requests.js';

const initialState = {
  filter: null,
  active: null,
  context: null,
  data: {
    requests: [],
    totalCount: 0,
    filteredCount: 0
  }
};

// reducers

function filter(state = initialState.filter, action) {
  if (action.type !== actions.SET_REQUEST_FILTER) {
    return state;
  }
  return action.filter || initialState.filter;
}

function active(state = initialState.active, action) {
  if (action.type !== actions.SET_ACTIVE_REQUEST) {
    return state;
  }
  if (state !== null && action.request !== null && state.id === action.request.id) {
    return initialState.active;
  }
  return action.request;
}

function context(state = initialState.context, action) {
  if (action.type !== actions.SET_CONTEXT_REQUEST) {
    return state;
  }
  if (state !== null && action.request !== null && state.id === action.request.id) {
    return initialState.context;
  }
  return action.request;
}

function data(state = initialState.data, action) {
  if (action.type !== actions.SYNC_REQUESTS) {
    return state;
  }
  return action.requestData;
}

export default combineReducers({
  filter,
  active,
  context,
  data
});

// selectors

export function hasRequests(state) {
  return state.requests.data.totalCount > 0;
}

export function getRequestFilter(state) {
  return state.requests.filter;
}

export function getActiveRequest(state) {
  return state.requests.active;
}

export function isActiveRequest(state, request) {
  const activeRequest = getActiveRequest(state);
  return activeRequest && request && activeRequest.id === request.id;
}

export function getContextRequest(state) {
  return state.requests.context;
}

export function isContextRequest(state, request) {
  const contextRequest = getContextRequest(state);
  return contextRequest && request && contextRequest.id === request.id;
}

export function getRequestData(state) {
  return state.requests.data;
}
