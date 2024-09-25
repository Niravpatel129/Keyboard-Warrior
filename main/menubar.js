// src/menubar.js
const path = require('path');
const url = require('url');
const { Tray, Menu, globalShortcut, app, BrowserWindow } = require('electron');
const captureHighlightedText = require('./textCapture');

function createTray() {
  console.log('Creating tray...');
  const tray = new Tray(path.join(__dirname, '../assets/MenubarIconTemplate.png'));

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Settings',
      click: () => {
        const settingsWindow = new BrowserWindow({
          width: 300,
          height: 400,
          webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
          },
        });

        const settingsUrl =
          process.env.NODE_ENV === 'development123'
            ? 'http://localhost:8080/'
            : url.format({
                pathname: path.join(__dirname, '..', 'dist', 'index.html'),
                protocol: 'file:',
                slashes: true,
                hash: 'settings',
              });

        settingsWindow.loadURL(settingsUrl);
        settingsWindow.on('closed', () => {
          settingsWindow = null;
        });
      },
    },
    { label: 'Quit', click: () => app.quit() },
  ]);

  tray.setContextMenu(contextMenu);

  tray.on('right-click', () => {
    tray.popUpContextMenu();
  });

  tray.on('double-click', () => {
    tray.popUpContextMenu();
  });

  try {
    const registered = globalShortcut.register('Command+,', () => {
      console.log('Global shortcut Command+, pressed');
      captureHighlightedText();
    });

    if (!registered) {
      console.log('Shortcut registration failed');
    }
  } catch (error) {
    console.error('Error registering shortcut:', error);
  }

  app.on('will-quit', () => {
    globalShortcut.unregister('Command+,');
  });
}

module.exports = createTray;
