const remote = require('remote');

const Menu = remote.require('menu');

export default function createMenu() {
  const menu = Menu.buildFromTemplate(menuTempl());
  Menu.setApplicationMenu(menu)
}

function menuTempl() {
  const menu = [];
  menu.push({
    label: 'James',
    submenu: [
      {
        label: 'About James',
        selector: 'hide:'
      }
    ]
  });
  menu.push({
    label: 'Edit',
    submenu: [
      {
        label: 'Undo',
        accelerator: 'Command+Z',
        selector: 'undo:'
      },
      {
        label: 'Redo',
        accelerator: 'Shift+Command+Z',
        selector: 'redo:'
      },
      {
        type: 'separator'
      },
      {
        label: 'Cut',
        accelerator: 'Command+X',
        selector: 'cut:'
      },
      {
        label: 'Copy',
        accelerator: 'Command+C',
        selector: 'copy:'
      },
      {
        label: 'Paste',
        accelerator: 'Command+V',
        selector: 'paste:'
      },
      {
        label: 'Select All',
        accelerator: 'Command+A',
        selector: 'selectAll:'
      }
    ]
  });
  //menu.push({
  //  label: 'View',
  //  submenu: [
  //    {
  //      label: 'Reload',
  //      accelerator: 'Command+R',
  //      click: function() {
  //        BrowserWindow.getFocusedWindow().reloadIgnoringCache();
  //      }
  //    },
  //    {
  //      label: 'Toggle DevTools',
  //      accelerator: 'Alt+Command+I',
  //      click: function() {
  //        BrowserWindow.getFocusedWindow().toggleDevTools();
  //      }
  //    }
  //  ]
  //});
  menu.push({
    label: 'Window',
    submenu: [
      {
        label: 'Minimize',
        accelerator: 'Command+M',
        selector: 'performMiniaturize:'
      },
      {
        label: 'Close',
        accelerator: 'Command+W',
        selector: 'performClose:'
      },
      {
        type: 'separator'
      },
      {
        label: 'Bring All to Front',
        selector: 'arrangeInFront:'
      }
    ]
  });
  return menu
}
