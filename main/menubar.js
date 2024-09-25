const path = require('path');
const url = require('url');
const electron = require('electron');

const { Tray, Menu, globalShortcut, app, BrowserWindow, screen, ipcMain } = electron;

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
      nodeIntegration: true,
      contextIsolation: false,
      // preload: path.join(__dirname, '..', 'preload.js'),
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

async function showPromptWindow() {
  const highlightedText = await captureHighlightedText(true);
  console.log('🚀  highlightedText:', highlightedText);

  if (promptWindow) {
    promptWindow.show();
    promptWindow.focus();
    promptWindow.webContents.send('highlighted-text', highlightedText);
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
      nodeIntegration: true,
      contextIsolation: false,
      // preload: path.join(__dirname, '..', 'preload.js'),
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
    promptWindow.webContents.send('highlighted-text', highlightedText);
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

// Set up IPC communication
ipcMain.on('request-highlighted-text', async (event) => {
  const highlightedText = await captureHighlightedText(true);
  event.reply('highlighted-text', highlightedText);
});

module.exports = createMenubar;
