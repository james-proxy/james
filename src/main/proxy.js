import hoxy from 'hoxy';
import { fs } from 'electron';
import EventEmitter from 'events';

import constants from '../constants.js';

import Proxy from '../service/proxy.js';

class ProxyHandler extends EventEmitter {
  constructor(config, urlMapper) {
    super();
    this.config = config;
    this.filter = undefined;
    this.cachingEnabled = false;

    this.proxy = new Proxy(
      this.onUpdate_.bind(this),
      config,
      urlMapper,
      this.createHoxy.bind(this),
      this.isCaching.bind(this)
    );
  }

  createHoxy() {
    const opts = {};
    try {
      const key = fs.readFileSync(`${constants.USER_DATA}/root-ca.key.pem`);
      const cert = fs.readFileSync(`${constants.USER_DATA}/root-ca.crt.pem`);
      opts.certAuthority = {key, cert};
    } catch (e) {
      const [reason] = e.message.split('\n');
      this.emit('status', {
        status: constants.PROXY_STATUS_NO_HTTPS,
        reason
      });
    }

    const hoxyServer = hoxy.createServer(opts);
    hoxyServer.log('error warn info debug');
    hoxyServer.on('error', (event) => {
      if (event.code === 'ENOTFOUND') return;
      console.warn('hoxy error: ', event.code, event); // eslint-disable-line

      if (event.code === 'EADDRINUSE') {
        this.emit('status', {
          status: constants.PROXY_STATUS_ERROR_ADDRESS_IN_USE,
          reason
        });
      }
    });

    return hoxyServer.listen(this.config.proxyPort);
  }

  onUpdate_() {
    console.log('__proxy-update');
    this.emit('update', {
      requestData: this.proxy.getRequestData(this.filter)
    });
  }

  setCaching(caching) {
    this.isCaching = caching;
  }

  isCaching() {
    return this.isCaching;
  }

  setFilter(filter) {
    this.filter = filter;
    this.onUpdate_();
  }
}

export default function createProxyHandler(config, urlMapper) {
  return new ProxyHandler(config, urlMapper);
}
