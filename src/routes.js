import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './containers/app.js';
import Home from './containers/home.js';
import Requests from './containers/requests.js';
import UrlMappings from './containers/url-mappings.js';

export default
  <Route path="/" component={App}>
    <IndexRoute component={Home} />
    <Route path="requests" component={Requests} />
    <Route path="url-mappings" component={UrlMappings}/>
  </Route>;
