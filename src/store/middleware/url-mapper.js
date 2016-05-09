import * as actions from '../../actions/url-mappings.js';

const middleware = urlMapper => () => next => action => {
  const mapping = action.mapping;
  switch (action.type) {
  case actions.SET_URL_MAPPING:
    urlMapper.set(
        mapping.url,
        mapping.newUrl,
        mapping.isLocal,
        mapping.isActive
      );
    break;

  case actions.TOGGLE_URL_MAPPING:
    urlMapper.toggleActiveState(mapping.url);
    break;

  case actions.REMOVE_URL_MAPPING:
    urlMapper.remove(mapping.url);
    break;

  case actions.SYNC_URL_MAPPINGS:
    return next({
      ...action,
      mappings: urlMapper.mappings()
    });

  default:
    return next(action);
  }
};

export default middleware;
