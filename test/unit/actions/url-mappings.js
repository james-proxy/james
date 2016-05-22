import * as actions from '../../../src/actions/url-mappings.js';

const url = 'https://github.com/james-proxy/james';
const newUrl = 'https://www.github.com/james-proxy/james';

describe('url mapper actions', () => {
  // TODO: showAddUrlMapping

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
    const expectedAction = {
      type: actions.SYNC_URL_MAPPINGS
    };
    expect(actions.syncUrlMappings()).toEqual(expectedAction);
  });
});
