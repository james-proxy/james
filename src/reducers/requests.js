import * as actions from '../actions/requests.js';

const initialState = {
  filter: null,
  active: null,
  context: null
};

export default function requests(state = initialState, action) {
  switch (action.type) {
  case actions.SET_REQUEST_FILTER:
    return Object.assign({}, state, {
      filter: action.filter
    });

  case actions.SET_ACTIVE_REQUEST:
    const nextActive = state.active !== action.requestId ? action.requestId : null;
    return Object.assign({}, state, {
      active: nextActive
    });

  case actions.SET_CONTEXT_REQUEST:
    const nextContext = state.context !== action.requestId ? action.requestId : null;
    return Object.assign({}, state, {
      context: nextContext
    });

  default:
    return state;
  }
}
