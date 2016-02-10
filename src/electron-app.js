const electron = require('electron');
const app = electron.app;  // Module to control application life.
const ipc = electron.ipcMain;
const BrowserWindow = require('browser-window');  // Module to create native browser window.
const localShortcut = require('electron-localshortcut');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
let mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', () => app.quit());

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    title: 'james'
  });

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/index.html');

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
