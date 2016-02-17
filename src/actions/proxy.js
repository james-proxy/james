import constants from '../constants.js';

export const TOGGLE_CACHING = 'TOGGLE_CACHING';
export const TOGGLE_THROTTLING = 'TOGGLE_THROTTLING';
export const SET_THROTTLE_RATE = 'SET_THROTTLE_RATE';
export const UPDATE_PROXY_STATUS = 'UPDATE_PROXY_STATUS';

export function toggleCaching() {
  return {
    type: TOGGLE_CACHING
  };
}

export function toggleThrottling() {
  return {
    type: TOGGLE_THROTTLING
  };
}

export function setThrottleRate(rate = 0) {
  return {
    type: SET_THROTTLE_RATE,
    rate
  };
}

export function updateProxyStatus(status = constants.PROXY_STATUS_WORKING) {
  return {
    type: UPDATE_PROXY_STATUS,
    status
  };
}
