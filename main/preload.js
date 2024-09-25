const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  closeWindow: () => ipcRenderer.send('close-window'),
  onHighlightedText: (callback) => ipcRenderer.on('highlighted-text', callback),
  removeListener: (channel, listener) => ipcRenderer.removeListener(channel, listener),
  requestHighlightedText: () => ipcRenderer.send('request-highlighted-text'),
});
