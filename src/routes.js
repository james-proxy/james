import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './containers/app.js';

function loadRoute(cb) {
  return (module) => cb(null, module.default);
}

function onError(err) {
  console.error('Failed to load route', err);
}

export default
  <Route path="/" component={App}>
    <IndexRoute getComponent={(location, cb) => {
      System.import('./containers/home.js').then(loadRoute(cb)).catch(onError);
    }} />
    <Route path="requests" getComponent={(location, cb) => {
      System.import('./containers/requests.js').then(loadRoute(cb)).catch(onError);
    }} />
    <Route path="url-mappings" getComponent={(location, cb) => {
      System.import('./containers/url-mappings.js').then(loadRoute(cb)).catch(onError);
    }}/>
  </Route>;
