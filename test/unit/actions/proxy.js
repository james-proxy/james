import assert from 'assert';

import * as actions from '../../../src/common/actions/proxy.js';
import constants from '../../../src/common/constants.js';

describe('proxy actions', () => {
  it('should create an action to toggle caching', () => {
    const expectedAction = {
      type: actions.TOGGLE_CACHING
    };
    assert.deepEqual(actions.toggleCaching(), expectedAction);
  });

  it('should create an action to toggle throttling', () => {
    const expectedAction = {
      type: actions.TOGGLE_THROTTLING
    };
    assert.deepEqual(actions.toggleThrottling(), expectedAction);
  });

  it('should create an action to set throttle rate (default)', () => {
    const expectedAction = {
      type: actions.SET_THROTTLE_RATE,
      rate: 0
    };
    assert.deepEqual(actions.setThrottleRate(), expectedAction);
  });

  it('should create an action to set throttle rate to 10', () => {
    const rate = 10;
    const expectedAction = {
      type: actions.SET_THROTTLE_RATE,
      rate
    };
    assert.deepEqual(actions.setThrottleRate(rate), expectedAction);
  });

  it('should create an action to update proxy status (default)', () => {
    const expectedAction = {
      type: actions.UPDATE_PROXY_STATUS,
      status: constants.PROXY_STATUS_WORKING,
      reason: undefined
    };
    assert.deepEqual(actions.updateProxyStatus(), expectedAction);
  });

  it('should create an action to update proxy status to no-https', () => {
    const status = constants.PROXY_STATUS_NO_HTTPS;
    const reason = 'testing';

    const expectedAction = {
      type: actions.UPDATE_PROXY_STATUS,
      status,
      reason
    };
    assert.deepEqual(actions.updateProxyStatus({status, reason}), expectedAction);
  });

  it('should create an action to clear requests', () => {
    const expectedAction = {
      type: actions.CLEAR_REQUESTS
    };
    assert.deepEqual(actions.clearRequests(), expectedAction);
  });
});
