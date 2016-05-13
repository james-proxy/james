import { ipcRenderer } from 'electron';

export default class Keyboard {
  constructor() {
    this.actions = {};
    ipcRenderer.on('keyboard-press', (event, arg) => this.actions[arg]());
  }

  register(key, action) {
    this.actions[key] = action;
    ipcRenderer.send('keyboard-listen', {key});
  }
}
