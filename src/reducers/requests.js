import { combineReducers } from 'redux';
import constants from '../constants.js';
import * as actions from '../actions/requests.js';

const initialState = {
  filter: null,
  active: null,
  context: null,
  tab: constants.REQUEST_DETAILS_TAB_HEADERS,
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

function tab(state = initialState.tab, action) {
  if (action.type === actions.SET_ACTIVE_DETAILS_TAB) {
    return action.tab;
  }
  // when changing requests, reset back to initial tab
  if (action.type === actions.SET_ACTIVE_REQUEST) {
    return initialState.tab;
  }
  return state;
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
  tab,
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

export function getActiveDetailsTab(state) {
  return state.requests.tab;
}

export function getRequestData(state) {
  return state.requests.data;
}
