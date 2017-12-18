import { remote } from 'electron';

export function toggleDevTools() {
  const webContents = remote.getCurrentWebContents();
  webContents.toggleDevTools();
}
