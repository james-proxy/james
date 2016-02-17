import * as actions from '../actions/proxy.js';
import constants from '../constants.js';

const initialState = {
  status: constants.PROXY_STATUS_WORKING,
  cachingEnabled: false,
  throttleEnabled: false,
  throttleRate: 0
};

export default function proxy(state = initialState, action) {
  switch (action.type) {
  case actions.TOGGLE_CACHING:
    return Object.assign({}, state, {
      cachingEnabled: !state.cachingEnabled
    });

  case actions.TOGGLE_THROTTLING:
    return Object.assign({}, state, {
      throttleEnabled: !state.throttleEnabled
    });

  case actions.SET_THROTTLE_RATE:
    return Object.assign({}, state, {
      throttleRate: action.rate
    });

  case actions.UPDATE_PROXY_STATUS:
    return Object.assign({}, state, {
      status: action.status
    });

  default:
    return state;
  }
}
