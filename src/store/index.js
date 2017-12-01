import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { routerMiddleware } from 'react-router-redux';

import urlMapperMiddleware from './middleware/url-mapper.js';
import proxyMiddleware from './middleware/proxy.js';
import ravenMiddleware from './middleware/raven.js';
import rootReducer from '../reducers/root.js';
import constants from '../constants.js';

export default (history) => {
  const loggerMiddleware = createLogger();
  const routingMiddleware = routerMiddleware(history);

  const middleware = [
    ravenMiddleware,
    thunkMiddleware,
    urlMapperMiddleware,
    proxyMiddleware,
    routingMiddleware
  ];

  if (constants.DEV) {
    middleware.push(loggerMiddleware);
  }

  return createStore(
    rootReducer,
    applyMiddleware(...middleware)
  );
};
