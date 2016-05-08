import hoxy from 'hoxy';
import remote from 'remote';

const fs = remote.require('fs');

import config from './config.js';
import constants from './constants.js';
import urlMapper from './url-mapper.js';

import Proxy from './service/proxy.js';
import store from './store/index.js';
import { updateProxyStatus } from './actions/proxy.js';
import { syncRequests } from './actions/requests.js';

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

const handleUpdate = () => {
  const {requests} = proxy.getRequestData();
  store.dispatch(syncRequests(requests));
};

const proxy = new Proxy(handleUpdate, config, urlMapper, createHoxy);

store.subscribe(() => {
  const {proxy: state} = store.getState();
  proxy._isCachingEnabled = state.cachingEnabled;

  if (state.throttleEnabled) {
    proxy.slow(state.throttleRate);
  } else {
    proxy.disableThrottling();
  }
});

export default proxy;
