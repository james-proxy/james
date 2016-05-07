import hoxy from 'hoxy';
import remote from 'remote';

const fs = remote.require('fs');

import config from './config.js';
import constants from './constants.js';
import urlMapper from './url-mapper.js';

import Proxy from './service/proxy.js';
import store from './store/index.js';
import { updateProxyStatus } from './actions/proxy.js';
import { render as renderAction } from './actions/app.js';

const render = () => {
  // TODO: replace this with something that makes actual sense
  store.dispatch(renderAction());
};

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


export const filterRequests = (filter) => {
  if (filter === '') {
    filter = null;
  }
  data.filter = filter;
  render();
};

export const clearRequests = () => {
  proxy.clear();
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

export default proxy;
