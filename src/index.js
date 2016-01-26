import React from 'react';
import hoxy from 'hoxy';
import TitleBar from './component/titlebar';
import Footer from './component/footer';
import MainContent from './component/main-content.js';
import Proxy from './service/proxy.js';
import createChooseFile from './service/choose-file.js';
import config from './config.js';
import Datastore from 'nedb';
import UrlMapper from './url-mapper.js';
import createMenu from './menu';
import remote from 'remote';
import openBrowser from './util/open-browser.js';

const app = remote.require('app');
const fs = remote.require('fs');

createMenu();

// windows
import UrlMappingWindow from './component/window/url-mapping.js';

const db = new Datastore({
  filename: app.getPath('userData') + '/data.nedb',
  autoload: true
});

const data = {
  urlMapCount: 0,
  urlMappings: [],
  activeWindowFactory: null,
  fromIndex: 0,
  filter: null,
  cachingEnabled: false,
  throttle: {enabled: false, rate: 0} // rate is in kBps
};

const urlMapper = new UrlMapper(db, function() {
  updateMappings();
});

const createHoxy = () => {
  const opts = {};
  try {
    const key = fs.readFileSync('./root-ca.key.pem');
    const cert = fs.readFileSync('./root-ca.crt.pem');
    opts.certAuthority = {key, cert};
  } catch (e) {
    console.log('Not proxying HTTPS, missing key or certificate: ' + e); // eslint-disable-line
  }

  return hoxy.createServer(opts).listen(config.proxyPort);
};

const isCachingEnabled = () => {
  return data.cachingEnabled;
};

const toggleCaching = () => {
  data.cachingEnabled = !data.cachingEnabled;
  render();
};

const clearRequests = () => {
  proxy.clear();
  render();
};

const throttleDisable = () => {
  data.throttle.enabled = false;
  proxy.disableThrottling();
};

const throttleEnable = () => {
  data.throttle.enabled = true;
  proxy.slow(data.throttle.rate);
};

const throttleRateChange = (kBps) => {
  data.throttle.rate = kBps;
  proxy.slow(kBps);
};

const domNode = document.getElementById('app');
const proxy = new Proxy(() => {
  render();
}, config, urlMapper, createHoxy, isCachingEnabled);

const chooseFile = createChooseFile(remote.getCurrentWindow());

const windowFactories = {
  UrlMapping: () => {
    return <UrlMappingWindow
      urlMappings={data.urlMappings}
      options={data.activeWindow.options}
      setUrlMapping={urlMapper.set.bind(urlMapper)}
      removeUrlMapping={urlMapper.remove.bind(urlMapper)}
      closeWindow={closeWindow}
      chooseFile={chooseFile}
      toggleUrlMappingIsActive={urlMapper.toggleActiveState.bind(urlMapper)} />;
  }
};

const openDevTools = () => {
  remote.getCurrentWindow().openDevTools({detach: true});
};

const closeWindow = () => {
  data.activeWindow = null;
  render();
};

const updateMappings = () => {
  urlMapper.getList(function(err, urlMappings) {
    if (err) return;
    data.urlMappings = urlMappings;
    render();
  });
};

const showWindow = (windowName, options = {}) => {
  data.activeWindow = {
    factory: windowFactories[windowName],
    options: options
  };
  render();
};

/**
 * Set the index of the first request from where we start rendering.
 * This is done because we only want to render elements the user actually sees.
 *
 * @param fromIndex
 */
const setFromIndex = (fromIndex) => {
  data.fromIndex = fromIndex;
  render();
};

const filterRequests = (filter) => {
  if (filter === '') {
    filter = null;
  }
  data.filter = filter;
  render();
};

function render() {
  data.urlMapCount = urlMapper.getCount();
  const activeWindow = data.activeWindow && data.activeWindow.factory() || null;
  const requestData = proxy.getRequestData(50, data.fromIndex, data.filter);
  const {enabled, rate} = data.throttle;

  React.render(
    <div className="container">
      <TitleBar
        urlMapCount={data.urlMapCount}
        showWindow={showWindow}
        openDevTools={openDevTools} />
      <MainContent
        openBrowser={openBrowser}
        showWindow={showWindow}
        activeWindow={activeWindow}
        requestData={requestData}
        setFromIndex={setFromIndex}
        filterRequests={filterRequests}
        config={config}
        removeUrlMapping={urlMapper.remove.bind(urlMapper)}
        toggleUrlMappingActiveState={urlMapper.toggleActiveState.bind(urlMapper)} />
      <Footer
        isCachingEnabled={isCachingEnabled}
        requestData={requestData}
        clearRequests={clearRequests}
        toggleCaching={toggleCaching}
        onDisableThrottle={throttleDisable}
        onEnableThrottle={throttleEnable}
        onRateChange={throttleRateChange}
        enabled={enabled}
        rate={rate} />
    </div>,
    domNode
  );
}

updateMappings();

render(true);
