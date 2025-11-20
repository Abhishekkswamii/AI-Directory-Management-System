const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  // Directory operations
  selectDirectory: () => ipcRenderer.invoke('select-directory'),
  readDirectory: (dirPath) => ipcRenderer.invoke('read-directory', dirPath),
  readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
  
  // File organization
  organizeFiles: (data) => ipcRenderer.invoke('organize-files', data),
  undoOrganization: (undoLogPath) => ipcRenderer.invoke('undo-organization', undoLogPath),
  openFolder: (folderPath) => ipcRenderer.invoke('open-folder', folderPath),
  
  // Window controls
  windowMinimize: () => ipcRenderer.send('window-minimize'),
  windowMaximize: () => ipcRenderer.send('window-maximize'),
  windowFullscreen: () => ipcRenderer.send('window-fullscreen'),
  windowClose: () => ipcRenderer.send('window-close'),
  
  // Platform info
  platform: process.platform,
});
