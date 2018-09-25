import * as Sentry from '@sentry/browser';

import constants from 'common/constants.js';

import { SYNC_REQUESTS } from 'common/actions/requests.js';
import { SYNC_URL_MAPPINGS } from 'common/actions/url-mappings.js';

const middleware = () => next => action => {
  if (constants.DEV) {
    return next(action);
  }
  try {
    if (action.type !== SYNC_REQUESTS && action.type !== SYNC_URL_MAPPINGS) {
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
