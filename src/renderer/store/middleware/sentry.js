import * as Sentry from '@sentry/browser';

import constants from '../../../common/constants.js';

import { ADD_REQUEST, COMPLETE_REQUEST } from '../../../common/actions/requests.js';
import { SYNC_URL_MAPPINGS } from '../../../common/actions/url-mappings.js';

const middleware = () => next => action => {
  if (constants.DEV) {
    return next(action);
  }
  try {
    if (![ADD_REQUEST, COMPLETE_REQUEST, SYNC_URL_MAPPINGS].includes(action.type)) {
      Sentry.addBreadcrumb({
        category: 'action',
        level: 'info',
        data: action
      });
    }
    return next(action);
  } catch (err) {
    Sentry.captureException(err);
  }
};

export default middleware;
