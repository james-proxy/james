import { app, ipcMain as ipc, BrowserWindow } from 'electron';
import localShortcut from 'electron-localshortcut';
import GithubReleases from 'electron-gh-releases';

const updater = new GithubReleases({
  repo: 'james-proxy/james',
  currentVersion: app.getVersion()
});

let mainWindow = null;
let updateWindow = null;

app.on('window-all-closed', () => app.quit());

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    title: 'james'
  });

  mainWindow.loadURL('file://' + __dirname + '/index.html');

  mainWindow.on('closed', function() {
    mainWindow = null;
  });

  function showUpdateDialog() {
    updateWindow = new BrowserWindow({
      width: 512,
      height: 192,
      alwaysOnTop: true,
      closable: false,
      minimizable: false,
      maximizable: false,
      movable: false,
      fullscreen: false,
      resizable: false,
      title: 'updater'
    });

    updateWindow.on('closed', function() {
      updateWindow = null;
    });

    updateWindow.loadURL('file://' + __dirname + '/update.html');
  }

  updater.check((error, status) => {
    if (!error && status) {
      showUpdateDialog();
    }
  });
});

ipc.on('update-permitted', function(event, isPermitted) {
  if (!isPermitted) {
    return updateWindow.destroy();
  }

  updater.on('update-downloaded', () => {
    updater.install();
  });

  mainWindow.close();
  updater.download();
});

ipc.on('keyboard-listen', (event, {key}) => {
  localShortcut.register(mainWindow, key, () => event.sender.send('keyboard-press', key));
});
