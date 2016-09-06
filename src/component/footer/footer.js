import React from 'react';

import CacheButton from './cache.js';
import Throttle from './throttle.js';
import RequestCount from './request-count.js';
import ProxyStatus from './proxy-status.js';
import UpdateStatus from './update-status.js';

const Footer = () => <div className="footer">
  <CacheButton />
  <Throttle />
  <RequestCount />
  <ProxyStatus />
  <UpdateStatus />
</div>;

export default Footer;
