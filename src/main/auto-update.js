import { autoUpdater } from 'electron-updater';
import Raven from 'raven';

import constants from 'common/constants.js';

autoUpdater.autoDownload = true;

export default (win, enabled) => {
  if (!enabled) {
    console.log('Auto updates are disabled.'); // eslint-disable-line no-console
    return;
  }

  autoUpdater.checkForUpdates();

  const updateStatus = (status, info) => {
    console.log('[update status]', status, info);  // eslint-disable-line no-console
    win.webContents.send('updater-status', {
      status,
      info
    });
  };

  autoUpdater.on('checking-for-update', () => {
    updateStatus(constants.UPDATE_CHECKING);
  });
  
  autoUpdater.on('update-available', (info) => {
    updateStatus(constants.UPDATE_AVAILABLE, info);
  });
  
  autoUpdater.on('update-not-available', (info) => {
    updateStatus(constants.UPDATE_OK, info);
  });
  
  autoUpdater.on('download-progress', (progress) => {
    updateStatus(constants.UPDATE_DOWNLOADING, progress);
  });
  
  autoUpdater.on('update-downloaded', (info) => {
    updateStatus(constants.UPDATE_READY, info);
  });
  
  autoUpdater.on('error', (err) => {
    updateStatus(constants.UPDATE_ERROR, err.message);
    Raven.captureException(err);
  });
};
