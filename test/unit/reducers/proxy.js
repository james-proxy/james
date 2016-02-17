import proxy from '../../../src/reducers/proxy.js';
import * as actions from '../../../src/actions/proxy.js';
import constants from '../../../src/constants.js';

const initialState = {
  status: constants.PROXY_STATUS_WORKING,
  cachingEnabled: false,
  throttleEnabled: false,
  throttleRate: 0
};

const setupState = (newState) => {
  return Object.assign({}, initialState, newState);
};

describe('proxy reducers', () => {
  it('should return the initial state', () => {
    expect(
      proxy(undefined, {})
    ).toEqual(initialState);
  });

  it('should handle TOGGLE_CACHING', () => {
    const action = {
      type: actions.TOGGLE_CACHING
    };
    const expectedState = setupState({
      cachingEnabled: true
    });
    expect(
      proxy(initialState, action)
    ).toEqual(expectedState);
  });

  it('should handle TOGGLE_THROTTLING', () => {
    const action = {
      type: actions.TOGGLE_THROTTLING
    };
    const expectedState = setupState({
      throttleEnabled: true
    });
    expect(
      proxy(initialState, action)
    ).toEqual(expectedState);
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
    expect(
      proxy(initialState, action)
    ).toEqual(expectedState);
  });

  it('should handle UPDATE_PROXY_STATUS', () => {
    const status = constants.PROXY_STATUS_NO_HTTPS;
    const action = {
      type: actions.UPDATE_PROXY_STATUS,
      status
    };
    const expectedState = setupState({
      status
    });
    expect(
      proxy(initialState, action)
    ).toEqual(expectedState);
  });
});
