import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as actions from '../../../src/actions/requests.js';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const request = {
  request: {},
  response: {},
  id: ''
};

describe('request actions', () => {
  it('should create actions to set the request filter and then sync requests', () => {
    const initialState = {};
    const store = mockStore(initialState);

    const filter = 'foo';
    const expectedActions = [
      {
        type: actions.SET_REQUEST_FILTER,
        filter
      },
      {
        type: actions.SYNC_REQUESTS
      }
    ];

    store.dispatch(actions.setRequestFilter(filter));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should create an action to clear the active request', () => {
    const expectedAction = {
      type: actions.SET_ACTIVE_REQUEST,
      request: null
    };
    expect(actions.setActiveRequest()).toEqual(expectedAction);
  });

  it('should create an action to set the active request', () => {
    const expectedAction = {
      type: actions.SET_ACTIVE_REQUEST,
      request
    };
    expect(actions.setActiveRequest(request)).toEqual(expectedAction);
  });

  it('should create an action to clear the active context', () => {
    const expectedAction = {
      type: actions.SET_CONTEXT_REQUEST,
      request: null
    };
    expect(actions.setContextRequest()).toEqual(expectedAction);
  });

  it('should create an action to set the active context', () => {
    const expectedAction = {
      type: actions.SET_CONTEXT_REQUEST,
      request
    };
    expect(actions.setContextRequest(request)).toEqual(expectedAction);
  });

  it('should create an action to sync url mappings', () => {
    const expectedAction = {
      type: actions.SYNC_REQUESTS
    };
    expect(actions.syncRequests()).toEqual(expectedAction);
  });
});
