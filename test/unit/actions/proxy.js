import * as actions from '../../../src/actions/proxy.js';
import constants from '../../../src/constants.js';

describe('proxy actions', () => {
  it('should create an action to toggle caching', () => {
    const expectedAction = {
      type: actions.TOGGLE_CACHING
    };
    expect(actions.toggleCaching()).toEqual(expectedAction);
  });

  it('should create an action to toggle throttling', () => {
    const expectedAction = {
      type: actions.TOGGLE_THROTTLING
    };
    expect(actions.toggleThrottling()).toEqual(expectedAction);
  });

  it('should create an action to set throttle rate (default)', () => {
    const expectedAction = {
      type: actions.SET_THROTTLE_RATE,
      rate: 0
    };
    expect(actions.setThrottleRate()).toEqual(expectedAction);
  });

  it('should create an action to set throttle rate to 10', () => {
    const rate = 10;
    const expectedAction = {
      type: actions.SET_THROTTLE_RATE,
      rate
    };
    expect(actions.setThrottleRate(rate)).toEqual(expectedAction);
  });

  it('should create an action to update proxy status (default)', () => {
    const expectedAction = {
      type: actions.UPDATE_PROXY_STATUS,
      status: constants.PROXY_STATUS_WORKING
    };
    expect(actions.updateProxyStatus()).toEqual(expectedAction);
  });

  it('should create an action to update proxy status to no-https', () => {
    const status = constants.PROXY_STATUS_NO_HTTPS;
    const expectedAction = {
      type: actions.UPDATE_PROXY_STATUS,
      status
    };
    expect(actions.updateProxyStatus(status)).toEqual(expectedAction);
  });
});
