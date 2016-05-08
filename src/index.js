import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { Router, Route, IndexRoute } from 'react-router';

import store, { history } from './store/index.js';

import config from './config.js';

import ravenInit from './service/raven.js';
import createMenu from './menu.js';
import setupShortcuts from './shortcuts.js';

import urlMapper, { data } from './url-mapper.js';

import { init } from './actions/app.js';

import AppContainer from './containers/app.js';
import Home from './containers/home.js';
import Requests from './containers/requests.js';
import UrlMappings from './containers/url-mappings.js';

ravenInit();
createMenu();
setupShortcuts();

const domNode = document.querySelector('#app');

data.urlMapCount = urlMapper.count();

const appProps = {
  data, config,
  urlMapper
};

const derp = (Component) => { // TODO: temp until I finish wiring things up
  const Wrapper = ({children}) => {
    return <Component {...appProps}>{children}</Component>;
  };
  Wrapper.propTypes = { // ...just for you, eslint
    children: React.PropTypes.node
  };
  return Wrapper;
};

// TODO: extract routes, once derp is no longer necessary
ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={derp(AppContainer)}>
        <IndexRoute component={Home} />
        <Route path="/requests" component={derp(Requests)} />
        <Route path="/url-mappings" component={derp(UrlMappings)}/>
      </Route>
    </Router>
  </Provider>
, domNode);

store.dispatch(init());
