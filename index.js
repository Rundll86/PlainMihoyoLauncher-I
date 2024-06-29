const { app, BrowserWindow, ipcMain } = require("type-electron");
const path = require("path");
const process = require("process");
const child_process = require("child_process");
app.on("ready", () => {
    const win = new BrowserWindow({
        width: 860,
        height: 520,
        minWidth: 860,
        minHeight: 520,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            preload: path.resolve(__dirname, "script/preload.js")
        },
        icon: "img/favicon.ico",
        title: "Plain Mihoyo Launcher"
    });
    win.loadFile("index.html");
    ipcMain.on("quit", () => app.quit());
    ipcMain.on("minimize", () => win.minimize());
    ipcMain.on("launch", () => {
        child_process.spawn("D:/Star Rail/Game/StarRail.exe");
    });
});