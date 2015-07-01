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
  updateMapCount();
  updateMappings();
});

const domNode = document.getElementById('app');
const proxy = new Proxy(() => {
  render();
}, config, urlMapper);

let data = {
  mapCount: 0,
  mappings: [],
  activeWindowFactory: null
};

const services = {
  urlMapper,
  chooseFile: createChooseFile(remote.getCurrentWindow())
};

const windowFactories = {
  UrlMapping: () => {
    return <UrlMappingWindow
      mappings={data.mappings}
      urlMapper={urlMapper}
      closeWindow={closeWindow}
      chooseFile={services.chooseFile}
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

const updateMapCount = () => {
  urlMapper.getCount(function(err, count) {
    if(err) return;
    data.mapCount = count;
    render();
  });
};

const updateMappings = () => {
  urlMapper.getList(function(err, mappings) {
    if(err) return;
    data.mappings = mappings;
    render();
  });
};

const showWindow = (windowName) => {
  data.activeWindowFactory = windowFactories[windowName];
  render();
};

function render(force) {

  const activeWindow = (data.activeWindowFactory && data.activeWindowFactory() || null);

  React.render(
    <div className="container">
      <TitleBar mapCount={data.mapCount} showWindow={showWindow} openDevTools={openDevTools}></TitleBar>
      <MainContent openBrowser={openBrowser} activeWindow={activeWindow} requests={proxy.getRequests()} config={config} services={services}></MainContent>
    </div>,
    domNode
  );
}

updateMapCount();
updateMappings();

render(true);
