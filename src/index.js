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
  cachingEnabled: false
};

const urlMapper = new UrlMapper(db, function() {
  updateMappings();
});

const createHoxy = () => {
  return new hoxy.Proxy().listen(config.proxyPort);
};

const isCachingEnabled = () => {
  return data.cachingEnabled;
};

const toggleCaching = () => {
  data.cachingEnabled = !data.cachingEnabled;
  render();
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
      setUrlMapping={urlMapper.set.bind(urlMapper)}
      removeUrlMapping={urlMapper.remove.bind(urlMapper)}
      closeWindow={closeWindow}
      chooseFile={chooseFile} />;
  }
};

const openDevTools = () => {
  remote.getCurrentWindow().openDevTools({detach: true});
};

const closeWindow = () => {
  data.activeWindowFactory = null;
  render();
};

const updateMappings = () => {
  urlMapper.getList(function(err, urlMappings) {
    if (err) return;
    data.urlMappings = urlMappings;
    render();
  });
};

const showWindow = (windowName) => {
  data.activeWindowFactory = windowFactories[windowName];
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
  const activeWindow = (data.activeWindowFactory && data.activeWindowFactory() || null);

  React.render(
    <div className="container">
      <TitleBar
        urlMapCount={data.urlMapCount}
        showWindow={showWindow}
        openDevTools={openDevTools} />
      <MainContent
        openBrowser={openBrowser}
        activeWindow={activeWindow}
        requestData={proxy.getRequestData(50, data.fromIndex, data.filter)}
        setFromIndex={setFromIndex}
        filterRequests={filterRequests}
        config={config} />
      <Footer
        isCachingEnabled={isCachingEnabled}
        toggleCaching={toggleCaching} />
    </div>,
    domNode
  );
}

updateMappings();

render(true);
