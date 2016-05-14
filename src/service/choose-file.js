import {remote} from 'electron';

export default function createChooseFile(window) {
  const {dialog} = remote;

  return function chooseFile(callback) {
    dialog.showOpenDialog(window, {
      properties: ['openFile']
    }, callback);
  };
}
