import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { Router, Route, IndexRoute } from 'react-router';

import store, { history } from './store/index.js';

import config from './config.js';

import ravenInit from './service/raven.js';
import createMenu from './menu.js';
import setupShortcuts from './shortcuts.js';

import { init } from './actions/app.js';

import AppContainer from './containers/app.js';
import Home from './containers/home.js';
import Requests from './containers/requests.js';
import UrlMappings from './containers/url-mappings.js';

ravenInit();
createMenu();
setupShortcuts();
store.dispatch(init(config));

const domNode = document.querySelector('#app');

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={AppContainer}>
        <IndexRoute component={Home} />
        <Route path="/requests" component={Requests} />
        <Route path="/url-mappings" component={UrlMappings}/>
      </Route>
    </Router>
  </Provider>
, domNode);
