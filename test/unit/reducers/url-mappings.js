import assert from 'assert';

import * as actions from 'common/actions/url-mappings.js';
import constants from 'common/constants.js';
import urlMappings from 'renderer/reducers/url-mappings.js';

const initialState = {
  mappings: [],
  count: 0,
  newMapping: {
    step: constants.NEW_MAPPING_STEP_TARGET,
    target: undefined,
    destination: undefined,
    isLocal: undefined,
    valid: undefined,
    errors: undefined
  }
};

const setupState = (newState) => {
  return Object.assign({}, initialState, newState);
};

const test = (action, expectedState) => {
  const nextState = urlMappings(initialState, action);
  assert.deepEqual(nextState, expectedState);
};

describe('urlMappings reducers', () => {
  it('should return the initial state', () => {
    const nextState = urlMappings(undefined, {});
    assert.deepEqual(nextState, initialState);
  });

  it('should handle SET_MAPPING_ERROR', () => {
    const action = {
      type: actions.SET_MAPPING_ERROR,
      error: 'Foo'
    };
    const expectedState = setupState({
      newMapping: {
        ...initialState.newMapping,
        errors: ['Foo']
      }
    });
    test(action, expectedState);
  });
});
