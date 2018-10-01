import assert from 'assert';

import * as actions from '../../../src/common/actions/requests.js';

const request = {
  request: {},
  response: {},
  id: ''
};

describe('request actions', () => {
  it('should create actions to set the request filter', () => {
    const filter = 'foo';
    const expectedAction = {
      type: actions.SET_REQUEST_FILTER,
      filter
    };

    assert.deepEqual(actions.setRequestFilter(filter), expectedAction);
  });

  it('should create an action to clear the active request', () => {
    const expectedAction = {
      type: actions.SET_ACTIVE_REQUEST,
      request: null
    };
    assert.deepEqual(actions.setActiveRequest(), expectedAction);
  });

  it('should create an action to set the active request', () => {
    const expectedAction = {
      type: actions.SET_ACTIVE_REQUEST,
      request
    };
    assert.deepEqual(actions.setActiveRequest(request), expectedAction);
  });

  it('should create an action to clear the active context', () => {
    const expectedAction = {
      type: actions.SET_CONTEXT_REQUEST,
      request: null
    };
    assert.deepEqual(actions.setContextRequest(), expectedAction);
  });

  it('should create an action to set the active context', () => {
    const expectedAction = {
      type: actions.SET_CONTEXT_REQUEST,
      request
    };
    assert.deepEqual(actions.setContextRequest(request), expectedAction);
  });

  it('should create an action to sync url mappings', () => {
    const requestData = {};
    const expectedAction = {
      type: actions.SYNC_REQUESTS,
      requestData
    };
    assert.deepEqual(actions.syncRequests({requestData}), expectedAction);
  });
});
