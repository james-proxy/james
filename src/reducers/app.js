import * as actions from '../actions/app.js';

const initialState = {
  config: {}
};

export default function app(state = initialState, action) {
  switch (action.type) {
  case actions.INIT:
    return Object.assign({}, state, {
      config: action.config
    });

  default:
    return state;
  }
}
