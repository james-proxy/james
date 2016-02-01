const remote = require('remote');

const Menu = remote.require('menu');
const shell = require('electron').shell;

function menuTempl() {
  const menu = [];
  menu.push({
    label: 'James',
    submenu: [
      {
        label: 'About James',
        click: function() {
          shell.openExternal('https://github.com/james-proxy/james')
        }
      }
    ]
  });
  menu.push({
    label: 'Edit',
    submenu: [
      {
        label: 'Undo',
        accelerator: 'CommandOrControl+Z',
        role: 'undo'
      },
      {
        label: 'Redo',
        accelerator: 'Shift+CommandOrControl+Z',
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        label: 'Cut',
        accelerator: 'CommandOrControl+X',
        role: 'cut'
      },
      {
        label: 'Copy',
        accelerator: 'CommandOrControl+C',
        role: 'copy'
      },
      {
        label: 'Paste',
        accelerator: 'CommandOrControl+V',
        role: 'paste'
      },
      {
        label: 'Select All',
        accelerator: 'CommandOrControl+A',
        role: 'selectAll'
      }
    ]
  });
  menu.push({
    label: 'Window',
    submenu: [
      {
        label: 'Minimize',
        accelerator: 'CommandOrControl+M',
        role: 'minimize'
      },
      {
        label: 'Close',
        accelerator: 'CommandOrControl+Q',
        role: 'close'
      }
    ]
  });
  return menu;
}

export default function createMenu() {
  const menu = Menu.buildFromTemplate(menuTempl());
  Menu.setApplicationMenu(menu);
}
