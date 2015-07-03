import React from 'react';
import TitleBar from './component/titlebar';
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

let renderInProgress = false;

const db = new Datastore({ filename: app.getPath('userData') + '/data.nedb', autoload: true });

const urlMapper = new UrlMapper(db, function() {
  updateUrlMapCount();
  updateMappings();
});

const domNode = document.getElementById('app');
const proxy = new Proxy(() => {
  render();
}, config, urlMapper);

let data = {
  urlMapCount: 0,
  urlMappings: [],
  activeWindowFactory: null,
  fromIndex: 0,
  filter: null
};

const chooseFile = createChooseFile(remote.getCurrentWindow());

const windowFactories = {
  UrlMapping: () => {
    return <UrlMappingWindow
      urlMappings={data.urlMappings}
      setUrlMapping={urlMapper.set.bind(urlMapper)}
      removeUrlMappingByNewUrl={urlMapper.removeByNewUrl.bind(urlMapper)}
      closeWindow={closeWindow}
      chooseFile={chooseFile}
    ></UrlMappingWindow>;
  }
};

const openDevTools = () => {
  remote.getCurrentWindow().openDevTools({detach: true});
};

const closeWindow = () => {
  data.activeWindowFactory = null;
  render();
};

const updateUrlMapCount = () => {
  urlMapper.getCount(function(err, count) {
    if(err) return;
    data.urlMapCount = count;
    render();
  });
};

const updateMappings = () => {
  urlMapper.getList(function(err, urlMappings) {
    if(err) return;
    data.urlMappings = urlMappings;
    render();
  });
};

const showWindow = (windowName) => {
  data.activeWindowFactory = windowFactories[windowName];
  render();
};

const setFromIndex = (fromIndex) => {
  data.fromIndex = fromIndex;
  render();
};

const filterRequests = (filter) => {
  if(filter === '') {
    filter = null;
  }
  data.filter = filter;
  render();
};

function render() {

  const activeWindow = (data.activeWindowFactory && data.activeWindowFactory() || null);

  React.render(
    <div className="container">
      <TitleBar
        urlMapCount={data.urlMapCount}
        showWindow={showWindow}
        openDevTools={openDevTools}
      ></TitleBar>
      <MainContent 
        openBrowser={openBrowser} 
        activeWindow={activeWindow} 
        requestData={proxy.getRequestData(50, data.fromIndex, data.filter)} 
        setFromIndex={setFromIndex} 
        filterRequests={filterRequests}
        config={config} 
      ></MainContent>
    </div>,
    domNode
  );
}

updateUrlMapCount();
updateMappings();

render(true);
