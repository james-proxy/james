import remote from 'remote';

export default class DevTools {
  constructor() {
    this._open = false;
    this._window = remote.getCurrentWindow();
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
