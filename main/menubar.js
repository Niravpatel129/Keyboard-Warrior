// menubar.js
const path = require('path');
const url = require('url');
const electron = require('electron');
const osascript = require('node-osascript');
const captureHighlightedText = require('./textCapture');

const { Tray, Menu, globalShortcut, app, BrowserWindow, screen, ipcMain } = electron;

const isDev = process.env.NODE_ENV === 'development';
let settingsWindow = null;
let promptWindow = null;
let previousApp = null;

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
    },
  });

  const settingsUrl = isDev
    ? 'http://localhost:8080/#settings'
    : url.format({
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
  console.log('Highlighted text:', highlightedText); // Log the highlighted text

  // Get the frontmost application
  osascript.execute(
    `tell application "System Events" to get name of first application process whose frontmost is true`,
    (err, result) => {
      if (err) {
        console.error('Error getting frontmost application:', err);
        return;
      }
      previousApp = result;

      // Pass highlightedText here
      createPromptWindow(highlightedText);
    },
  );
}

function createPromptWindow(highlightedText) {
  if (promptWindow) {
    promptWindow.show();
    promptWindow.focus();
    // Send highlightedText to the renderer process
    // if (highlightedText) {
    promptWindow.webContents.send('highlighted-text', highlightedText);
    // }
    return;
  }

  const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;

  const windowWidth = Math.round(screenWidth * 0.4); // 40% of screen width
  const windowHeight = Math.round(screenHeight * 0.1); // 30% of screen height
  const bottomMargin = Math.round(screenHeight * 0.03); // 5% of screen height

  promptWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    x: Math.round((screenWidth - windowWidth) / 2),
    y: screenHeight - windowHeight - bottomMargin,
    alwaysOnTop: true,
    frame: false,
    show: false,
    movable: true,
    resizable: false,
    titleBarStyle: 'customButtonsOnHover',
    trafficLightPosition: { x: -100, y: -100 },
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  const promptUrl = isDev
    ? 'http://localhost:8080/#prompt'
    : url.format({
        pathname: path.join(__dirname, '..', 'dist', 'index.html'),
        protocol: 'file:',
        slashes: true,
        hash: 'prompt',
      });

  promptWindow.loadURL(promptUrl);

  promptWindow.once('ready-to-show', () => {
    promptWindow.show();
    promptWindow.focus();
    console.log('🚀  highlightedText:', highlightedText);
    // Send highlightedText to the renderer process
    // if (highlightedText) {
    promptWindow.webContents.send('highlighted-text', highlightedText);
    // }
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

function replaceSelectedText(text) {
  console.log('🚀  text:', text);

  const { clipboard } = electron;
  const previousClipboardContent = clipboard.readText();

  // Set the clipboard to the new text
  clipboard.writeText(text);

  // Simulate 'paste' command
  const script = `
    tell application "${previousApp}"
      activate
    end tell
    tell application "System Events"
      keystroke "v" using {command down}
    end tell
  `;

  osascript.execute(script, (err) => {
    if (err) {
      console.error('Error executing AppleScript:', err);
      // Restore the previous clipboard content immediately in case of error
      clipboard.writeText(previousClipboardContent);
      return;
    }
    console.log('Replaced selected text');

    // Restore the previous clipboard content after a short delay
    setTimeout(() => {
      clipboard.writeText(previousClipboardContent);
    }, 100);
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
ipcMain.on('submit-input', (event, input) => {
  const newText = input;
  if (promptWindow) {
    promptWindow.close();
  }
  replaceSelectedText(newText);
});

module.exports = createMenubar;
