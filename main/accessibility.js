const electron = require('electron');

const { app, systemPreferences } = electron;

function checkAccessibilityPermission(callback) {
  if (process.platform !== 'darwin') {
    callback();
    return;
  }

  const isTrusted = systemPreferences.isTrustedAccessibilityClient(true);

  if (isTrusted) {
    callback();
  } else {
    console.log('Accessibility permission not granted. Exiting.');
    app.quit();
  }
}

module.exports = checkAccessibilityPermission;
