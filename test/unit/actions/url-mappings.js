import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { push } from 'react-router-redux';

import * as actions from '../../../src/actions/url-mappings.js';
import constants from '../../../src/constants.js';

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
    expect(store.getActions()).toEqual(expectedActions);
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
    expect(actions.setUrlMapping(url, newUrl)).toEqual(expectedAction);
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
    expect(actions.setUrlMapping(url, newUrl, true)).toEqual(expectedAction);
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
    expect(actions.setUrlMapping(url, newUrl, undefined, false)).toEqual(expectedAction);
  });

  it('should create an action to remove an url mapping', () => {
    const expectedAction = {
      type: actions.REMOVE_URL_MAPPING,
      mapping: {
        url
      }
    };
    expect(actions.removeUrlMapping(url)).toEqual(expectedAction);
  });

  it('should create an action to toggle an url mapping', () => {
    const expectedAction = {
      type: actions.TOGGLE_URL_MAPPING,
      mapping: {
        url
      }
    };
    expect(actions.toggleUrlMapping(url)).toEqual(expectedAction);
  });

  it('should create an action to sync url mappings', () => {
    const mappings = [];
    const expectedAction = {
      type: actions.SYNC_URL_MAPPINGS,
      mappings
    };
    expect(actions.syncUrlMappings({mappings})).toEqual(expectedAction);
  });

  it('should create an action to update new mapping state', () => {
    const mapping = {
      target: 'foo'
    };
    const expectedAction = {
      type: actions.NEW_MAPPING_UPDATE,
      mapping
    };
    expect(actions.updateNewMapping(mapping)).toEqual(expectedAction);
  });

  it('should create an action to advance the new mapping state (url)', () => {
    const expectedAction = {
      type: actions.NEW_MAPPING_NEXT,
      step: constants.NEW_MAPPING_STEP_DESTINATION,
      isLocal: false
    };
    expect(actions.nextNewMapping(false)).toEqual(expectedAction);
  });

  it('should create an action to advance the new mapping state (file)', () => {
    const expectedAction = {
      type: actions.NEW_MAPPING_NEXT,
      step: constants.NEW_MAPPING_STEP_DESTINATION,
      isLocal: true
    };
    expect(actions.nextNewMapping(true)).toEqual(expectedAction);
  });

  it('should create an action to reset new mapping state', () => {
    const expectedAction = {
      type: actions.NEW_MAPPING_RESET
    };
    expect(actions.resetNewMapping()).toEqual(expectedAction);
  });
});
