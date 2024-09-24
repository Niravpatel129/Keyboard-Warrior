// src/textCapture.js
const { exec } = require('child_process');
const { clipboard } = require('electron');
const { processTextWithAI } = require('./processTextWithAI');

function captureHighlightedText() {
  console.log('Capturing highlighted text...');
  simulateCopy((highlightedText) => {
    console.log('Highlighted text:', highlightedText);

    if (highlightedText) {
      // Process the text using AI to fix grammar
      processTextWithAI(highlightedText, (modifiedText) => {
        // Replace the selected text with the modified text
        replaceSelectedText(modifiedText);
      });
    } else {
      console.log('No highlighted text found');
    }
  });
}

function simulateCopy(callback) {
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

module.exports = captureHighlightedText;
