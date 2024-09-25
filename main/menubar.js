// src/menubar.js
const path = require('path');
const url = require('url');
const { Tray, Menu, globalShortcut, app, BrowserWindow, screen } = require('electron');
const captureHighlightedText = require('./textCapture');

function createTray() {
  console.log('Creating tray...');
  const tray = new Tray(path.join(__dirname, '../assets/MenubarIconTemplate.png'));

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Settings',
      click: () => {
        let settingsWindow = new BrowserWindow({
          width: 300,
          height: 400,
          webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
          },
        });

        const settingsUrl = url.format({
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

  registerGlobalShortcut();

  app.on('will-quit', () => {
    globalShortcut.unregister('Command+,');
  });
}

function registerGlobalShortcut() {
  try {
    const registered = globalShortcut.register('Command+,', showPromptWindow);

    if (!registered) {
      console.log('Shortcut registration failed');
    }
  } catch (error) {
    console.error('Error registering shortcut:', error);
  }
}

function showPromptWindow() {
  console.log('Global shortcut Command+, pressed');

  const cursorPosition = screen.getCursorScreenPoint();

  const promptWindow = new BrowserWindow({
    width: 400,
    height: 200,
    x: cursorPosition.x,
    y: cursorPosition.y,
    alwaysOnTop: true,
    frame: false,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
    },
  });

  const settingsUrl = url.format({
    pathname: path.join(__dirname, '..', 'dist', 'index.html'),
    protocol: 'file:',
    slashes: true,
    hash: 'prompt',
  });

  promptWindow.loadURL(settingsUrl);

  promptWindow.once('ready-to-show', () => {
    promptWindow.show();
    promptWindow.focus();
  });

  // Uncomment the following line if you want to capture highlighted text
  // captureHighlightedText();
}

module.exports = createTray;
