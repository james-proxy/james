import {remote} from 'electron';

export default class DevTools {
  constructor() {
    this._window = remote.getCurrentWindow();
    this._open = false;
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
