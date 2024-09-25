// src/app.js
const { app, BrowserWindow } = require('electron');
const path = require('path');

const checkAccessibilityPermission = require('./accessibility');

function startApp() {
  const gotTheLock = app.requestSingleInstanceLock();

  if (!gotTheLock) {
    console.log('Another instance is already running. Quitting this instance...');
    app.quit();
    return;
  }

  app.on('second-instance', (event, commandLine, workingDirectory) => {
    console.log('Another instance tried to run. Quitting the new instance...');
    app.quit();
  });

  app.on('ready', () => {
    // const win = new BrowserWindow({
    //   width: 800,
    //   height: 600,
    //   webPreferences: {
    //     nodeIntegration: true,
    //     contextIsolation: false,
    //   },
    // });

    // win.loadFile(path.join(__dirname, '../dist/index.html'));

    console.log('App is ready');
    checkAccessibilityPermission();
    app.dock.hide(); // Hide the dock icon
  });

  app.on('will-quit', () => {
    console.log('App will quit, unregistering all shortcuts');
    const { globalShortcut } = require('electron');
    globalShortcut.unregisterAll();
  });
}

module.exports = startApp;
