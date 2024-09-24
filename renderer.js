const { ipcRenderer } = require('electron');

const textArea = document.getElementById('textArea');
const fixGrammarBtn = document.getElementById('fixGrammar');
const rewordBtn = document.getElementById('reword');

ipcRenderer.on('show-popup', () => {
  // This is where we'd normally focus the window, but Electron does this automatically
});

ipcRenderer.on('clipboard-text', (event, text) => {
  textArea.value = text;
});

fixGrammarBtn.addEventListener('click', () => {
  // Placeholder for grammar fixing logic
  console.log('Fix grammar clicked');
});

rewordBtn.addEventListener('click', () => {
  // Placeholder for rewording logic
  console.log('Reword clicked');
});
