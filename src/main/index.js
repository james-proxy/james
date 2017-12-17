import { app, BrowserWindow, ipcMain as ipc } from 'electron';
import localShortcut from 'electron-localshortcut';
import browserLauncher from 'james-browser-launcher';
import path from 'path';

import constants from 'common/constants.js';
import config from 'common/config.js';

import createMenu from './menu.js';
import createUrlMapper from './url-mapper.js';
import createProxy from './proxy.js';
import autoUpdater from './auto-update.js';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
let mainWindow = null;

console.log('Loading URL mappings...'); // eslint-disable-line no-console
const urlMapper = createUrlMapper({
  filename: `${constants.USER_DATA}/data.nedb`,
  autoload: true
});

console.log('Starting proxy...'); // eslint-disable-line no-console
const proxy = createProxy(config, urlMapper.urlMapper);

// Quit when all windows are closed.
app.on('window-all-closed', () => app.quit());

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', () => {
  // Create the browser window.
  createMenu();
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    autoHideMenuBar: true,
    show: false
  });

  let rendererURL = `file://${__dirname}/index.html`;
  if (constants.DEV) {
    rendererURL = `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`;
  }
  mainWindow.loadURL(rendererURL);
  if (constants.DEV) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('proxy-status', proxy.status);
    mainWindow.webContents.send('mapper-sync', {
      mappings: urlMapper.urlMapper.mappings()
    });

    browserLauncher.detect((available) => {
      mainWindow.webContents.send('browsers-sync',
        available.filter(browser => browser.type !== 'phantomjs'));
    });

    proxy.on('status', ({status, reason}) => {
      mainWindow.webContents.send('proxy-status', {
        status,
        reason
      });
    });

    proxy.on('update', ({requestData}) => {
      mainWindow.webContents.send('proxy-sync', {
        requestData
      });
    });

    urlMapper.on('update', ({mappings}) => {
      mainWindow.webContents.send('mapper-sync', {
        mappings
      });
    });
    
    mainWindow.show();
    autoUpdater(mainWindow, !constants.DEV);
  });

  ipc.on('proxy-get-request', (evt, {id}) => {
    const request = proxy.getRequest(id);
    evt.returnValue = request; // note: not async
  });

  ipc.on('proxy-cache-toggle', (evt, {enabled}) => {
    proxy.setCaching(enabled);
  });

  ipc.on('proxy-throttle', (evt, {enabled, rate}) => {
    if (enabled) {
      proxy.proxy.slow(rate);
    } else {
      proxy.proxy.disableThrottling();
    }
  });
  
  ipc.on('proxy-filter', (evt, {filter}) => {
    proxy.setFilter(filter);
  });

  ipc.on('proxy-clear', () => {
    proxy.proxy.clear();
  });

  ipc.on('mappings-set', (evt, {url, newUrl, isLocal, isActive}) => {
    urlMapper.urlMapper.set(url, newUrl, isLocal, isActive);
  });

  ipc.on('mappings-toggle', (evt, {url}) => {
    urlMapper.urlMapper.toggleActiveState(url);
  });

  ipc.on('mappings-remove', (evt, {url}) => {
    urlMapper.urlMapper.remove(url);
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});

ipc.on('keyboard-listen', (event, {key}) => {
  localShortcut.register(mainWindow, key, () => event.sender.send('keyboard-press', key));
});
