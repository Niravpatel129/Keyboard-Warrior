const electron = require('electron');
const { app, BrowserWindow, globalShortcut } = electron;

const checkAccessibilityPermission = require('./accessibility');
const createMenubar = require('./menubar');

let menubar = null;

function startApp() {
  const gotTheLock = app.requestSingleInstanceLock();

  if (!gotTheLock) {
    console.log('Another instance is already running. Quitting this instance...');
    app.quit();
    return;
  }

  app.on('second-instance', (event, commandLine, workingDirectory) => {
    console.log('Another instance tried to run. Focusing this instance...');
    // You could add logic here to show a window or perform some action
  });

  app.on('ready', () => {
    console.log('App is ready');
    if (process.platform === 'darwin') {
      app.dock.hide(); // Hide the dock icon on macOS
    }
    checkAccessibilityPermission(() => {
      if (!menubar) {
        // menubar = createMenubar();
      }
    });
  });

  app.on('window-all-closed', (event) => {
    event.preventDefault();
  });

  app.on('before-quit', () => {
    app.isQuitting = true;
  });

  app.on('will-quit', () => {
    console.log('App will quit, unregistering all shortcuts');
    globalShortcut.unregisterAll();
  });

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      if (!menubar) {
        menubar = createMenubar();
      }
    }
  });
}

module.exports = startApp;
