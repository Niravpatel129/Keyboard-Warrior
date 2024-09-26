// src/textCapture.js
const { exec } = require('child_process');
const { clipboard } = require('electron');
const { processTextWithAI } = require('./processTextWithAI');

async function captureHighlightedText(highlightOnly = false) {
  console.log('Capturing highlighted text...');
  try {
    const highlightedText = await simulateCopy();
    console.log('Highlighted text:', highlightedText);

    if (highlightedText && highlightedText.trim().length > 0) {
      if (highlightOnly) {
        console.log('🚀  highlightedText:', highlightedText);
        return highlightedText;
      } else {
        // Process the text using AI to fix grammar
        const modifiedText = await processTextWithAI(highlightedText);
        if (modifiedText && modifiedText.trim().length > 0) {
          // Replace the selected text with the modified text
          await replaceSelectedText(modifiedText);
          return modifiedText;
        } else {
          console.log('AI processing returned empty text. No changes made.');
          return highlightedText;
        }
      }
    } else {
      console.log('No highlighted text found or text is empty');
      return '';
    }
  } catch (error) {
    console.error('Error capturing highlighted text:', error);
    return '';
  }
}

function simulateCopy() {
  return new Promise((resolve, reject) => {
    const previousClipboardContent = clipboard.readText();

    const script = `
      tell application "System Events"
          keystroke "c" using {command down}
      end tell
    `;

    exec(`osascript -e '${script}'`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error simulating copy command: ${error}`);
        return resolve('');
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }
      // Wait until the clipboard content changes or timeout occurs
      let attempts = 0;
      const maxAttempts = 10;
      const interval = 50; // milliseconds
      const checkClipboard = () => {
        const copiedText = clipboard.readText();
        if (copiedText !== previousClipboardContent) {
          // Restore the previous clipboard content
          clipboard.writeText(previousClipboardContent);
          return resolve(copiedText);
        } else {
          attempts++;
          if (attempts >= maxAttempts) {
            console.log('Nothing copied. User might not have selected anything.');
            return resolve('');
          } else {
            setTimeout(checkClipboard, interval);
          }
        }
      };
      checkClipboard();
    });
  });
}

function replaceSelectedText(text) {
  return new Promise((resolve, reject) => {
    if (typeof text !== 'string' || text.trim().length === 0) {
      console.error('Invalid text provided for replacement');
      return resolve();
    }

    const previousClipboardContent = clipboard.readText();

    // Set the clipboard to the modified text
    clipboard.writeText(text);

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
        return resolve();
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }
      // Wait until the paste operation is likely completed
      setTimeout(() => {
        // Restore the previous clipboard content
        clipboard.writeText(previousClipboardContent);
        console.log('Selected text replaced successfully');
        resolve();
      }, 100);
    });
  });
}

module.exports = captureHighlightedText;
