const { app, BrowserWindow } = require("electron");
const url = require("url");
const path = require("path");
const { ipcMain } = require("electron");
const fs = require("fs");
const { print } = require("pdf-to-printer");

// let splash;
let mainWindow;

ipcMain.on("print-pdf", (event, arg) => {
  // Set temp.pdf path
  const reportName = `${Date.now()}${Math.random()}.pdf`;
  const pdfPreviewFilePath =
    process.platform === "darwin"
      ? `${app.getPath("home")}/Library/Logs/BBX/${reportName}`
      : `${app.getPath("home")}/AppData/Roaming/BBX/${reportName}`;

  // Save as temp.pdf
  fs.writeFile(pdfPreviewFilePath, arg.buffer, "binary", (err) => {
    console.log(reportName, err);

    // Silent print PDF with default printer
    print(pdfPreviewFilePath).then((res) => {
      console.log(res);

      // Check temp file after printing
      fs.access(pdfPreviewFilePath, fs.constants.F_OK, (err) => {
        if (!!err) {
          console.log(err);
        } else {
          // Delete temp file
          fs.unlink(pdfPreviewFilePath, (err) => {
            console.log(err);
          });
        }
      });
    });
  });
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
