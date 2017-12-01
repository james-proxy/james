import { combineReducers } from 'redux';

import * as actions from 'common/actions/app.js';

const initialState = {
  config: {}
};

// reducers

function config(state = initialState.config, action) {
  if (action.type !== actions.INIT) {
    return state;
  }
  return action.config || state;
}

export default combineReducers({
  config
});

// selectors

export function getProxyPort(state) {
  return state.app.config.proxyPort;
}

export function getLabels(state) {
  return state.app.config.labels;
}
