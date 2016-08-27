import openBrowser from '../service/open-browser.js';
import { navigateToRequests } from './app.js';

export const ADD_BROWSERS = 'ADD_BROWSERS';
export const DISABLE_BROWSER = 'DISABLE_BROWSER';

export function launchBrowser(browser) {
  return (dispatch) => {
    const options = {
      browser: browser.name,
      version: browser.version
    };
    return openBrowser(options)
      .then(() => { dispatch(navigateToRequests()); })
      .catch((err) => { dispatch(disableBrowser(browser, err)); });
  };
}

export function addBrowsers(browsers = []) {
  return {
    type: ADD_BROWSERS,
    browsers
  };
}

export function disableBrowser(browser, status) {
  return {
    type: DISABLE_BROWSER,
    browser,
    status
  };
}
