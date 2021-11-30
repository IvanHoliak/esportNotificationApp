const { app, BrowserWindow, globalShortcut, Tray, Menu } = require('electron');

if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow;
let tray = null;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 500,
    height: 600,
    minWidth: 500,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true
    },
    frame: false
  });

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  mainWindow.setMenu(null);
};

const createGlobalShortcut = () => {
  globalShortcut.register("Control+F5", () => {
    mainWindow.webContents.openDevTools();
  });
};

const trayFunction = () => {
  var tray = new Tray(__dirname + '/icon/iconMain.png');

  var contextMenu = Menu.buildFromTemplate([
    {label: 'Show App', click:  
      function(){
        mainWindow.show();
      }
    },
    { label: 'Quit', click: 
      function(){
        app.isQuiting = true;
        app.quit();
      } 
    }
  ]);

  mainWindow.on('close', () => {
    mainWindow = null;
  });

  mainWindow.on('minimize',function(event){
    event.preventDefault();
    mainWindow.hide();

    tray.setContextMenu(contextMenu);
    tray.setToolTip("Checked Match App");
    tray.on('click', () => {
      mainWindow.show();
    });
  });
};

app.on('ready', () => {
  createGlobalShortcut();
  createWindow();
  trayFunction();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});