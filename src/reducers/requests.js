import * as actions from '../actions/requests.js';

const initialState = {
  filter: null
};

export default function requests(state = initialState, action) {
  switch (action.type) {
  case actions.SET_REQUEST_FILTER:
    return Object.assign({}, state, {
      filter: action.filter
    });

  default:
    return state;
  }
}
