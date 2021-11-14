const { app, BrowserWindow } = require("electron");
const url = require("url");
const path = require("path");
const { ipcMain } = require("electron");
const { webContents } = require("electron");

const { print } = require("pdf-to-printer");

const fs = require("fs");
const os = require("os");

// let splash;
let mainWindow;

ipcMain.on("print-pdf", (event, arg) => {
  // set temp.pdf path
  const pdfPreviewFilePath =
    process.platform === "darwin"
      ? `${app.getPath("home")}/Library/Logs/BBX/temp.pdf`
      : `${app.getPath("home")}\\AppData\\Roaming\\BBX\\temp.pdf`;

  // save as temp.pdf
  fs.writeFile(pdfPreviewFilePath, arg.buffer, "binary", err => {
    console.log(pdfPreviewFilePath, err);
    print(pdfPreviewFilePath).then(res => {
      console.log(res);
      fs.access(pdfPreviewFilePath, fs.constants.F_OK, err => {
        if (!!err) {
          console.log(err);
        } else {
          fs.unlink(pdfPreviewFilePath, (err) => {
            console.log(err);
          });
        }
      });
      
    });
  });

  // console.log(arg.bloburl);
  // print(`file://${pdfPreviewFilePath}`).then(console.log, (rej) => {
  //   console.log(rej);
  // });

  // console.log(arg.bloburl);
  // print(arg.bloburl).then(console.log, (rej) => {
  //   console.log(rej);
  // });

  //mainWindow.webContents.print({silent: true});
  // console.log(mainWindow.webContents); // prints "ping"
  //   console.log(mainWindow.webContents.mainFrame.frames[0]); // prints "ping"
  //   mainWindow.webContents.mainFrame.frames[0].webContents.print({silent: false});
  // console.log(event, arg); // prints "ping"
  // webContents.fromId(arg.id).print({silent: true});

  //   const pdfPath = path.join(os.homedir(), "Desktop", "temp.pdf");
  //   webContents.fromId(arg.id).loadURL(arg.bloburl);
  //   setTimeout(function () {
  //     // webContents
  //     //   .fromId(arg.id)
  //     //   .printToPDF({})
  //     //   .then((data) => {
  //     //     fs.writeFile(pdfPath, data, (error) => {
  //     //       if (error) throw error;
  //     //       console.log(`Wrote PDF successfully to ${pdfPath}`);
  //     //     });
  //     //   })
  //     //   .catch((error) => {
  //     //     console.log(`Failed to write PDF to ${pdfPath}: `, error);
  //     //   });

  // 	  webContents
  //       .fromId(arg.id)
  //       .savePage(pdfPath, "HTMLComplete")
  //       .then(() => {
  //         console.log("Page was saved successfully.");
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   }, 18000);

  // event.reply('asynchronous-reply', 'pong')
  // event.reply("asynchronous-reply", "pong");
  //   let win = new BrowserWindow({
  //     webPreferences: {
  //       plugins: true,
  // 	  nodeIntegration: true
  //     }
  //   })
  //   console.log(arg[0]);
  //   win.loadURL(arg[0]);
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true,
      plugins: true,
    },
  });

  // Splashscreen
  // splash = new BrowserWindow({width: 90, height: 35, transparent: true, frame: false, alwaysOnTop: true});
  // splash.loadURL(
  // 	url.format({
  // 		pathname: path.join(__dirname, '/dist/bbx/static/splash.html'),
  // 		protocol: 'file:',
  // 		slashes: true
  // 	})
  // );

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "/dist/bbx/index.html"),
      protocol: "file:",
      slashes: true,
    })
  );

  // Open the devtools
  // mainWindow.webContents.openDevTools();

  mainWindow.once("ready-to-show", () => {
    //mainWindow.setKiosk(true);
    mainWindow.setMinimumSize(1366, 768);
    mainWindow.maximize();
    // splash.destroy();
  });

  mainWindow.webContents.on("frame-created", (event, details) => {
    // updateBitmap(dirty, image.getBitmap())
    console.log("===================");
    console.log(event);
    console.log(details);
    console.log("===================");
  });

  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function () {
  if (mainWindow === null) createWindow();
});
