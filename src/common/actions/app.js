import { push } from 'react-router-redux';

import DevTools from 'common/service/dev-tools.js';
import constants from 'common/constants.js';

const devTools = new DevTools();

export const INIT = 'INIT';
export const TOGGLE_DEVTOOLS = 'TOGGLE_DEVTOOLS';
export const SET_UPDATER_STATUS = 'SET_UPDATER_STATUS';

export function init(data) {
  return (dispatch) => {
    dispatch({
      type: INIT,
      ...data
    });

    dispatch(navigateToHome());

    if (constants.DEV) {
      dispatch(toggleDevTools());
    }
  };
}

export function toggleDevTools() {
  return (dispatch) => {
    dispatch({type: TOGGLE_DEVTOOLS});
    devTools.toggle();
  };
}

export function setUpdaterStatus({status, info}) {
  return {
    type: SET_UPDATER_STATUS,
    status,
    info
  };
}

export function navigateToHome() {
  return push('/');
}

export function navigateToRequests() {
  return push('/requests');
}

export function navigateToUrlMappings() {
  return push('/url-mappings');
}
