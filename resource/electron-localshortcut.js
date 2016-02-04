'use strict';

const electron = require('electron');
const globalShortcut = electron.globalShortcut;
const BrowserWindow = electron.BrowserWindow;
const app = electron.app;
const windowsWithShortcuts = new WeakMap();

// a placeholder to register shortcuts
// on any window of the app.
const ANY_WINDOW = {};

function isAccelerator(arg) {
  return typeof arg === 'string';
}

function unregisterAllShortcuts(win) {
  const shortcuts = windowsWithShortcuts.get(win);
  shortcuts.forEach( sc =>
    globalShortcut.unregister(sc.accelerator)
  );
}

function registerAllShortcuts(win) {
  const shortcuts = windowsWithShortcuts.get(win);

  shortcuts.forEach( sc =>
    globalShortcut.register(sc.accelerator, sc.callback)
  );
}

function unregisterAll(win) {
  if (win === undefined) {
    // unregister shortcuts for any window in the app
    unregisterAll(ANY_WINDOW);
    return;
  }

  if (!windowsWithShortcuts.has(win)) {
    return;
  }

  unregisterAllShortcuts(win);
  windowsWithShortcuts.delete(win);
}

function register(win, accelerator, callback) {
  if (arguments.length === 2 && isAccelerator(win)) {
    // register shortcut for any window in the app
    // win = accelerator, accelerator = callback
    register(ANY_WINDOW, win, accelerator);
    return;
  }

  if (windowsWithShortcuts.has(win)) {
    const shortcuts = windowsWithShortcuts.get(win);
    shortcuts.push({
      accelerator: accelerator,
      callback: callback
    });
  } else {
    windowsWithShortcuts.set(win, [{
      accelerator: accelerator,
      callback: callback
    }]);
  }

  const focusedWin = BrowserWindow.getFocusedWindow();
  if ((win === ANY_WINDOW && focusedWin !== null) || focusedWin === win) {
    globalShortcut.register(accelerator, callback);
  }
}

function indexOfShortcut(win, accelerator) {
  if (!windowsWithShortcuts.has(win)) {
    return -1;
  }

  const shortcuts = windowsWithShortcuts.get(win);
  let shortcutToUnregisterIdx = -1;
  shortcuts.some((s, idx) => {
    if (s.accelerator === accelerator) {
      shortcutToUnregisterIdx = idx;
      return true;
    }
    return false;
  });
  return shortcutToUnregisterIdx;
}

function unregister(win, accelerator) {
  if (arguments.length === 1 && isAccelerator(win)) {
    // unregister shortcut for any window in the app
    // win = accelerator
    unregister(ANY_WINDOW, win);
    return;
  }
  const shortcutToUnregisterIdx = indexOfShortcut(win, accelerator);

  if (shortcutToUnregisterIdx !== -1) {
    globalShortcut.unregister(accelerator);
    const shortcuts = windowsWithShortcuts.get(win);
    shortcuts.splice(shortcutToUnregisterIdx);
  }
}

function isRegistered(win, accelerator) {
  if (arguments.length === 1 && isAccelerator(win)) {
    // check shortcut for any window in the app
    // win = accelerator
    return isRegistered(ANY_WINDOW, win);
  }

  return indexOfShortcut(win, accelerator) !== -1;
}


app.on('browser-window-focus', (e, win) => {
  if (windowsWithShortcuts.has(ANY_WINDOW)) {
    registerAllShortcuts(ANY_WINDOW);
  }

  if (!windowsWithShortcuts.has(win)) {
    return;
  }

  registerAllShortcuts(win);
});

app.on('browser-window-blur', (e, win) => {
  if (windowsWithShortcuts.has(ANY_WINDOW)) {
    unregisterAllShortcuts(ANY_WINDOW);
  }

  if (!windowsWithShortcuts.has(win)) {
    return;
  }

  unregisterAllShortcuts(win);
});

module.exports = {
  register: register,
  unregister: unregister,
  isRegistered: isRegistered,
  unregisterAll: unregisterAll,
  enableAll: registerAllShortcuts,
  disableAll: unregisterAllShortcuts
};
