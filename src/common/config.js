import { remote, app as mainApp } from 'electron';
const app = remote ? remote.app : mainApp;

export default {
  version: app.getVersion(),
  userData: app.getPath('userData'),

  maxLogEntries: 100000,
  proxyPort: 1338,
  labels: [

  ],
  sentry: {
    dsn: '617ec0238f4a44ac97b9953b2ee0b67c',
    host: 'sentry.fuzzlesoft.ca/4'
  }
};
