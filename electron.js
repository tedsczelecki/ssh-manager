const {app, BrowserWindow, ipcMain, Tray, nativeImage} = require('electron');
const os = require('os');
const Events = require('./src/constants/Events');
const path = require('path');
const url = require('url');
const fs = require('fs');
const osascript = require('node-osascript');

// require('electron-debug')({showDevTools:true});

const dataFilePath = path.join(app.getPath('userData'), 'user-data.json');
const terminalPath = 'tell application "Terminal" to do script "{{CMD}}" activate';

global.os = os;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let window, tray = undefined;

function createWindow () {
  let icon = nativeImage.createFromDataURL(trayLogo);
  let iconPath = path.join(__dirname, 'public/ssh-logo.png');
  tray = new Tray(iconPath);

  tray.on('click', function(event) {
    toggleWindow();

    // Show devtools when command clicked
    if (window.isVisible() && process.defaultApp && event.metaKey) {
      window.openDevTools({mode: 'detach'});
    }
  })

  // Create the browser window.32
  window = new BrowserWindow({
    width: 400,
    height: 500,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    transparent: true,
    webPreferences: {
      // Prevents renderer process code from not running when window is
      // hidden
      backgroundThrottling: false
    }
  });

  window.loadURL('http://localhost:4000');
  // BrowserWindow.addDevToolsExtension('/Users/tedsczelecki/Library/Application Support/Google/Chrome/Default/Extensions/lmhkpmbekcpmknklioeibfkpmmfibljd/2.15.2_0');

  // Open the DevTools.
  // window.webContents.openDevTools()

  window.on('blur', (  ) => {
    window.hide();
  })
  // Emitted when the window is closed.
  window.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    window = null;
  });
}

ipcMain.on('show-window', () => {
  showWindow();
});

ipcMain.on(Events.GET_INITIAL_DATA, (  ) => {
  window.send(Events.INITIAL_DATA, getUserData());
});

ipcMain.on(Events.SAVE_DATA, ( evt, data  ) => {
  fs.writeFile(dataFilePath, JSON.stringify(data), (  ) => {});
});

ipcMain.on(Events.OPEN_CONNECTION, openConnection);

const toggleWindow = () => {
  if (window.isVisible()) {
    window.hide();
  } else {
    showWindow();
  }
};

const showWindow = () => {
  const trayPos = tray.getBounds();
  const windowPos = window.getBounds();
  let x, y = 0
  if (process.platform == 'darwin') {
    x = Math.round(trayPos.x + (trayPos.width / 2) - (windowPos.width / 2))
    y = Math.round(trayPos.y + trayPos.height)
  } else {
    x = Math.round(trayPos.x + (trayPos.width / 2) - (windowPos.width / 2))
    y = Math.round(trayPos.y + trayPos.height * 10)
  }


  window.setPosition(x, y, false);
  window.show();
  window.focus();
};

function getUserData(){
  try {
    return JSON.parse(fs.readFileSync(dataFilePath) || {});
  } catch (e){
    return {};
  }
}

