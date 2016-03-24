import Raven from 'raven-js';
import remote from 'remote';
import config from '../config.js';
import constants from '../constants.js';
const app = remote.require('app');

export default function init() {
  if (!constants.DEV) {
    return;
  }
  
  Raven.config('https://' + config.sentry.dsn + '@' + config.sentry.host, {
    release: app.getVersion()
  }).install();
}

