import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { routerMiddleware } from 'react-router-redux';

import constants from '../../common/constants.js';

import urlMapperMiddleware from './middleware/url-mapper.js';
import proxyMiddleware from './middleware/proxy.js';
import sentryMiddleware from './middleware/sentry.js';
import rootReducer from '../reducers/root.js';

export default (history) => {
  const loggerMiddleware = createLogger();
  const routingMiddleware = routerMiddleware(history);

  const middleware = [
    sentryMiddleware,
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
