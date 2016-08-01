import { app, BrowserWindow, ipcMain as ipc } from 'electron';
import squirrelStartup from 'electron-squirrel-startup';
import localShortcut from 'electron-localshortcut';
import browserLauncher from 'james-browser-launcher';

import constants from './constants.js';
import config from './config.js';

import createUrlMapper from './main/url-mapper.js';
import createProxy from './main/proxy.js';

if (squirrelStartup) {
  process.exit(0); // Don't run James if it's just being installed/updated/etc
}
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
let mainWindow = null;
let urlMapper = null;
let proxy = null;

// Quit when all windows are closed.
app.on('window-all-closed', () => app.quit());

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    autoHideMenuBar: true,
    show: false
  });

  console.log('Loading URL mappings...'); // eslint-disable-line no-console
  urlMapper = createUrlMapper({
    filename: `${constants.USER_DATA}/data.nedb`,
    autoload: true
  });

  console.log('Starting proxy...'); // eslint-disable-line no-console
  proxy = createProxy(config, urlMapper.urlMapper);

  proxy.on('status', ({status}) => {
    console.log('root-proxy-status', status);
  });

  mainWindow.loadURL('file://' + __dirname + '/index.html');

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('mapper-sync', {
      mappings: urlMapper.urlMapper.mappings()
    });

    browserLauncher.detect((available) => {
      mainWindow.webContents.send('browsers-sync', available);
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
  });

  ipc.on('proxy-cache-toggle', ({enabled}) => {
    proxy.setCaching(enabled);
  });

  ipc.on('proxy-throttle', ({enabled, rate}) => {
    if (enabled) {
      proxy.proxy.slow(rate);
    } else {
      proxy.proxy.disableThrottling();
    }
  });
  
  ipc.on('proxy-filter', ({filter}) => {
    proxy.setFilter(filter);
  });

  ipc.on('proxy-clear', () => {
    proxy.proxy.clear();
  });

  ipc.on('mappings-set', ({url, newUrl, isLocal, isActive}) => {
    urlMapper.urlMapper.set(url, newUrl, isLocal, isActive);
  });

  ipc.on('mappings-toggle', ({url}) => {
    urlMapper.urlMapper.toggleActiveState(url);
  });

  ipc.on('mappings-remove', ({url}) => {
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
