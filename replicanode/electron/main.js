const { app, BrowserWindow } = require("electron");
const path = require("path");
const registerHandlers = require("./ipc/metadataHandlers");

function createWindow() {
    const win = new BrowserWindow({
        show: false,
        icon: path.join(__dirname, "../renderer/assets/logos/navbar_logo.PNG"),
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    });

    win.maximize();
    win.setMenuBarVisibility(false);
    win.show();

    win.loadFile(path.join(__dirname, "../renderer/index.html"));
}

app.whenReady().then(() => {
    registerHandlers();
    createWindow();
});
