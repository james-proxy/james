import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import config from './config.js';

import ravenInit from './service/raven.js';
import createMenu from './menu.js';
import setupShortcuts from './shortcuts.js';
import setupStore from './store/index.js';
import setupProxy from './proxy.js';
import setupUrlMapper from './url-mapper.js';

import { init } from './actions/app.js';
import { syncRequests } from './actions/requests.js';
import { updateProxyStatus } from './actions/proxy.js';
import { syncUrlMappings } from './actions/url-mappings.js';

import AppContainer from './containers/app.js';
import Home from './containers/home.js';
import Requests from './containers/requests.js';
import UrlMappings from './containers/url-mappings.js';

ravenInit();

// use setTimeout to work around store not being setup initially
const wait = cb => (...args) => setTimeout(() => cb(...args));

const urlMapper = setupUrlMapper(wait(() => {
  store.dispatch(syncUrlMappings());
}));

const proxy = setupProxy(urlMapper, wait((errStatus, hasData) => {
  if (errStatus) {
    store.dispatch(updateProxyStatus(errStatus));
  }
  if (hasData) {
    store.dispatch(syncRequests());
  }
}));

const store = setupStore(proxy, urlMapper, hashHistory);
const storeHistory = syncHistoryWithStore(hashHistory, store);

createMenu();
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
