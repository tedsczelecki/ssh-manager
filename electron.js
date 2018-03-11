const electron = require('electron');
const os = require('os');
const Events = require('./src/constants/Events');
const path = require('path');
const url = require('url');
const fs = require('fs');
const osascript = require('node-osascript');

require('electron-debug')({showDevTools:true});

const { app, ipcMain } = electron;
const BrowserWindow = electron.BrowserWindow;
const dataFilePath = path.join(app.getPath('userData'), 'user-data.json');
const terminalPath = 'tell application "Terminal" to do script "echo Hello world"';

global.os = os;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow () {
  // Create the browser window.32
  mainWindow = new BrowserWindow({width: 1000, height: 600});

  mainWindow.loadURL('http://localhost:3000');
  BrowserWindow.addDevToolsExtension('/Users/tedsczelecki/Library/Application Support/Google/Chrome/Default/Extensions/lmhkpmbekcpmknklioeibfkpmmfibljd/2.15.2_0');

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

ipcMain.on(Events.GET_INITIAL_DATA, (  ) => {
  mainWindow.send(Events.INITIAL_DATA, getUserData());
});

ipcMain.on(Events.SAVE_DATA, ( evt, data  ) => {
  fs.writeFile(dataFilePath, JSON.stringify(data), (  ) => {});
});

ipcMain.on(Events.OPEN_CONNECTION, openConnection)

function getUserData(){
  try {
    return JSON.parse(fs.readFileSync(dataFilePath) || {});
  } catch (e){
    return {};
  }
};

function openConnection(evt, params){
  console.log(params);
  // const child = require('child_process').execFile;
  //
  // child(terminalPath, ( err, data ) => {
  //   console.log(err);
  // })
  osascript.execute(terminalPath, ( err ) => {
    console.log(err);
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
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
