import assert from 'assert';

import * as actions from '../../../src/common/actions/requests.js';

const requestId = '';

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
      requestId: null
    };
    assert.deepEqual(actions.setActiveRequest(), expectedAction);
  });

  it('should create an action to set the active request', () => {
    const expectedAction = {
      type: actions.SET_ACTIVE_REQUEST,
      requestId
    };
    assert.deepEqual(actions.setActiveRequest(requestId), expectedAction);
  });

  it('should create an action to clear the active context', () => {
    const expectedAction = {
      type: actions.SET_CONTEXT_REQUEST,
      requestId: null
    };
    assert.deepEqual(actions.setContextRequest(), expectedAction);
  });

  it('should create an action to set the active context', () => {
    const expectedAction = {
      type: actions.SET_CONTEXT_REQUEST,
      requestId
    };
    assert.deepEqual(actions.setContextRequest(requestId), expectedAction);
  });
});
