import constants from '../common/constants.js';

if (!constants.DEV) { // fix for loading async bundles (see electron-userland/electron-webpack#70)
  __webpack_public_path__ = `file:///${process.resourcesPath}/app.asar/`;  // eslint-disable-line camelcase
}

import { ipcRenderer as ipc } from 'electron';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter as Router } from 'react-router-redux';
import createHistory from 'history/createHashHistory';
import * as Sentry from '@sentry/browser';

import config from '../common/config.js';
import sentryInit from '../common/service/sentry.js';
import setupShortcuts from '../common/service/shortcuts.js';

import setupStore from './store/index.js';

import { init, setUpdaterStatus } from '../common/actions/app.js';
import { updateProxyStatus } from '../common/actions/proxy.js';
import { syncUrlMappings } from '../common/actions/url-mappings.js';
import { addBrowsers } from '../common/actions/browsers.js';

import App from './containers/app';

import './resources/style/main.scss';
import { addRequest, completeRequest } from 'common/actions/requests';

sentryInit(Sentry);

const history = createHistory();
const store = setupStore(history);

ipc.on('proxy-new-request', (evt, payload) => {
  store.dispatch(addRequest(payload));
});

ipc.on('proxy-request-completed', (evt, payload) => {
  store.dispatch(completeRequest(payload));
});

ipc.on('proxy-status', (evt, payload) => {
  store.dispatch(updateProxyStatus(payload));
});

ipc.on('mapper-sync', (evt, payload) => {
  store.dispatch(syncUrlMappings(payload));
});

ipc.on('browsers-sync', (evt, payload) => {
  store.dispatch(addBrowsers(payload));
});

ipc.on('updater-status', (evt, payload) => {
  store.dispatch(setUpdaterStatus(payload));
});

setupShortcuts(store);
store.dispatch(init({ config }));

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>
  , document.getElementById('app'));
