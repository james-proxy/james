import hoxy from 'hoxy';
import { remote } from 'electron';
const { fs } = remote;

import config from './config.js';
import constants from './constants.js';

import Proxy from './service/proxy.js';

export default (urlMapper, cb) => {
  const createHoxy = () => {
    const opts = {};
    try {
      const key = fs.readFileSync('./root-ca.key.pem');
      const cert = fs.readFileSync('./root-ca.crt.pem');
      opts.certAuthority = {key, cert};
    } catch (e) {
      cb(constants.PROXY_STATUS_NO_HTTPS);
    }

    const hoxyServer = hoxy.createServer(opts);
    hoxyServer.on('error', (event) => {
      console.warn('hoxy error: ', event); // eslint-disable-line
      if (event.code === 'EADDRINUSE') {
        cb(constants.PROXY_STATUS_ERROR_ADDRESS_IN_USE);
      }
    });

    return hoxyServer.listen(config.proxyPort);
  };

  const handleUpdate = () => cb(null, true);

  const proxy = new Proxy(handleUpdate, config, urlMapper, createHoxy);

  return proxy;
};
