import assert from 'assert';

import requests from 'renderer/reducers/requests.js';
import { getFilteredRequestCount, getTotalRequestCount, getVisibleRequests } from 'renderer/reducers/requests';

const initialState = {
  filter: null,
  active: null,
  context: null,
  data: []
};

const setupState = (newState) => {
  return {
    requests: Object.assign({}, initialState, newState)
  };
};

describe('requests reducers', () => {
  it('should return the initial state', () => {
    const nextState = requests(undefined, {});
    assert.deepEqual(nextState, initialState);
  });
});

describe('requests selectors', () => {
  describe('when no filter applied', () => {
    const state = setupState({
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
    const state = setupState({
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
