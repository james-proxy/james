import assert from 'assert';
import requests from '../../../src/renderer/reducers/requests.js';
import { getFilteredRequestCount, getTotalRequestCount, getVisibleRequests } from '../../../src/renderer/reducers/requests';
import * as actions from '../../../src/common/actions/requests';
import * as proxyActions from '../../../src/common/actions/proxy';

const initialState = {
  filter: null,
  activeRequestId: null,
  contextRequestId: null,
  data: []
};

const setupState = (newState) => {
  return Object.assign({}, initialState, newState);
};

const setupSelectorState = (newState) => {
  return {
    requests: Object.assign({}, initialState, newState)
  };
};

const test = (action, expectedState) => {
  const nextState = requests(initialState, action);
  assert.deepEqual(nextState, expectedState);
};

describe('requests reducers', () => {
  it('should return the initial state', () => {
    const nextState = requests(undefined, {});
    assert.deepEqual(nextState, initialState);
  });

  it('adds a request', () => {
    const action = {
      type: actions.ADD_REQUEST,
      requestContainer: {
        id: '1',
        request: {},
        response: {}
      }
    };
    const expectedState = setupState({
      data: [{
        id: '1',
        request: {},
        response: {}
      }]
    });
    test(action, expectedState);
  });

  it('has the newest requests in the front', () => {
    const firstAction = {
      type: actions.ADD_REQUEST,
      requestContainer: {
        id: 'first',
        request: {},
        response: {}
      }
    };
    const secondAction = {
      type: actions.ADD_REQUEST,
      requestContainer: {
        id: 'second',
        request: {},
        response: {}
      }
    };
    const nextState = requests(requests(initialState, firstAction), secondAction);
    assert.equal(nextState.data[0].id, 'second');
    assert.equal(nextState.data[1].id, 'first');
  });

  it('updates response upon request being completed', () => {
    const addRequest = {
      type: actions.ADD_REQUEST,
      requestContainer: {
        id: 'id',
        request: {},
        response: {}
      }
    };
    const completeRequest = {
      type: actions.COMPLETE_REQUEST,
      requestContainer: {
        id: 'id',
        request: {},
        response: {exampleBody: 'foo'}
      }
    };
    const nextState = requests(requests(initialState, addRequest), completeRequest);
    assert.equal(nextState.data[0].response.exampleBody, 'foo');
  });

  it('clears requests', () => {
    const addRequest = {
      type: actions.ADD_REQUEST,
      requestContainer: {
        id: 'id',
        request: {},
        response: {}
      }
    };
    const clearRequest = {
      type: proxyActions.CLEAR_REQUESTS
    };
    const nextState = requests(requests(initialState, addRequest), clearRequest);
    assert.equal(nextState.data.length, 0);
  });
});

describe('requests selectors', () => {
  describe('when no filter applied', () => {
    const state = setupSelectorState({
      data: [
        {request: {fullUrl: '1', original: {fullUrl: '1'}}},
        {request: {fullUrl: '2', original: {fullUrl: '2'}}},
        {request: {fullUrl: '3', original: {fullUrl: '3'}}}
      ]
    });

    it('all requests are visible', () => {
      assert.deepEqual(getVisibleRequests(state), [
        {request: {fullUrl: '1', original: {fullUrl: '1'}}},
        {request: {fullUrl: '2', original: {fullUrl: '2'}}},
        {request: {fullUrl: '3', original: {fullUrl: '3'}}}
      ]);
    });

    it('all requests should be included in "filtered count"', () => {
      assert(getFilteredRequestCount(state) === 3);
    });
  });

  describe('when filter applied', () => {
    const state = setupSelectorState({
      filter: 'foo',
      data: [
        {request: {fullUrl: 'foo', original: {fullUrl: 'foo'}}},
        {request: {fullUrl: 'foo', original: {fullUrl: 'bar'}}},
        {request: {fullUrl: 'baz', original: {fullUrl: 'baz'}}}
      ]
    });

    it('filters by url and original url', function() {
      assert.deepEqual(getVisibleRequests(state), [
        {request: {fullUrl: 'foo', original: {fullUrl: 'foo'}}},
        {request: {fullUrl: 'foo', original: {fullUrl: 'bar'}}}
      ]);
    });

    it('should show the number of requests that match an applied filter', () => {
      assert(getFilteredRequestCount(state) === 2);
    });

    it('should show correct total request count even when filter applied', () => {
      assert(getTotalRequestCount(state) === 3);
    });
  });
});
