import { combineReducers } from 'redux';

import * as actions from '../actions/proxy.js';
import constants from '../constants.js';

const initialState = {
  status: constants.PROXY_STATUS_STARTING,
  statusReason: null,
  cachingEnabled: false,
  throttleEnabled: false,
  throttleRate: 0
};

function status(state = initialState.status, action) {
  if (action.type !== actions.UPDATE_PROXY_STATUS) {
    return state;
  }
  return action.status || state;
}

function statusReason(state = initialState.statusReason, action) {
  if (action.type !== actions.UPDATE_PROXY_STATUS) {
    return state;
  }
  return action.reason || state;
}

function cachingEnabled(state = initialState.cachingEnabled, action) {
  if (action.type !== actions.TOGGLE_CACHING) {
    return state;
  }
  return !state;
}

function throttleEnabled(state = initialState.throttleEnabled, action) {
  if (action.type !== actions.TOGGLE_THROTTLING) {
    return state;
  }
  return !state;
}

function throttleRate(state = initialState.throttleRate, action) {
  if (action.type !== actions.SET_THROTTLE_RATE) {
    return state;
  }
  return action.rate || state;
}

export default combineReducers({
  status,
  statusReason,
  cachingEnabled,
  throttleEnabled,
  throttleRate
});

export function getProxyState(state) {
  return state.proxy;
}
