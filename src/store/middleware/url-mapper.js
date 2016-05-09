import * as actions from '../../actions/url-mappings.js';

const middleware = urlMapper => store => next => action => {
  if (!action.mapping) {
    return next(action);
  }

  const {url, newUrl, isLocal, isActive} = action.mapping;
  switch (action.type) {
    case actions.SET_URL_MAPPING:
      urlMapper.set(url, newUrl, isLocal, isActive);
      break;

    case actions.TOGGLE_URL_MAPPING:
      urlMapper.toggleActiveState(url);
      break;

    case actions.REMOVE_URL_MAPPING:
      urlMapper.remove(url)
      break;

    default:
      return next(action);
  }
};

export default middleware;
