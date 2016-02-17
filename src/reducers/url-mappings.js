import * as actions from '../actions/url-mappings.js';

const initialState = {
  mappings: []
};

export default function urlMappings(state = initialState, action) {
  switch (action.type) {
  case actions.ADD_URL_MAPPING:
    return Object.assign({}, state, {
      mappings: [
        ...state.mappings,
        {
          url: action.url,
          newUrl: action.newUrl,
          isActive: action.isActive,
          isLocal: action.isLocal
        }
      ]
    });

  case actions.REMOVE_URL_MAPPING:
    return Object.assign({}, state, {
      mappings: state.mappings.filter(
        (mapping) => mapping.url !== action.url
      )
    });

  case actions.UPDATE_URL_MAPPING: {
    const index = state.mappings.findIndex(
      (mapping) => mapping._id === action._id
    );
    if (index < 0) {
      // couldn't find mapping for given source, no change
      return state;
    }
    const mapping = state.mappings[index];
    return Object.assign({}, state, {
      mappings: [
        ...state.mappings.slice(0, index),
        Object.assign({}, mapping, {
          url: action.url,
          newUrl: action.newUrl,
          isActive: action.isActive,
          isLocal: action.isLocal
        }),
        ...state.mappings.slice(index + 1)
      ]
    });
  }
  case actions.TOGGLE_URL_MAPPING: {
    const index = state.mappings.findIndex(
      (mapping) => mapping._id === action._id
    );
    if (index < 0) {
      // couldn't find mapping for given source, no change
      return state;
    }
    const mapping = state.mappings[index];
    return Object.assign({}, state, {
      mappings: [
        ...state.mappings.slice(0, index),
        Object.assign({}, mapping, {
          isActive: !mapping.isActive
        }),
        ...state.mappings.slice(index + 1)
      ]
    });
  }
  default:
    return state;
  }
}
