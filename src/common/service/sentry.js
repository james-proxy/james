import config from '../config.js';
import constants from '../constants.js';

export default function init(Sentry) {
  if (constants.DEV) {
    return;
  }

  const { dsn, host } = config.sentry;
  Sentry.init({
    dsn: `https://${dsn}@${host}`,
    release: config.version
  });
}
