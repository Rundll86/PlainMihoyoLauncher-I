const { app, BrowserWindow } = require("type-electron");
app.on("ready", () => {
    const win = new BrowserWindow({
        width: 860,
        height: 520,
        frame: false,
        webPreferences: {
            nodeIntegration: true
        }
    });
    win.loadFile("index.html");
});