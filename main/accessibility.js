// src/accessibility.js
const { app, systemPreferences } = require('electron');
const createMenubar = require('./menubar');

function checkAccessibilityPermission() {
  if (process.platform !== 'darwin') {
    createMenubar();
    return;
  }

  const isTrusted = systemPreferences.isTrustedAccessibilityClient(true);

  if (isTrusted) {
    createMenubar();
  } else {
    console.log('Accessibility permission not granted. Exiting.');
    app.quit();
  }
}

module.exports = checkAccessibilityPermission;
