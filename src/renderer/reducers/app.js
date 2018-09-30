import { combineReducers } from 'redux';

import constants from '../../common/constants.js';
import * as actions from '../../common/actions/app.js';

const initialState = {
  config: {},
  updates: {
    status: constants.UPDATE_OK
  }
};

// reducers

function config(state = initialState.config, action) {
  if (action.type !== actions.INIT) {
    return state;
  }
  return action.config || state;
}

function updates(state = initialState.updates, action) {
  if (action.type !== actions.SET_UPDATER_STATUS) {
    return state;
  }
  return {
    status: action.status,
    info: action.info
  };
}

export default combineReducers({
  config,
  updates
});

// selectors

export function getProxyPort(state) {
  return state.app.config.proxyPort;
}

export function getLabels(state) {
  return state.app.config.labels;
}

export function getUpdateStatus(state) {
  return state.app.updates;
}
