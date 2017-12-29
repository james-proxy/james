import { ipcRenderer as ipc } from 'electron';

import * as actions from 'common/actions/url-mappings.js';

const middleware = () => next => action => {
  const mapping = action.mapping;
  switch (action.type) {
  case actions.SET_URL_MAPPING:
    ipc.send('mappings-set', mapping);
    break;

  case actions.TOGGLE_URL_MAPPING:
    ipc.send('mappings-toggle', {url: mapping.url});
    break;

  case actions.REMOVE_URL_MAPPING:
    ipc.send('mappings-remove', {url: mapping.url});
    break;

  default:
    break;
  }

  return next(action);
};

export default middleware;
