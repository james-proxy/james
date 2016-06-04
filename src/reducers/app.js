import { combineReducers } from 'redux';
import * as actions from '../actions/app.js';

const initialState = {
  config: {}
};

function config(state = initialState.config, action) {
  if (action.type !== actions.INIT) {
    return state;
  }
  return action.config || state;
}

export default combineReducers({
  config
});
