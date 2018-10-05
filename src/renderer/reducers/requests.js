import { combineReducers } from 'redux';
import { createSelector } from 'reselect';

import config from '../../common/config.js';
import * as actions from '../../common/actions/requests.js';
import * as proxyActions from '../../common/actions/proxy.js';

const initialState = {
  filter: null,
  activeRequestId: null,
  contextRequestId: null,
  data: []
};

// reducers

function filter(state = initialState.filter, action) {
  if (action.type !== actions.SET_REQUEST_FILTER) {
    return state;
  }
  return action.filter || initialState.filter;
}

function activeRequestId(state = initialState.activeRequestId, action) {
  if (action.type !== actions.SET_ACTIVE_REQUEST) {
    return state;
  }
  return action.requestId;
}

function contextRequestId(state = initialState.contextRequestId, action) {
  if (action.type !== actions.SET_CONTEXT_REQUEST) {
    return state;
  }
  return action.requestId;
}

function data(state = initialState.data, action) {
  switch (action.type) {
  case actions.ADD_REQUEST:
    return [action.requestContainer].concat(state)
      .slice(0, config.maxLogEntries);
  case actions.COMPLETE_REQUEST:
    return state.map(existingContainer => {
      if (existingContainer.id !== action.requestContainer.id) {
        return existingContainer;
      }
      return action.requestContainer;
    });
  case proxyActions.CLEAR_REQUESTS:
    return [];
  default:
    return state;
  }
}

export default combineReducers({
  filter,
  activeRequestId,
  contextRequestId,
  data
});

// selectors

export function hasRequests(state) {
  return state.requests.data.length > 0;
}

export function getRequestFilter(state) {
  return state.requests.filter;
}

export function getActiveRequest(state) {
  return state.requests.data.find(requestContainer => requestContainer.id === state.requests.activeRequestId);
}

export function getContextRequest(state) {
  return state.requests.data.find(requestContainer => requestContainer.id === state.requests.contextRequestId);
}

export const getVisibleRequests = createSelector(
  [getRequestFilter, state => state.requests.data],
  (requestFilter, requests) => {
    const matchesFilter = (request) =>
      request.fullUrl.includes(requestFilter) || request.original.fullUrl.includes(requestFilter);

    return !requestFilter
      ? requests
      : requests.filter(({request}) => matchesFilter(request));
  });

export function getTotalRequestCount(state) {
  return state.requests.data.length;
}

export function getFilteredRequestCount(state) {
  return getVisibleRequests(state).length;
}
