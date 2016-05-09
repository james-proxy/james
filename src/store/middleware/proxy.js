import * as actions from '../../actions/proxy.js';
import {SYNC_REQUESTS} from '../../actions/requests.js';

const middleware = proxy => store => next => action => {
  if (action.type === SYNC_REQUESTS) {
    const {requests: state} = store.getState();
    action.data = proxy.getRequestData(state.filter);
    return next(action);
  }

  // let the reducers decide the state, then apply it to the proxy
  const result = next(action);
  const { proxy: state } = store.getState();

  switch (action.type) {
    case actions.TOGGLE_CACHING:
      proxy._isCachingEnabled = state.cachingEnabled
      break;

    case actions.TOGGLE_THROTTLING:
      if(state.throttleEnabled) {
        proxy.slow(state.throttleRate);
      } else {
        proxy.disableThrottling();
      }
      break;

    case actions.SET_THROTTLE_RATE:
      if (state.throttleEnabled) {
        proxy.slow(state.throttleRate);
      }
      break;

    case actions.CLEAR_REQUESTS:
      proxy.clear();
      break;
  }

  return result;
};

export default middleware;