function openConnection(evt, params){
  const pem = (params.connection.pemLocation || params.settings.defaultPemPath).trim();
  const sshParams = `${params.connection.params} ${pem ? '-i' : '' }`;
  const title = `echo -n -e '\\\\033]0;${params.connection.name}\\\\007'`;
  const command = `ssh ${sshParams} ${pem} ${params.connection.user}@${params.connection.domain} && ${title}`;
  osascript.execute(terminalPath.replace('{{CMD}}', command.replace(/"/g, '//')), ( err ) => {
    if ( err ){
      console.log(err);
    }
    window.hide();
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (window === null) {
    createWindow();
  }
});

const trayLogo = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDE2IDE2OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHN0eWxlIHR5cGU9InRleHQvY3NzIj4uc3Qwe2ZpbGw6IzRCNEI0Qjt9PC9zdHlsZT48Zz48cGF0aCBkPSJNLTkyOC0xMzY3LjJjLTI1My4xLDAtNDU4LjIsMjA1LjItNDU4LjIsNDU4LjJzMjA1LjIsNDU4LjIsNDU4LjIsNDU4LjJTLTQ2OS44LTY1NS45LTQ2OS44LTkwOVMtNjc0LjktMTM2Ny4yLTkyOC0xMzY3LjJ6IE0tMTIxNy04MDAuOXYtNzRsMjA3LTc4bC0yMDctNzR2LTczbDI5NiwxMTJ2NjlMLTEyMTctODAwLjl6IE0tNjM2LTcxNi45aC0yODV2LTU4aDI4NVYtNzE2Ljl6Ii8+PHBhdGggY2xhc3M9InN0MCIgZD0iTS05MjgtNDMwLjhjLTY0LjYsMC0xMjcuMi0xMi42LTE4Ni4yLTM3LjZjLTU3LTI0LjEtMTA4LjEtNTguNi0xNTItMTAyLjVzLTc4LjQtOTUuMS0xMDIuNS0xNTJjLTI0LjktNTktMzcuNi0xMjEuNi0zNy42LTE4Ni4yczEyLjYtMTI3LjIsMzcuNi0xODYuMmMyNC4xLTU3LDU4LjYtMTA4LjEsMTAyLjUtMTUyczk1LjEtNzguNCwxNTItMTAyLjVjNTktMjQuOSwxMjEuNi0zNy42LDE4Ni4yLTM3LjZzMTI3LjIsMTIuNiwxODYuMiwzNy42YzU3LDI0LjEsMTA4LjEsNTguNiwxNTIsMTAyLjVzNzguNCw5NS4xLDEwMi41LDE1MmMyNC45LDU5LDM3LjYsMTIxLjYsMzcuNiwxODYuMmMwLDY0LjYtMTIuNiwxMjcuMi0zNy42LDE4Ni4yYy0yNC4xLDU3LTU4LjYsMTA4LjEtMTAyLjUsMTUycy05NS4xLDc4LjQtMTUyLDEwMi41Qy04MDAuOC00NDMuNC04NjMuNC00MzAuOC05MjgtNDMwLjh6IE0tOTI4LTEzNDcuMmMtNTkuMiwwLTExNi42LDExLjYtMTcwLjYsMzQuNGMtNTIuMiwyMi4xLTk5LjEsNTMuNy0xMzkuMyw5My45Yy00MC4zLDQwLjMtNzEuOSw4Ny4xLTkzLjksMTM5LjNjLTIyLjgsNTQtMzQuNCwxMTEuNC0zNC40LDE3MC42YzAsNTkuMiwxMS42LDExNi42LDM0LjQsMTcwLjZjMjIuMSw1Mi4yLDUzLjcsOTkuMSw5My45LDEzOS4zYzQwLjMsNDAuMyw4Ny4xLDcxLjksMTM5LjMsOTMuOWM1NCwyMi44LDExMS40LDM0LjQsMTcwLjYsMzQuNGM1OS4yLDAsMTE2LjYtMTEuNiwxNzAuNi0zNC40YzUyLjItMjIuMSw5OS4xLTUzLjcsMTM5LjMtOTMuOWM0MC4zLTQwLjMsNzEuOS04Ny4xLDkzLjktMTM5LjNjMjIuOC01NCwzNC40LTExMS40LDM0LjQtMTcwLjZjMC01OS4yLTExLjYtMTE2LjYtMzQuNC0xNzAuNmMtMjIuMS01Mi4yLTUzLjctOTkuMS05My45LTEzOS4zYy00MC4zLTQwLjMtODcuMS03MS45LTEzOS4zLTkzLjlDLTgxMS40LTEzMzUuNy04NjguOC0xMzQ3LjItOTI4LTEzNDcuMnoiLz48L2c+PGc+PHBhdGggZD0iTTgsMC43QzQsMC43LDAuNyw0LDAuNyw4UzQsMTUuMyw4LDE1LjNzNy4zLTMuMyw3LjMtNy4zUzEyLjEsMC43LDgsMC43eiBNMy40LDkuOFY4LjZsMy4zLTEuMkwzLjQsNi4xVjVsNC43LDEuOHYxLjFMMy40LDkuOHogTTEyLjcsMTEuMUg4LjF2LTAuOWg0LjZWMTEuMXoiLz48cGF0aCBjbGFzcz0ic3QwIiBkPSJNOCwxNS43Yy0xLDAtMi0wLjItMy0wLjZjLTAuOS0wLjQtMS43LTAuOS0yLjQtMS42UzEuNCwxMS45LDEsMTFjLTAuNC0wLjktMC42LTEuOS0wLjYtM3MwLjItMiwwLjYtM2MwLjQtMC45LDAuOS0xLjcsMS42LTIuNFM0LjEsMS40LDUsMUM2LDAuNiw3LDAuNCw4LDAuNHMyLDAuMiwzLDAuNmMwLjksMC40LDEuNywwLjksMi40LDEuNmMwLjcsMC43LDEuMywxLjUsMS42LDIuNEMxNS41LDYsMTUuNyw3LDE1LjcsOGMwLDEtMC4yLDItMC42LDNjLTAuNCwwLjktMC45LDEuNy0xLjYsMi40Yy0wLjcsMC43LTEuNSwxLjMtMi40LDEuNkMxMC4xLDE1LjUsOS4xLDE1LjcsOCwxNS43eiBNOCwxQzcuMSwxLDYuMiwxLjIsNS4zLDEuNkM0LjUsMS45LDMuNywyLjQsMy4xLDMuMUMyLjQsMy43LDEuOSw0LjUsMS42LDUuM0MxLjIsNi4yLDEsNy4xLDEsOEMxLDksMS4yLDkuOSwxLjYsMTAuOGMwLjQsMC44LDAuOSwxLjYsMS41LDIuMmMwLjYsMC42LDEuNCwxLjEsMi4yLDEuNUM2LjIsMTQuOCw3LjEsMTUsOCwxNWMwLjksMCwxLjktMC4yLDIuNy0wLjVjMC44LTAuNCwxLjYtMC45LDIuMi0xLjVjMC42LTAuNiwxLjEtMS40LDEuNS0yLjJDMTQuOCw5LjksMTUsOSwxNSw4YzAtMC45LTAuMi0xLjktMC42LTIuN2MtMC40LTAuOC0wLjktMS42LTEuNS0yLjJjLTAuNi0wLjYtMS40LTEuMS0yLjItMS41QzkuOSwxLjIsOSwxLDgsMXoiLz48L2c+PC9zdmc+';

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
