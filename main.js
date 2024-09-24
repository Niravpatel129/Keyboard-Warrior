const { app, globalShortcut, systemPreferences } = require('electron');
const path = require('path');
const { menubar } = require('menubar');
const { exec } = require('child_process');

let mb;

function startApp() {
  if (process.env.NODE_ENV === 'development') {
    try {
      require('electron-reloader')(module, {
        debug: true,
        watchRenderer: true,
      });
    } catch (_) {
      console.log('Error setting up hot reload');
    }
  }

  app.on('ready', () => {
    const gotTheLock = app.requestSingleInstanceLock();

    if (!gotTheLock) {
      console.log('Another instance is already running. Exiting...');
      app.quit();
      return;
    }

    console.log('App is ready');
    checkAccessibilityPermission();
  });

  function checkAccessibilityPermission() {
    if (process.platform !== 'darwin') {
      createMenubar();
      return;
    }

    const isTrusted = systemPreferences.isTrustedAccessibilityClient(true);

    if (isTrusted) {
      createMenubar();
    } else {
      console.log('Accessibility permission not granted. Exiting...');
      app.quit();
    }
  }

  function createMenubar() {
    console.log('Creating menubar...');
    mb = menubar({
      index: path.join(__dirname, 'index.html'),
      icon: path.join(__dirname, 'MenubarIconTemplate.png'),
      width: 400,
      height: 300,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    });

    mb.on('ready', () => {
      console.log('Menubar app is ready');

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
    });

    mb.on('after-close', () => {
      globalShortcut.unregister('Command+,');
    });
  }

  function captureHighlightedText() {
    console.log('Capturing highlighted text...');
    simulateCopy((highlightedText) => {
      console.log('Highlighted text:', highlightedText);

      if (highlightedText) {
        // Modify the text by adding 'test' between all words
        const modifiedText = highlightedText.split(' ').join(' test ');

        // Replace the selected text with the modified text
        replaceSelectedText(modifiedText);
      } else {
        console.log('No highlighted text found');
      }
    });
  }

  function simulateCopy(callback) {
    const { clipboard } = require('electron');
    const previousClipboardContent = clipboard.readText();

    const script = `
      tell application "System Events"
          keystroke "c" using {command down}
      end tell
    `;

    exec(`osascript -e '${script}'`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error simulating copy command: ${error}`);
        callback('');
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }
      // Wait a moment to ensure clipboard is updated
      setTimeout(() => {
        const copiedText = clipboard.readText();
        // Restore the previous clipboard content
        clipboard.writeText(previousClipboardContent);
        callback(copiedText);
      }, 100);
    });
  }

  function replaceSelectedText(text) {
    const { clipboard } = require('electron');
    const previousClipboardContent = clipboard.readText();

    // Set the clipboard to the modified text
    clipboard.writeText(text);

    // Simulate 'paste' command
    const script = `
      tell application "System Events"
          keystroke "v" using {command down}
      end tell
    `;

    exec(`osascript -e '${script}'`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error simulating paste command: ${error}`);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }
      // Wait a moment to ensure paste is completed
      setTimeout(() => {
        // Restore the previous clipboard content
        clipboard.writeText(previousClipboardContent);
        console.log('Selected text replaced successfully');
      }, 100);
    });
  }

  app.on('will-quit', () => {
    console.log('App will quit, unregistering all shortcuts');
    globalShortcut.unregisterAll();
  });
}

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
