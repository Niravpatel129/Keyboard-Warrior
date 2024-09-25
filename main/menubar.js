const path = require('path');
const url = require('url');
const { Tray, Menu, globalShortcut, app, BrowserWindow, screen } = require('electron');
const captureHighlightedText = require('./textCapture');
let settingsWindow = null;
let promptWindow = null;

function createMenubar() {
  console.log('Creating menubar...');
  const tray = new Tray(path.join(__dirname, '../assets/MenubarIconTemplate.png'));

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Settings',
      click: createSettingsWindow,
    },
    {
      label: 'Quit',
      click: () => {
        app.isQuitting = true;
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);

  tray.on('right-click', () => {
    tray.popUpContextMenu();
  });

  tray.on('double-click', () => {
    tray.popUpContextMenu();
  });

  registerGlobalShortcut();

  return tray;
}

function createSettingsWindow() {
  if (settingsWindow) {
    settingsWindow.show();
    settingsWindow.focus();
    return;
  }

  settingsWindow = new BrowserWindow({
    width: 300,
    height: 400,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  const settingsUrl = url.format({
    pathname: path.join(__dirname, '..', 'dist', 'index.html'),
    protocol: 'file:',
    slashes: true,
    hash: 'settings',
  });

  settingsWindow.loadURL(settingsUrl);

  settingsWindow.once('ready-to-show', () => {
    settingsWindow.show();
  });

  settingsWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      settingsWindow.hide();
    }
  });

  settingsWindow.on('closed', () => {
    settingsWindow = null;
  });
}

function showPromptWindow() {
  captureHighlightedText();

  if (promptWindow) {
    promptWindow.show();
    promptWindow.focus();
    return;
  }

  const cursorPosition = screen.getCursorScreenPoint();

  promptWindow = new BrowserWindow({
    width: 400,
    height: 200,
    x: cursorPosition.x,
    y: cursorPosition.y,
    alwaysOnTop: true,
    frame: false,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  const promptUrl = url.format({
    pathname: path.join(__dirname, '..', 'dist', 'index.html'),
    protocol: 'file:',
    slashes: true,
    hash: 'prompt',
  });

  promptWindow.loadURL(promptUrl);

  promptWindow.once('ready-to-show', () => {
    promptWindow.show();
    promptWindow.focus();
  });

  promptWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      promptWindow.hide();
    }
  });

  promptWindow.on('closed', () => {
    promptWindow = null;
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

module.exports = createMenubar;
