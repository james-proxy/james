import proxy from '../../../src/renderer/reducers/proxy.js';
import * as actions from '../../../src/common/actions/proxy.js';
import constants from '../../../src/common/constants.js';

const initialState = {
  status: constants.PROXY_STATUS_STARTING,
  statusReason: null,
  cachingEnabled: false,
  throttleEnabled: false,
  throttleRate: 0
};

const setupState = (newState) => {
  return Object.assign({}, initialState, newState);
};

const test = (action, expectedState) => {
  const nextState = proxy(initialState, action);
  expect(nextState).toEqual(expectedState);
};

describe('proxy reducers', () => {
  it('should return the initial state', () => {
    const nextState = proxy(undefined, {});
    expect(nextState).toEqual(initialState);
  });

  it('should handle TOGGLE_CACHING', () => {
    const action = {
      type: actions.TOGGLE_CACHING
    };
    const expectedState = setupState({
      cachingEnabled: true
    });
    test(action, expectedState);
  });

  it('should handle TOGGLE_THROTTLING', () => {
    const action = {
      type: actions.TOGGLE_THROTTLING
    };
    const expectedState = setupState({
      throttleEnabled: true
    });
    test(action, expectedState);
  });

  it('should handle SET_THROTTLE_RATE', () => {
    const rate = 20;
    const action = {
      type: actions.SET_THROTTLE_RATE,
      rate
    };
    const expectedState = setupState({
      throttleRate: rate
    });
    test(action, expectedState);
  });

  it('should handle UPDATE_PROXY_STATUS', () => {
    const status = constants.PROXY_STATUS_NO_HTTPS;
    const reason = 'testing';
    const action = {
      type: actions.UPDATE_PROXY_STATUS,
      status,
      reason
    };
    const expectedState = setupState({
      status,
      statusReason: reason
    });
    test(action, expectedState);
  });
});
