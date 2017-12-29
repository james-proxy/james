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
    secret: '175fb8a8051f43c2aa414908f0a91c08',
    host: 'sentry.fuzzlesoft.ca/4'
  }
};
