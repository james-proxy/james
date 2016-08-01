import { ipcRenderer as ipc } from 'electron';

import * as actions from '../../actions/proxy.js';
import * as requestActions from '../../actions/requests.js';

const middleware = store => next => action => {
  // let the reducers decide the state, then apply it to the proxy
  const result = next(action);
  const { proxy: state, requests: requestState } = store.getState();

  switch (action.type) {
  case actions.TOGGLE_CACHING:
    ipc.send('proxy-cache-toggle', {enabled: state.cachingEnabled});
    break;

  case actions.TOGGLE_THROTTLING:
  case actions.SET_THROTTLE_RATE:
    ipc.send('proxy-throttle', {
      enabled: state.throttleEnabled,
      rate: state.throttleRate
    });
    break;

  case requestActions.SET_REQUEST_FILTER:
    ipc.send('proxy-filter', {
      filter: requestState.filter
    });
    break;

  case actions.CLEAR_REQUESTS:
    ipc.send('proxy-clear');
    break;

  default:
    return result;
  }

  return result;
};

export default middleware;
