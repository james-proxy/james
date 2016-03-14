import remote from 'remote';

export default class DevTools {
  constructor() {
    this._open = false;
  }

  toggle() {
    if (!this._open) {
      const window = remote.getCurrentWindow();
      window.openDevTools({detach: true});
      this._open = true;
    } else {
      const window = remote.getCurrentWindow();
      window.closeDevTools();
      this._open = false;
    }
  }
}
