const localShortcut = require('electron-localshortcut');

exports.applyShortcut = function(window, accelerator, cb) {
  localShortcut.register(window, accelerator, cb);
};
