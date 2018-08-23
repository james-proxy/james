import assert from 'assert';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { push } from 'react-router-redux';

import * as actions from 'common/actions/url-mappings.js';
import constants from 'common/constants.js';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const url = 'https://github.com/james-proxy/james';
const newUrl = 'https://www.github.com/james-proxy/james';

describe('url mapper actions', () => {
  it('should create an action to show add url mapping', () => {
    const initialState = {};
    const store = mockStore(initialState);

    const expectedActions = [
      push('/url-mappings'),
      {
        type: actions.NEW_MAPPING_UPDATE,
        mapping: {
          target: url
        }
      }
    ];

    store.dispatch(actions.showAddUrlMapping(url));
    assert.deepEqual(store.getActions(), expectedActions);
  });

  it('should create an action to set an url mapping', () => {
    const expectedAction = {
      type: actions.SET_URL_MAPPING,
      mapping: {
        url,
        newUrl,
        isLocal: false,
        isActive: true
      }
    };
    assert.deepEqual(actions.setUrlMapping(url, newUrl), expectedAction);
  });

  it('should create an action to set a local url mapping', () => {
    const expectedAction = {
      type: actions.SET_URL_MAPPING,
      mapping: {
        url,
        newUrl,
        isLocal: true,
        isActive: true
      }
    };
    assert.deepEqual(actions.setUrlMapping(url, newUrl, true), expectedAction);
  });

  it('should create an action to set an inactive url mapping', () => {
    const expectedAction = {
      type: actions.SET_URL_MAPPING,
      mapping: {
        url,
        newUrl,
        isLocal: false,
        isActive: false
      }
    };
    assert.deepEqual(actions.setUrlMapping(url, newUrl, undefined, false), expectedAction);
  });

  it('should create an action to remove an url mapping', () => {
    const expectedAction = {
      type: actions.REMOVE_URL_MAPPING,
      mapping: {
        url
      }
    };
    assert.deepEqual(actions.removeUrlMapping(url), expectedAction);
  });

  it('should create an action to toggle an url mapping', () => {
    const expectedAction = {
      type: actions.TOGGLE_URL_MAPPING,
      mapping: {
        url
      }
    };
    assert.deepEqual(actions.toggleUrlMapping(url), expectedAction);
  });

  it('should create an action to sync url mappings', () => {
    const mappings = [];
    const expectedAction = {
      type: actions.SYNC_URL_MAPPINGS,
      mappings
    };
    assert.deepEqual(actions.syncUrlMappings({mappings}), expectedAction);
  });

  it('should create an action to update new mapping state', () => {
    const mapping = {
      target: 'foo'
    };
    const expectedAction = {
      type: actions.NEW_MAPPING_UPDATE,
      mapping
    };
    assert.deepEqual(actions.updateNewMapping(mapping), expectedAction);
  });

  it('should create an action to advance the new mapping state (url)', () => {
    const expectedAction = {
      type: actions.NEW_MAPPING_NEXT,
      step: constants.NEW_MAPPING_STEP_DESTINATION,
      isLocal: false
    };
    assert.deepEqual(actions.nextNewMapping(false), expectedAction);
  });

  it('should create an action to advance the new mapping state (file)', () => {
    const expectedAction = {
      type: actions.NEW_MAPPING_NEXT,
      step: constants.NEW_MAPPING_STEP_DESTINATION,
      isLocal: true
    };
    assert.deepEqual(actions.nextNewMapping(true), expectedAction);
  });

  it('should create an action to reset new mapping state', () => {
    const expectedAction = {
      type: actions.NEW_MAPPING_RESET
    };
    assert.deepEqual(actions.resetNewMapping(), expectedAction);
  });

  it('should create an action to set the mapping-related errors', () => {
     const msg = 'Whoops, something went wrong';
     const expectedAction = {
         type: actions.SET_MAPPING_ERROR,
         error: msg
     };
     assert.deepEqual(actions.setNewMappingError(msg), expectedAction);
  });
});
