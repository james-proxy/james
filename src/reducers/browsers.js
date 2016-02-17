import * as actions from '../actions/browsers.js';

const initialState = {
  browsers: []
};

export default function browsers(state = initialState, action) {
  switch (action.type) {
  case actions.ADD_BROWSERS:
    return Object.assign({}, state, {
      browsers: [
        ...state.browsers,
        ...action.browsers
      ]
    });

  case actions.UPDATE_BROWSER: {
    const index = state.browsers.findIndex(
      (browser) => browser.command === action.browser.command
    );
    if (index < 0) {
      // couldn't find mapping for given source, no change
      return state;
    }
    const browser = state.browsers[index];
    return Object.assign({}, state, {
      browsers: [
        ...state.browsers.slice(0, index),
        Object.assign({}, browser, {
          status: action.status
        }),
        ...state.browsers.slice(index + 1)
      ]
    });
  }

  default:
    return state;
  }
}
