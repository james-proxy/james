import { combineReducers } from 'redux';

import constants from 'common/constants.js';

import * as actions from 'common/actions/url-mappings.js';

const initialState = {
  mappings: [],
  count: 0,
  newMapping: {
    step: constants.NEW_MAPPING_STEP_TARGET,
    target: undefined,
    destination: undefined,
    isLocal: undefined,
    valid: undefined
  }
};

// reducers

function mappings(state = initialState.mappings, action) {
  switch (action.type) {
  case actions.SYNC_URL_MAPPINGS:
    return action.mappings || initialState.mappings;

  default:
    return state;
  }
}

function count(state = initialState.count, action) {
  switch (action.type) {
  case actions.SYNC_URL_MAPPINGS:
    return action.mappings ? action.mappings.length : 0;

  default:
    return state;
  }
}

function newMapping(state = initialState.newMapping, action) {
  switch (action.type) {
  case actions.NEW_MAPPING_UPDATE:
    return Object.assign({}, state, action.mapping);

  case actions.NEW_MAPPING_NEXT:
    return Object.assign({}, state, {
      step: action.step,
      isLocal: action.isLocal,
      errors: []
    });

  case actions.NEW_MAPPING_RESET:
    return Object.assign({}, initialState.newMapping);

  case actions.SET_MAPPING_ERROR:
    return Object.assign({}, state, { errors: [action.error] } );

  default:
    return state;
  }
}

export default combineReducers({
  mappings,
  count,
  newMapping
});

// selectors

export function getMappings(state) {
  return state.urlMappings.mappings;
}

export function getMappingCount(state) {
  return state.urlMappings.count;
}

export function getNewMapping(state) {
  return state.urlMappings.newMapping;
}
