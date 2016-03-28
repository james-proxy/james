import remote from 'remote';

export default class DevTools {
  constructor() {
    this._window = remote.getCurrentWindow();
    this._open = false;
  }

  toggle() {
    if (!this._open) {
      this._window.openDevTools({detach: true});
      this._open = true;
    } else {
      this._window.closeDevTools();
      this._open = false;
    }
  }
}
