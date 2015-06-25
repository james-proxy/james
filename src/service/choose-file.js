import remote from 'remote';

export default function createChooseFile(window) {

  const dialog = remote.require('dialog');

  return function chooseFile(callback) {
    dialog.showOpenDialog(window, {
      properties: ['openFile']
    }, callback)
  }
};
