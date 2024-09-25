// src/main.js
const startApp = require('./app');

startApp();

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  if (
    error instanceof TypeError &&
    error.message.includes("Cannot read properties of undefined (reading 'webContents')")
  ) {
    console.error(
      'Error: Menubar window is not available. This might happen if the app is quitting or the window is not yet created.',
    );
  }
});
