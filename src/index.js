import { ipcRenderer as ipc } from 'electron';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter as Router } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import throttle from 'lodash.throttle';

import config from './config.js';

import ravenInit from './service/raven.js';
import setupShortcuts from './service/shortcuts.js';
import setupStore from './store/index.js';

import { init } from './actions/app.js';
import { syncRequests } from './actions/requests.js';
import { updateProxyStatus } from './actions/proxy.js';
import { syncUrlMappings } from './actions/url-mappings.js';
import { addBrowsers } from './actions/browsers.js';

import App from './containers/app';

import '../style/main.scss';

ravenInit();

const history = createHistory();
const store = setupStore(history);

const onProxySync = throttle((evt, payload) => {
  // note: full responses are not included to minimize GC
  store.dispatch(syncRequests(payload));
}, 300);

ipc.on('proxy-sync', onProxySync);

ipc.on('proxy-status', (evt, payload) => {
  store.dispatch(updateProxyStatus(payload));
});

ipc.on('mapper-sync', (evt, payload) => {
  store.dispatch(syncUrlMappings(payload));
});

ipc.on('browsers-sync', (evt, payload) => {
  store.dispatch(addBrowsers(payload));
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
