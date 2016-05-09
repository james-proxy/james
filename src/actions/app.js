import { push } from 'react-router-redux';
import DevTools from '../service/dev-tools.js';
import constants from '../constants.js';

import { detectBrowsers } from './browsers.js';

const devTools = new DevTools();

export const INIT = 'INIT';
export const TOGGLE_DEVTOOLS = 'TOGGLE_DEVTOOLS';

export function init(data) {
  return (dispatch) => {
    dispatch({
      type: INIT,
      ...data
    });
    dispatch(push('/'));
    dispatch(detectBrowsers());

    if (constants.DEV) {
      dispatch(toggleDevTools());
    }
  };
}

export function toggleDevTools() {
  return () => {
    devTools.toggle();
  };
}
