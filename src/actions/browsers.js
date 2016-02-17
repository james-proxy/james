import browserLauncher from 'james-browser-launcher';

import constants from '../constants.js';
import openBrowser from '../service/open-browser.js';

export const ADD_BROWSERS = 'ADD_BROWSERS';
export const UPDATE_BROWSER = 'UPDATE_BROWSER';

export function detectBrowsers() {
  return (dispatch) => {
    return new Promise((resolve) => {
      browserLauncher.detect(function(available) {
        dispatch(addBrowsers(available));
        resolve();
      });
    })
  }
}

export function launchBrowser(browser) {
  return (dispatch) => {
    const options = {
      browser: browser.name,
      version: browser.version
    };
    return new Promise((resolve) => {
      openBrowser(options, (err) => {
        dispatch(updateBrowser(browser, err));
        resolve();
      });
    })

  }
}

export function addBrowsers(browsers = []) {
  return {
    type: ADD_BROWSERS,
    browsers
  };
}

export function updateBrowser(browser, status) {
  return {
    type: UPDATE_BROWSER,
    browser,
    status
  };
}
