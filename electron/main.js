// Asegúrate de ejecutar este archivo con Node.js en modo CommonJS, no como módulo ES.
// Si tienes "type": "module" en package.json, ejecuta Electron así:
// npx electron electron/main.js --require esm-fix.js
// O bien, elimina "type": "module" de package.json para este proyecto de escritorio.
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    icon: path.join(__dirname, '../public/vite.svg'),
  });

  // Carga la app de Vite en modo producción
  win.loadFile(path.join(__dirname, '../dist/index.html')).catch((err) => {
    console.error('Error cargando index.html:', err);
    win.webContents.executeJavaScript(`document.body.innerHTML = '<h2 style="color:red">No se pudo cargar la app.<br>${err}</h2>'`);
  });

  // Abre DevTools por defecto para depuración
  win.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
