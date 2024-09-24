// src/textCapture.js
const { exec } = require('child_process');
const { clipboard } = require('electron');
const { processTextWithAI } = require('./processTextWithAI');
const { playSound } = require('./soundPlayer');
const path = require('path');

function captureHighlightedText() {
  console.log('Capturing highlighted text...');
  simulateCopy((highlightedText) => {
    console.log('Highlighted text:', highlightedText);

    if (highlightedText && highlightedText.trim().length > 0) {
      // Process the text using AI to fix grammar
      processTextWithAI(highlightedText, (modifiedText) => {
        if (modifiedText && modifiedText.trim().length > 0) {
          // Replace the selected text with the modified text
          replaceSelectedText(modifiedText);
        } else {
          console.log('AI processing returned empty text. No changes made.');
        }
      });
    } else {
      console.log('No highlighted text found or text is empty');
    }
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
      // Restore the previous clipboard content
      clipboard.writeText(previousClipboardContent);
      callback(copiedText);
    }, 100);
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
    const soundPath = path.join(__dirname, '..', 'assets', 'sounds', 'paste.wav');
    // playSound(soundPath);
    // Wait a moment to ensure paste is completed
    setTimeout(() => {
      // Restore the previous clipboard content
      clipboard.writeText(previousClipboardContent);
      console.log('Selected text replaced successfully');
    }, 100);
  });
}

module.exports = captureHighlightedText;
