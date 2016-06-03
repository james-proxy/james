import * as actions from '../../../src/actions/browsers.js';

const browsers = [{}];

describe('browser actions', () => {
  // TODO: detectBrowsers, launchBrowser
  
  it('should create an action to add browsers (default)', () => {
    const expectedAction = {
      type: actions.ADD_BROWSERS,
      browsers: []
    };
    expect(actions.addBrowsers()).toEqual(expectedAction);
  });

  it('should create an action to add browsers', () => {
    const expectedAction = {
      type: actions.ADD_BROWSERS,
      browsers
    };
    expect(actions.addBrowsers(browsers)).toEqual(expectedAction);
  });

  it('should create an action to update a browser', () => {
    const browser = {};
    const status = 'Not found';
    const expectedAction = {
      type: actions.UPDATE_BROWSER,
      browser,
      status
    };
    expect(actions.updateBrowser(browser, status)).toEqual(expectedAction);
  });
});
