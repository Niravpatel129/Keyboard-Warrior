// src/textCapture.js
const { exec } = require('child_process');
const { clipboard } = require('electron');
const { processTextWithAI } = require('./processTextWithAI');

function captureHighlightedText(highlightOnly = false) {
  console.log('Capturing highlighted text...');
  return new Promise((resolve, reject) => {
    simulateCopy((highlightedText) => {
      console.log('Highlighted text:', highlightedText);

      if (highlightedText && highlightedText.trim().length > 0) {
        if (highlightOnly) {
          resolve(highlightedText);
        } else {
          // Process the text using AI to fix grammar
          processTextWithAI(highlightedText, (modifiedText) => {
            if (modifiedText && modifiedText.trim().length > 0) {
              // Replace the selected text with the modified text
              replaceSelectedText(modifiedText);
              resolve(modifiedText);
            } else {
              console.log('AI processing returned empty text. No changes made.');
              resolve(highlightedText);
            }
          });
        }
      } else {
        console.log('No highlighted text found or text is empty');
        resolve('');
      }
    });
  });
}

function simulateCopy(callback) {
  if (typeof callback !== 'function') {
    console.error('Invalid callback provided to simulateCopy');
    return;
  }

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
      if (copiedText === previousClipboardContent) {
        console.log('Nothing copied. User might not have selected anything.');
        callback('');
      } else {
        // Restore the previous clipboard content
        clipboard.writeText(previousClipboardContent);
        callback(copiedText);
      }
    }, 0);
  });
}

function replaceSelectedText(text) {
  if (typeof text !== 'string' || text.trim().length === 0) {
    console.error('Invalid text provided for replacement');
    return;
  }

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
      // Restore the previous clipboard content immediately in case of error
      clipboard.writeText(previousClipboardContent);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }
    // Play sound after pasting
    // playSound(soundPath);
    // Wait a moment to ensure paste is completed
    setTimeout(() => {
      // Restore the previous clipboard content
      clipboard.writeText(previousClipboardContent);
      console.log('Selected text replaced successfully');
    }, 0);
  });
}

module.exports = captureHighlightedText;
