// src/menubar.js
const path = require('path');
const { Tray, Menu, globalShortcut, app } = require('electron');
const captureHighlightedText = require('./textCapture');

function createTray() {
  console.log('Creating tray...');
  const tray = new Tray(path.join(__dirname, '../assets/MenubarIconTemplate.png'));

  const contextMenu = Menu.buildFromTemplate([{ label: 'Quit', click: () => app.quit() }]);

  tray.setContextMenu(contextMenu);

  tray.on('right-click', () => {
    tray.popUpContextMenu();
  });

  tray.on('double-click', () => {
    tray.popUpContextMenu();
  });

  try {
    const registered = globalShortcut.register('Command+,', () => {
      console.log('Global shortcut Command+, pressed');
      captureHighlightedText();
    });

    if (!registered) {
      console.log('Shortcut registration failed');
    }
  } catch (error) {
    console.error('Error registering shortcut:', error);
  }

  app.on('will-quit', () => {
    globalShortcut.unregister('Command+,');
  });
}

module.exports = createTray;
