import * as actions from '../actions/url-mappings.js';
import INIT from '../actions/app.js';

const initialState = {
  mappings: [],
  count: 0
};

export default function urlMappings(state = initialState, action) {
  switch (action.type) {
  case INIT:
  case actions.SYNC_URL_MAPPINGS: {
    return Object.assign({}, state, {
      mappings: action.mappings,
      count: action.mappings.length
    });
  }

  default:
    return state;
  }
}
