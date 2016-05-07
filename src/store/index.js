import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';

import { hashHistory } from 'react-router';
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux';

import rootReducer from '../reducers/root.js';

const loggerMiddleware = createLogger();
const routingMiddleware = routerMiddleware(hashHistory);
const store = createStore(
  rootReducer,
  applyMiddleware(
    thunkMiddleware,
    routingMiddleware,
    loggerMiddleware
  )
);

export const history = syncHistoryWithStore(hashHistory, store);

export default store;
