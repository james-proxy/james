import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';

import { routerMiddleware } from 'react-router-redux';

import urlMapperMiddleware from './middleware/url-mapper.js';
import proxyMiddleware from './middleware/proxy.js';
import rootReducer from '../reducers/root.js';
import constants from '../constants.js';

export default (proxy, urlMapper, history) => {
  const loggerMiddleware = createLogger();
  const routingMiddleware = routerMiddleware(history);

  let middleware = [
    thunkMiddleware,
    urlMapperMiddleware(urlMapper),
    proxyMiddleware(proxy),
    routingMiddleware
  ];

  if (constants.DEV) {
    middleware.push(loggerMiddleware);
  }

  const store = createStore(
    rootReducer,
    applyMiddleware(...middleware)
  );


  return store;
};
