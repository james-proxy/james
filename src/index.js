import { ipcRenderer as ipc } from 'electron';

import React from 'react';
import ReactDOM from 'react-dom';
import throttle from 'lodash.throttle';

import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import config from './config.js';

import ravenInit from './service/raven.js';
import setupShortcuts from './shortcuts.js';
import setupStore from './store/index.js';

import { init } from './actions/app.js';
import { syncRequests } from './actions/requests.js';
import { updateProxyStatus } from './actions/proxy.js';
import { syncUrlMappings } from './actions/url-mappings.js';
import { addBrowsers } from './actions/browsers.js';

import AppContainer from './containers/app.js';
import Home from './containers/home.js';
import Requests from './containers/requests.js';
import UrlMappings from './containers/url-mappings.js';

ravenInit();

const store = setupStore(hashHistory);
const storeHistory = syncHistoryWithStore(hashHistory, store);

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

const domNode = document.querySelector('#app');

ReactDOM.render(
  <Provider store={store}>
    <Router history={storeHistory}>
      <Route path="/" component={AppContainer}>
        <IndexRoute component={Home} />
        <Route path="requests" component={Requests} />
        <Route path="url-mappings" component={UrlMappings}/>
      </Route>
    </Router>
  </Provider>
, domNode);
