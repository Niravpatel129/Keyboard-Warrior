// src/app.js
const { app } = require('electron');
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
    console.log('App is ready');
    checkAccessibilityPermission();
  });

  app.on('will-quit', () => {
    console.log('App will quit, unregistering all shortcuts');
    const { globalShortcut } = require('electron');
    globalShortcut.unregisterAll();
  });
}

module.exports = startApp;
