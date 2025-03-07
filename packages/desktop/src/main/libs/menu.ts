import { app, BrowserWindow, Menu, shell } from 'electron';
import { transports } from 'electron-log';
import { Config } from 'src/main/config';

export const createMenu = (mainWindow: BrowserWindow): Menu => {
  const menu: any = [
    {
      label: 'Application',
      submenu: [
        {
          id: 'MENU_OPEN_SETTINGS',
          label: 'Settings',
          accelerator: 'CmdOrCtrl+,',
          click: () => {
            mainWindow.webContents.send('APP_MENU', 'OPEN_SETTINGS');
          }
        },
        { type: 'separator' }
      ]
    },
    {
      label: 'File',
      submenu: [
        {
          id: 'MENU_NEW_ENVIRONMENT',
          label: 'New environment',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.send('APP_MENU', 'NEW_ENVIRONMENT');
          }
        },
        {
          id: 'MENU_NEW_ENVIRONMENT_CLIPBOARD',
          label: 'New environment from clipboard',
          click: () => {
            mainWindow.webContents.send(
              'APP_MENU',
              'NEW_ENVIRONMENT_CLIPBOARD'
            );
          }
        },
        {
          id: 'MENU_OPEN_ENVIRONMENT',
          label: 'Open environment',
          accelerator: 'CmdOrCtrl+O',
          click: () => {
            mainWindow.webContents.send('APP_MENU', 'OPEN_ENVIRONMENT');
          }
        },
        {
          id: 'MENU_DUPLICATE_ENVIRONMENT',
          label: 'Duplicate current environment',
          accelerator: 'CmdOrCtrl+D',
          click: () => {
            mainWindow.webContents.send('APP_MENU', 'DUPLICATE_ENVIRONMENT');
          }
        },
        { type: 'separator' },
        {
          id: 'MENU_CLOSE_ENVIRONMENT',
          label: 'Close active environment',
          accelerator: 'CmdOrCtrl+F4',
          click: () => {
            mainWindow.webContents.send('APP_MENU', 'CLOSE_ENVIRONMENT');
          }
        },
        { type: 'separator' }
      ]
    }
  ];

  const handleZoomIn = () => {
    const menuInstance = Menu.getApplicationMenu();
    menuInstance.getMenuItemById('MENU_ZOOM_OUT').enabled = true;

    if (mainWindow.webContents.zoomFactor >= 1.3) {
      return;
    }

    mainWindow.webContents.zoomFactor += 0.1;

    if (mainWindow.webContents.zoomFactor >= 1.3) {
      menuInstance.getMenuItemById('MENU_ZOOM_IN').enabled = false;
    }
  };

  const handleZoomOut = () => {
    const menuInstance = Menu.getApplicationMenu();
    menuInstance.getMenuItemById('MENU_ZOOM_IN').enabled = true;

    if (mainWindow.webContents.zoomFactor <= 0.8) {
      return;
    }

    mainWindow.webContents.zoomFactor -= 0.1;

    if (mainWindow.webContents.zoomFactor <= 0.8) {
      menuInstance.getMenuItemById('MENU_ZOOM_OUT').enabled = false;
    }
  };

  const handleZoomReset = () => {
    const menuInstance = Menu.getApplicationMenu();
    menuInstance.getMenuItemById('MENU_ZOOM_IN').enabled = true;
    menuInstance.getMenuItemById('MENU_ZOOM_OUT').enabled = true;

    mainWindow.webContents.zoomFactor = 1;
  };

  if (process.platform === 'darwin') {
    menu[0].submenu.push(
      { label: 'Hide', role: 'hide' },
      { role: 'hideOthers' },
      { type: 'separator' }
    );
  }

  menu[0].submenu.push({ label: 'Quit', role: 'quit' });

  // add edit menu for mac (for copy/paste)
  if (process.platform === 'darwin') {
    menu.push({
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
        { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
        { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
        { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
        {
          label: 'Select All',
          accelerator: 'CmdOrCtrl+A',
          selector: 'selectAll:'
        }
      ]
    });
  }

  menu.push({
    label: 'Routes',
    submenu: [
      {
        id: 'MENU_NEW_ROUTE',
        label: 'Add new route',
        accelerator: 'Shift+CmdOrCtrl+R',
        click: () => {
          mainWindow.webContents.send('APP_MENU', 'NEW_ROUTE');
        }
      },
      {
        id: 'MENU_NEW_ROUTE_CLIPBOARD',
        label: 'Add route from clipboard',
        click: () => {
          mainWindow.webContents.send('APP_MENU', 'NEW_ROUTE_CLIPBOARD');
        }
      },
      {
        id: 'MENU_DUPLICATE_ROUTE',
        label: 'Duplicate current route',
        accelerator: 'Shift+CmdOrCtrl+D',
        click: () => {
          mainWindow.webContents.send('APP_MENU', 'DUPLICATE_ROUTE');
        }
      },
      { type: 'separator' },
      {
        id: 'MENU_DELETE_ROUTE',
        label: 'Delete current route',
        accelerator: 'Alt+Shift+CmdOrCtrl+U',
        click: () => {
          mainWindow.webContents.send('APP_MENU', 'DELETE_ROUTE');
        }
      }
    ]
  });

  menu.push({
    label: 'Run',
    submenu: [
      {
        id: 'MENU_START_ENVIRONMENT',
        label: 'Start/Stop/Reload current environment',
        accelerator: 'Shift+CmdOrCtrl+S',
        click: () => {
          mainWindow.webContents.send('APP_MENU', 'START_ENVIRONMENT');
        }
      },
      {
        id: 'MENU_START_ALL_ENVIRONMENTS',
        label: 'Start/Stop/Reload all environments',
        accelerator: 'Shift+CmdOrCtrl+A',
        click: () => {
          mainWindow.webContents.send('APP_MENU', 'START_ALL_ENVIRONMENTS');
        }
      }
    ]
  });

  menu.push({
    label: 'Navigate',
    submenu: [
      {
        id: 'MENU_PREVIOUS_ENVIRONMENT',
        label: 'Select previous environment',
        accelerator: 'CmdOrCtrl+Up',
        click: () => {
          mainWindow.webContents.send('APP_MENU', 'PREVIOUS_ENVIRONMENT');
        }
      },
      {
        id: 'MENU_NEXT_ENVIRONMENT',
        label: 'Select next environment',
        accelerator: 'CmdOrCtrl+Down',
        click: () => {
          mainWindow.webContents.send('APP_MENU', 'NEXT_ENVIRONMENT');
        }
      }
    ]
  });

  menu.push({
    label: 'Import/export',
    submenu: [
      {
        id: 'MENU_IMPORT_OPENAPI_FILE',
        label: 'Import Swagger v2/OpenAPI v3 (JSON or YAML)',
        click: () => {
          mainWindow.webContents.send('APP_MENU', 'IMPORT_OPENAPI_FILE');
        }
      },
      {
        id: 'MENU_EXPORT_OPENAPI_FILE',
        label: 'Export current environment to OpenAPI v3 (JSON)',
        click: () => {
          mainWindow.webContents.send('APP_MENU', 'EXPORT_OPENAPI_FILE');
        }
      }
    ]
  });

  menu.push({
    label: 'View',
    submenu: [
      {
        id: 'MENU_ZOOM_OUT',
        label: 'Zoom out',
        accelerator: 'CmdOrCtrl+NumSub',
        click: handleZoomOut
      },
      // zoom out aliases
      {
        label: 'Zoom out',
        accelerator: 'CmdOrCtrl+-',
        click: handleZoomOut,
        visible: false
      },
      {
        label: 'Reset zoom',
        accelerator: 'CmdOrCtrl+Num0',
        click: handleZoomReset
      },
      // reset zoom aliases
      {
        label: 'Reset zoom',
        accelerator: 'CmdOrCtrl+0',
        click: handleZoomReset,
        visible: false
      },
      {
        id: 'MENU_ZOOM_IN',
        label: 'Zoom in',
        accelerator: 'CmdOrCtrl+Plus',
        click: handleZoomIn
      },
      // zoom in aliases
      {
        label: 'Zoom in',
        accelerator: 'CmdOrCtrl+NumAdd',
        click: handleZoomIn,
        visible: false
      },
      {
        label: 'Zoom in',
        accelerator: 'CmdOrCtrl+=',
        click: handleZoomIn,
        visible: false
      }
    ]
  });

  menu.push({
    label: 'Tools',
    submenu: [
      {
        label: 'CLI',
        click: () => {
          shell.openExternal('https://mockoon.com/cli/');
        }
      },
      {
        label: 'Docker repository',
        click: () => {
          shell.openExternal('https://hub.docker.com/u/mockoon');
        }
      },
      {
        label: 'Mock samples',
        click: () => {
          shell.openExternal('https://mockoon.com/mock-samples/');
        }
      },
      { type: 'separator' },
      {
        label: 'Show app data folder',
        click: () => {
          shell.showItemInFolder(app.getPath('userData'));
        }
      },
      {
        label: 'Show logs folder',
        click: () => {
          if (transports?.file?.getFile().path) {
            shell.showItemInFolder(transports.file.getFile().path);
          }
        }
      }
    ]
  });

  menu.push({
    label: 'Help',
    submenu: [
      {
        label: 'Official website',
        click: () => {
          shell.openExternal('https://mockoon.com');
        }
      },
      {
        label: 'Docs',
        click: () => {
          shell.openExternal('https://mockoon.com/docs');
        }
      },
      {
        label: 'Tutorials',
        click: () => {
          shell.openExternal('https://mockoon.com/tutorials/');
        }
      },
      {
        label: 'Get support',
        click: () => {
          shell.openExternal('https://mockoon.com/contact/');
        }
      },
      { type: 'separator' },
      {
        label: `Release notes v${Config.appVersion}`,
        click: () => {
          mainWindow.webContents.send('APP_MENU', 'OPEN_CHANGELOG');
        }
      }
    ]
  });

  return Menu.buildFromTemplate(menu);
};

export const toggleEnvironmentMenuItems = (state: boolean) => {
  const menu = Menu.getApplicationMenu();
  [
    'MENU_DUPLICATE_ENVIRONMENT',
    'MENU_CLOSE_ENVIRONMENT',
    'MENU_NEW_ROUTE',
    'MENU_DUPLICATE_ROUTE',
    'MENU_DELETE_ROUTE',
    'MENU_START_ENVIRONMENT',
    'MENU_START_ALL_ENVIRONMENTS',
    'MENU_PREVIOUS_ENVIRONMENT',
    'MENU_NEXT_ENVIRONMENT',
    'MENU_PREVIOUS_ROUTE',
    'MENU_NEXT_ROUTE',
    'MENU_EXPORT_OPENAPI_FILE'
  ].forEach((id) => {
    const menuItem = menu?.getMenuItemById(id);

    if (menuItem) {
      menuItem.enabled = state;
    }
  });
};

export const toggleRouteMenuItems = (state: boolean) => {
  const menu = Menu.getApplicationMenu();
  [
    'MENU_DUPLICATE_ROUTE',
    'MENU_DELETE_ROUTE',
    'MENU_PREVIOUS_ROUTE',
    'MENU_NEXT_ROUTE'
  ].forEach((id) => {
    const menuItem = menu?.getMenuItemById(id);

    if (menuItem) {
      menuItem.enabled = state;
    }
  });
};
