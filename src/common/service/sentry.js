import config from '../config.js';

export default function init(Sentry) {
  if (config.DEV) {
    return;
  }

  const { dsn, host } = config.sentry;
  Sentry.init({
    dsn: `https://${dsn}@${host}`,
    release: config.version
  });
}
