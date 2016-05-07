import DevTools from '../service/dev-tools.js';
import constants from '../constants.js';

import { detectBrowsers } from './browsers.js';

const devTools = new DevTools();

export const TOGGLE_DEVTOOLS = 'TOGGLE_DEVTOOLS';
export const RENDER = 'RENDER';

export function init() {
  return (dispatch) => {
    dispatch(detectBrowsers());

    if (constants.DEV) {
      dispatch(toggleDevTools());
    }
  };
}

export function render() {
  return {
    type: RENDER
  };
}

export function toggleDevTools() {
  return () => {
    devTools.toggle();
  };
}
