import Raven from 'raven-js';

import config from '../config.js';
import constants from '../constants.js';

export default function init() {
  if (constants.DEV) {
    return;
  }

  Raven.config('https://' + config.sentry.dsn + '@' + config.sentry.host, {
    release: constants.VERSION
  }).install();
}
