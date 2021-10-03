const { app, BrowserWindow } = require('electron')
const url = require('url')
const path = require('path')

// let splash;
let mainWindow;

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true
		}
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
			pathname: path.join(__dirname, '/dist/bbx/index.html'),
			protocol: 'file:',
			slashes: true
		})
	);
	
	// Open the devtools
	// mainWindow.webContents.openDevTools();

	mainWindow.once('ready-to-show', () => {
		mainWindow.setMinimumSize(1366, 768);
		mainWindow.maximize();
		// splash.destroy();
  	});
	
	mainWindow.on('closed', function () {
		mainWindow = null;
	});
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
	if (mainWindow === null) createWindow();
});
