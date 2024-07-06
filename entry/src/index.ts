import { app, BrowserWindow, ipcMain } from "type-electron";
import path from "path";
import fs from "fs";
import child_process from "child_process";
import * as saveTool from "save-tool";
import { ClientInfo, SettingType } from "../../common/dataStruct";
import * as messageBox from "./messageBox";
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
    messageBox.useRootWindow(win);
    saveTool.makeSaveRoot();
    saveTool.makeSaveDir("pml");
    if (saveTool.createSaveFile("pml", "clients.json")[0]) {
        let current: ClientInfo[] = [];
        fs.writeFileSync(saveTool.useSaveDir("pml", "clients.json"), JSON.stringify(current), { encoding: "utf8" });
    };
    if (saveTool.createSaveFile("pml", "setting.json")[0]) {
        let current: SettingType = {
            game: {
                sr: { currentClient: "" },
                gi: { currentClient: "" },
                zzz: { currentClient: "" }
            },
            launcher: {
                devTool: false
            }
        };
        fs.writeFileSync(saveTool.useSaveDir("pml", "setting.json"), JSON.stringify(current), { encoding: "utf8" });
    };
    var clients: ClientInfo[] = JSON.parse(fs.readFileSync(saveTool.useSaveDir("pml", "clients.json")).toString());
    var settings: SettingType = JSON.parse(fs.readFileSync(saveTool.useSaveDir("pml", "setting.json")).toString());
    if (settings.launcher.devTool) {
        win.webContents.openDevTools();
    };
});