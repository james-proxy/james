import config from '../config.js';

const normalizeUrl = url => url.replace(/^.*(app|electron)\.asar/, '');

function normalizeException(ex) {
  if (!ex || !ex.stacktrace || !ex.stacktrace.frames) return ex;
  ex.stacktrace.frames = ex.stacktrace.frames.map(function(frame) {
    if (!frame || !frame.filename) return frame;

    frame.filename = normalizeUrl(frame.filename);
    return frame;
  });
  return ex;
}

function normalizeData(data) {
  if (data.culprit) {
    data.culprit = normalizeUrl(data.culprit);
  }

  if (!data.exception) return data;
  if (data.exception.values) {
    data.exception.values = data.exception.values.map(normalizeException);
  } else {
    data.exception = data.exception.map(normalizeException);
  }
  return data;
}

export default function init(Sentry) {
  if (config.DEV) {
    return;
  }

  const { dsn, host } = config.sentry;
  Sentry.init({
    dsn: `https://${dsn}@${host}`,
    release: config.version,
    beforeSend: normalizeData
  });
}
