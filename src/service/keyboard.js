const ipc = require('electron').ipcRenderer;

export default class Keyboard {
  constructor() {
    this.actions = {};
    ipc.on('keyboard-press', (event, arg) => this.actions[arg]());
  }

  register(key, action) {
    this.actions[key] = action;
    ipc.send('keyboard-listen', {key});
  }
}
