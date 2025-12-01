const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    frame: false, // Custom window controls
    backgroundColor: '#ffffff',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Load the app
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../client/dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC Handlers

// Select directory
ipcMain.handle('select-directory', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
  });
  
  if (result.canceled) {
    return null;
  }
  
  return result.filePaths[0];
});

// Read directory recursively
ipcMain.handle('read-directory', async (event, dirPath) => {
  const files = [];
  
  async function scanDir(currentPath, relativePath = '') {
    const entries = await fs.readdir(currentPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);
      const relPath = path.join(relativePath, entry.name);
      
      if (entry.isDirectory()) {
        await scanDir(fullPath, relPath);
      } else {
        const stats = await fs.stat(fullPath);
        files.push({
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: entry.name,
          path: relPath,
          fullPath: fullPath,
          type: path.extname(entry.name).slice(1).toLowerCase() || 'unknown',
          size: stats.size,
        });
      }
    }
  }
  
  await scanDir(dirPath);
  return files;
});

// Read file content
ipcMain.handle('read-file', async (event, filePath) => {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return content;
  } catch (error) {
    console.error('Error reading file:', error);
    return null;
  }
});

// Organize files (move to new structure)
ipcMain.handle('organize-files', async (event, { basePath, structure, undoLogPath }) => {
  const undoLog = {
    timestamp: new Date().toISOString(),
    basePath,
    operations: [],
  };

  try {
    // Create folder structure and move files
    for (const [category, subcategories] of Object.entries(structure)) {
      for (const [subcategory, folders] of Object.entries(subcategories)) {
        for (const [folder, fileList] of Object.entries(folders)) {
          const targetDir = path.join(basePath, category, subcategory, folder);
          
          // Create directory
          await fs.mkdir(targetDir, { recursive: true });
          
          // Move files
          for (const file of fileList) {
            const sourcePath = file.fullPath;
            const targetPath = path.join(targetDir, file.name);
            
            // Check if file exists
            if (fsSync.existsSync(sourcePath)) {
              // Move file
              await fs.rename(sourcePath, targetPath);
              
              // Log for undo
              undoLog.operations.push({
                type: 'move',
                from: sourcePath,
                to: targetPath,
                fileName: file.name,
              });
            }
          }
        }
      }
    }
    
    // Save undo log
    await fs.writeFile(undoLogPath, JSON.stringify(undoLog, null, 2));
    
    return { success: true, undoLogPath };
  } catch (error) {
    console.error('Error organizing files:', error);
    return { success: false, error: error.message };
  }
});

// Undo organization
ipcMain.handle('undo-organization', async (event, undoLogPath) => {
  try {
    const logContent = await fs.readFile(undoLogPath, 'utf-8');
    const undoLog = JSON.parse(logContent);
    
    // Reverse operations
    for (const operation of undoLog.operations.reverse()) {
      if (operation.type === 'move') {
        await fs.rename(operation.to, operation.from);
      }
    }
    
    // Delete undo log
    await fs.unlink(undoLogPath);
    
    return { success: true };
  } catch (error) {
    console.error('Error undoing organization:', error);
    return { success: false, error: error.message };
  }
});

// Open folder in file explorer
ipcMain.handle('open-folder', async (event, folderPath) => {
  const { shell } = require('electron');
  await shell.openPath(folderPath);
});

// Window controls
ipcMain.on('window-minimize', () => {
  mainWindow.minimize();
});

ipcMain.on('window-maximize', () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});

ipcMain.on('window-fullscreen', () => {
  if (mainWindow.isFullScreen()) {
    mainWindow.setFullScreen(false);
  } else {
    mainWindow.setFullScreen(true);
  }
});

ipcMain.on('window-close', () => {
  mainWindow.close();
});
