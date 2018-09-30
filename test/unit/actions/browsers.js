import assert from 'assert';

import * as actions from '../../../src/common/actions/browsers.js';

const browsers = [{}];

describe('browser actions', () => {
  // TODO: detectBrowsers, launchBrowser

  it('should create an action to add browsers (default)', () => {
    const expectedAction = {
      type: actions.ADD_BROWSERS,
      browsers: []
    };
    assert.deepEqual(actions.addBrowsers(), expectedAction);
  });

  it('should create an action to add browsers', () => {
    const expectedAction = {
      type: actions.ADD_BROWSERS,
      browsers
    };
    assert.deepEqual(actions.addBrowsers(browsers), expectedAction);
  });

  it('should create an action to update a browser', () => {
    const browser = {};
    const status = 'Not found';
    const expectedAction = {
      type: actions.DISABLE_BROWSER,
      browser,
      status
    };
    assert.deepEqual(actions.disableBrowser(browser, status), expectedAction);
  });
});
