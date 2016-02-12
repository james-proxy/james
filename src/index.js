import React from 'react';
import ReactDOM from 'react-dom';
import hoxy from 'hoxy';
import remote from 'remote';
import Datastore from 'nedb';
import browserLauncher from 'browser-launcher2';

import TitleBar from './component/title-bar/title-bar.js';
import Footer from './component/footer/footer.js';
import MainContent from './component/main-content/main-content.js';

import Proxy from './service/proxy.js';
import createChooseFile from './service/choose-file.js';

import config from './config.js';
import UrlMapper from './url-mapper.js';
import createMenu from './menu.js';
import openBrowser from './open-browser.js';
import Keyboard from './keyboard.js';
import DevTools from './dev-tools.js';

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
  browsers: [],
  urlMapCount: 0,
  urlMappings: [],
  activeWindowFactory: null,
  fromIndex: 0,
  filter: null,
  cachingEnabled: false,
  proxyStatus: 'offline',
  proxyMessage: undefined,
  throttle: {enabled: false, rate: 0} // rate is in kBps
};

const keyboard = new Keyboard();
const devTools = new DevTools();
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
    data.proxyStatus = 'partial';
    data.proxyMessage = 'no HTTPS';
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

const toggleThrottle = () => {
  const enabled = !data.throttle.enabled;
  data.throttle.enabled = enabled;

  if (enabled) {
    proxy.slow(data.throttle.rate);
  } else {
    proxy.disableThrottling();
  }

  render();
};

const throttleRateChange = (kBps) => {
  data.throttle.rate = kBps;
  proxy.slow(kBps);
  render();
};

const domNode = document.getElementById('app');
const proxy = new Proxy(() => {
  render();
}, config, urlMapper, createHoxy, isCachingEnabled);

browserLauncher.detect(function(available) {
  data.browsers = available;
  render();
});

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

const closeWindow = () => {
  data.activeWindow = null;
  render();
};

const showWindow = (windowName, options = {}) => {
  data.activeWindow = {
    factory: windowFactories[windowName],
    options: options
  };
  render();
};

keyboard.register('Esc', closeWindow);
keyboard.register('CommandOrControl+U', () => showWindow('UrlMapping'));
keyboard.register('F12', devTools.toggle.bind(devTools));
keyboard.register('Ctrl+Shift+I', devTools.toggle.bind(devTools));
keyboard.register('CommandOrControl+Alt+I', devTools.toggle.bind(devTools));
keyboard.register('CommandOrControl+Alt+U', devTools.toggle.bind(devTools));

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
  data.urlMapCount = urlMapper.count();
  const activeWindow = data.activeWindow && data.activeWindow.factory() || null;
  const requestData = proxy.getRequestData(50, data.fromIndex, data.filter);
  const {enabled, rate} = data.throttle;

  ReactDOM.render(
    <div className="container">
      <TitleBar
        urlMapCount={data.urlMapCount}
        showWindow={showWindow}
        openDevTools={devTools.toggle.bind(devTools)} />
      <MainContent
        openBrowser={openBrowser}
        browsers={data.browsers}
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
        toggleThrottle={toggleThrottle}
        onRateChange={throttleRateChange}
        proxyStatus={data.proxyStatus}
        proxyMessage={data.proxyMessage}
        enabled={enabled}
        rate={rate} />
    </div>,
    domNode
  );
}

render(true);
