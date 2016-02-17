import remote from 'remote';

export default class DevTools {
  constructor(startOpen) {
    this._window = remote.getCurrentWindow();
    this._open = false;
    if (startOpen) {
      this.toggle();
    }
  }

  toggle() {
    if (!this._open) {
      this._window.openDevTools({mode: 'detach'});
      this._open = true;
    } else {
      this._window.closeDevTools();
      this._open = false;
    }
  }
}
