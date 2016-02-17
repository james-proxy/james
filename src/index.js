import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import { createStore, applyMiddleware } from 'redux';

import hoxy from 'hoxy';
import remote from 'remote';
import Datastore from 'nedb';

import Proxy from './service/proxy.js';
import UrlMapper from './service/url-mapper.js';
import Keyboard from './service/keyboard.js';
import DevTools from './service/dev-tools.js';
import ravenInit from './service/raven.js';

import config from './config.js';
import createMenu from './menu.js';

import constants from './constants.js';

import rootReducer from './reducers/root.js';
import { updateProxyStatus } from './actions/proxy.js';
import { detectBrowsers } from './actions/browsers.js';

import AppContainer from './component/app.js';
import UrlMappingWindow from './component/mapping/url-mapping-window.js';

ravenInit();

const app = remote.require('app');
const fs = remote.require('fs');


const loggerMiddleware = createLogger();
const store = createStore(
  rootReducer,
  applyMiddleware(
    thunkMiddleware,
    loggerMiddleware
  )
);

const db = new Datastore({
  filename: app.getPath('userData') + '/data.nedb',
  autoload: true
});

const data = {
  urlMapCount: 0,
  urlMappings: [],
  filter: null,
  activeWindowFactory: null
};


const urlMapper = new UrlMapper(db, function() {
  data.urlMappings = urlMapper.mappings();
  render();
});

const createHoxy = () => {
  const opts = {};
  try {
    const key = fs.readFileSync('./root-ca.key.pem');
    const cert = fs.readFileSync('./root-ca.crt.pem');
    opts.certAuthority = {key, cert};
  } catch (e) {
    store.dispatch(updateProxyStatus(constants.PROXY_STATUS_NO_HTTPS));
  }

  const hoxyServer = hoxy.createServer(opts);
  hoxyServer.on('error', (event) => {
    console.warn('hoxy error: ', event); // eslint-disable-line
    if (event.code === 'EADDRINUSE') {
      store.dispatch(updateProxyStatus(constants.PROXY_STATUS_ERROR_ADDRESS_IN_USE));
    }
  });

  return hoxyServer.listen(config.proxyPort);
};

const proxy = new Proxy(() => {
  render();
}, config, urlMapper, createHoxy, store);

const clearRequests = () => {
  proxy.clear();
  render();
};

const filterRequests = (filter) => {
  if (filter === '') {
    filter = null;
  }
  data.filter = filter;
  render();
};

store.subscribe(() => {
  const state = store.getState();

  if (state.proxy.throttleEnabled) {
    proxy.slow(state.proxy.throttleRate);
  } else {
    proxy.disableThrottling();
  }
});



const windowFactories = {
  UrlMapping: () => {
    return <UrlMappingWindow
      urlMappings={data.urlMappings}
      setUrlMapping={urlMapper.set.bind(urlMapper)}
      removeUrlMapping={urlMapper.remove.bind(urlMapper)}
      closeWindow={closeWindow}
      toggleUrlMappingIsActive={urlMapper.toggleActiveState.bind(urlMapper)}
      {...data.activeWindow.options}
    />;
  }
};

const toggleWindow = (windowName, options = {}) => {
  if (data.activeWindow && data.activeWindow.name === windowName) {
    data.activeWindow = null;
  } else {
    data.activeWindow = {
      name: windowName,
      factory: windowFactories[windowName],
      options: options
    };
  }
  render();
};

const closeWindow = () => {
  data.activeWindow = null;
  render();
};



const keyboard = new Keyboard();
const devTools = new DevTools(constants.DEV);

keyboard.register('Esc', closeWindow);
keyboard.register('CommandOrControl+U', () => toggleWindow('UrlMapping'));
keyboard.register('F12', devTools.toggle.bind(devTools));
keyboard.register('Ctrl+Shift+I', devTools.toggle.bind(devTools));
keyboard.register('CommandOrControl+Alt+I', devTools.toggle.bind(devTools));
keyboard.register('CommandOrControl+Alt+U', devTools.toggle.bind(devTools));



const domNode = document.getElementById('app');

function render() {
  data.urlMapCount = urlMapper.count();
  const activeWindow = data.activeWindow && data.activeWindow.factory() || null;
  const requestData = proxy.getRequestData(data.filter);

  const appProps = {
    data, config,
    devTools, toggleWindow, activeWindow,
    urlMapper, requestData, filterRequests, clearRequests
  };

  ReactDOM.render(
    <Provider store={store}>
      <AppContainer {...appProps} />
    </Provider>
  , domNode);
}

createMenu();
store.dispatch(detectBrowsers());
render(true);
