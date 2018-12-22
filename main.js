
const electron = require('electron')
const {ipcMain} = require("electron")
const { app, Menu, MenuItem, BrowserWindow,globalShortcut} = require('electron')
const electronLocalshortcut = require('electron-localshortcut');
// const {globalShortcut}  = require('electron');
// var shortcutsToCapture = ['Ctrl+Alt+Delete', 'Alt+F4','CommandOrControl+A','Tab','CommandOrControl+Shift+I', 'CommandOrControl+R']

// // this should be placed at top of main.js to handle setup events quickly
// if (handleSquirrelEvent(app)) {
//     // squirrel event handled and app will exit in 1000ms, so don't do anything else
//     return;
// }
// var globalShortcut = require('global-shortcut')
// var shortcutsToCapture = ['Ctrl+Alt+Delete','Alt+F4','Ctrl+A','Alt+Tab']
// app.on('ready', function () {

//   captureShortcuts(shortcutsToCapture)
// })

// function captureShortcuts(shortcuts) {
//   shortcuts.forEach(function (shortcut) {
//     registerShortcutCapturing(shortcut)
//   })
// }

// function registerShortcutCapturing(shortcut) {
//   var result = globalShortcut.register(shortcut, function () {
//     console.log('<' + shortcut + '> captured!')
//   })

//   if (!result) {
//     console.log('<' + shortcut + '> registration failed!')
//   }
// }

// app.on('will-quit', () => {
//   // Unregister a shortcut.
//   globalShortcut.unregister('CommandOrControl+X')


var path = require('path')




var path = require('path')
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({titleBarStyle: 'hidden',
    backgroundColor: '#04043E',
    name: "Online Exam",
    frame: false,
    resizable: false,
    transparent: true,
    // localhost:"http://localhost:3000",
    icon: path.join(__dirname, 'assets/icons/png/kit-logo.png')
  });


  // mainWindow.webContents.on('did-finish-load', ()=>{
  //   let name = require('./package.json').name;
  //  let version = require('./package.json').version;
  //  let windowtitle = name +" "+version;
  //  mainWindow.setTitle(windowtitle);
  // });

  mainWindow.loadURL(`file://${__dirname}/src/index.html`)

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
    // Menu.setApplicationMenu(menu)
  })
}

app.on('web-contents-created', function (event, wc) {
wc.on('before-input-event', function (event, input) {
    if (input.key === 'x' && input.ctrl && !input.alt && !input.meta && !input.shift) {
      // Do something for Ctrl-X
      event.preventDefault()
    }
  })
})

app.on('ready',()=>{

globalShortcut.register('Alt+Tab', function(){
  // mainWindow.show()
  console.log('Tab+Alt captured!')
})
globalShortcut.register('CommandOrControl+Alt+Delete', function(){
  console.log('CommandOrControl+Alt+Delete captured!')
  // mainWindow.show()
})
globalShortcut.register('CommandOrControl+R', function(){
  console.log('CommandOrControl+R captured!')
  // mainWindow.show()
})
globalShortcut.register('Alt+F4', function(){
  // mainWindow.show()
  console.log('Alt+F4 captured!')
})
globalShortcut.register('CommandOrControl+A', function(){
  // mainWindow.show()
  console.log('CommandOrControl+A captured!')
})
// globalShortcut.register('CommandOrControl+C', function(){
//   // mainWindow.show()
//   console.log('CommandOrControl+C captured!')
// })
globalShortcut.register('CommandOrControl+Shift+I', function(){
  // mainWindow.show()
  console.log('CommandOrControl+Shift+I captured!')
})
globalShortcut.register('Alt+Esc', function(){
  // mainWindow.show()
  console.log('Alt+Esc captured!')
})
globalShortcut.register('Alt+Shift+I', function(){
  // mainWindow.show()
  console.log('Alt+Shift+I captured!')
})
globalShortcut.register('CommandOrControl+R', function(){
  // mainWindow.show()
   console.log('CommandOrControl+R captured!')
})
globalShortcut.register('Command+Tab', function(){
  // mainWindow.show()
   console.log('Command+Tab captured!')
})
// globalShortcut.register('Alt', function(){
//   // mainWindow.show()
//   console.log('Alt captured!')
// })
 // var child = require('child_process').execFile;
 //   var executablePath = "kaka.exe";
 //   child(executablePath, function(err, data) {
 //       if(err){
 //           console.error(err);
 //           return;
 //       }

 //       console.log(data.toString());
 //   })



});

