import { app, BrowserWindow, ipcMain as ipc } from 'electron';
import squirrelStartup from 'electron-squirrel-startup';
import localShortcut from 'electron-localshortcut';
import browserLauncher from 'james-browser-launcher';
import path from 'path';

import constants from '../constants.js';
import config from '../config.js';

import AutoUpdater from './auto-updater.js';
import createMenu from './menu.js';
import createUrlMapper from './url-mapper.js';
import createProxy from './proxy.js';

if (squirrelStartup) {
  process.exit(0); // Don't run James if it's just being installed/updated/etc
}

const updater = new AutoUpdater({
  repo: 'james-proxy/james',
  currentVersion: constants.VERSION,
  enabled: !constants.DEV
});

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

  const index = path.join(__dirname, '..', 'index.html');
  mainWindow.loadURL(`file://${index}`);

  mainWindow.webContents.on('did-finish-load', () => {
    updater.check();

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

    updater.on('finished-check', (err, available) => {
      let status = available ? constants.UPDATE_AVAILABLE : constants.UPDATE_OK;

      if (err) {
        status = constants.UPDATE_ERROR;
      }

      mainWindow.webContents.send('updater-status', {
        status,
        info: err instanceof Error ? err.message : undefined
      });
    });

    updater.on('downloading', () => {
      mainWindow.webContents.send('updater-status', {
        status: constants.UPDATE_DOWNLOADING
      });
    });

    updater.on('downloaded', (info) => {
      mainWindow.webContents.send('updater-status', {
        status: constants.UPDATE_READY,
        info
      });
    });
    
    mainWindow.show();
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    mainWindow = null;
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
});

ipc.on('keyboard-listen', (event, {key}) => {
  localShortcut.register(mainWindow, key, () => event.sender.send('keyboard-press', key));
});