app.on('will-quit', function(){
  globalShortcut.unregisterAll()
})


let testWindow

function createTestWindow (question_list) {
  // Create the browser window.
  testWindow = new BrowserWindow({titleBarStyle: 'hidden', width: 800, height: 600,fullscreen: true,
  frame: false,
  backgroundColor: '#F8F7F7',
  icon: path.join(__dirname, 'assets/icons/png/kit-logo.png')})
  
  // and load the index.html of the app.
  testWindow.loadURL(`file://${__dirname}/src/iqtest.html`)

  //Emitted when iq_test window window completely loaded
  testWindow.webContents.on('did-finish-load', () => {
    testWindow.webContents.send('question_list', question_list)
  })

  //run blockkey.exe from js
  var child = require('child_process').execFile;
  var executablePath = "blockkey.exe";
  child(executablePath, function(err, data) {
      if(err){
          console.error(err);
          return;
      }
       console.log(data.toString());
  })
  
  // Emitted when the window is closed.
  testWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    testWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

function handleSquirrelEvent(application) {
  if (process.argv.length === 1) {
      return false;
  }

  const ChildProcess = require('child_process');
  const path = require('path');

  const appFolder = path.resolve(process.execPath, '..');
  const rootAtomFolder = path.resolve(appFolder, '..');
  const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
  const exeName = path.basename(process.execPath);

  const spawn = function(command, args) {
      let spawnedProcess, error;

      try {
          spawnedProcess = ChildProcess.spawn(command, args, {
              detached: true
          });
      } catch (error) {}

      return spawnedProcess;
  };

  const spawnUpdate = function(args) {
      return spawn(updateDotExe, args);
  };

  const squirrelEvent = process.argv[1];
  switch (squirrelEvent) {
      case '--squirrel-install':
      case '--squirrel-updated':
          // Optionally do things such as:
          // - Add your .exe to the PATH
          // - Write to the registry for things like file associations and
          //   explorer context menus

          // Install desktop and start menu shortcuts
          spawnUpdate(['--createShortcut', exeName]);

          setTimeout(application.quit, 1000);
          return true;

      case '--squirrel-uninstall':
          // Undo anything you did in the --squirrel-install and
          // --squirrel-updated handlers

          // Remove desktop and start menu shortcuts
          spawnUpdate(['--removeShortcut', exeName]);

          setTimeout(application.quit, 1000);
          return true;

      case '--squirrel-obsolete':
          // This is called on the outgoing version of your app before
          // we update to the new version - it's the opposite of
          // --squirrel-updated

          application.quit();
          return true;
  }
};


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipcMain.on("test", (event, question_list) => {
  createTestWindow(question_list)
  mainWindow.close()
})

ipcMain.on("submit-test", (event, email) => {
  createResultWindow(email)
  testWindow.close()
})

let resultWindow
function createResultWindow (email){
  // Create the browser window.
  resultWindow = new BrowserWindow({titleBarStyle: 'hidden', width: 800, height: 600, fullscreen: true,
  frame: false,
  backgroundColor: '#F8F7F7',
  icon: path.join(__dirname, 'assets/icons/png/test.png')})
  
  // and load the index.html of the app.
  resultWindow.loadURL(`file://${__dirname}/src/results.html`)

  //Emitted when iq_test window window completely loaded
  resultWindow.webContents.on('did-finish-load', () => {
    resultWindow.webContents.send('email', email)
  })
  
  // Emitted when the window is closed.
  resultWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    resultWindow = null
  })
}
