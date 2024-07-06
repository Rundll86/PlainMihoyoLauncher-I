import { app, BrowserWindow, dialog, ipcMain } from "type-electron";
import { ClientInfo, SettingType } from "../../common/dataStruct";
import * as saveTool from "save-tool";
import * as messageBox from "./messageBox";
import path from "path";
import fs from "fs";
import child_process from "child_process";
import process from "process";
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
function dumpConfig(c: ClientInfo[] = clients, s: SettingType = settings) {
    fs.writeFileSync(saveTool.useSaveDir("pml", "clients.json"), JSON.stringify(c), { encoding: "utf8" });
    fs.writeFileSync(saveTool.useSaveDir("pml", "setting.json"), JSON.stringify(s), { encoding: "utf8" });
};
var clients: ClientInfo[] = JSON.parse(fs.readFileSync(saveTool.useSaveDir("pml", "clients.json")).toString());
var settings: SettingType = JSON.parse(fs.readFileSync(saveTool.useSaveDir("pml", "setting.json")).toString());
app.on("ready", () => {
    const winWidth = 1280, winHeight = 720;
    const win = new BrowserWindow({
        width: winWidth,
        height: winHeight,
        minWidth: winWidth,
        minHeight: winHeight,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            preload: saveTool.fromWorkdir("script/preload.js")
        },
        icon: "img/favicon.ico",
        title: "Plain Mihoyo Launcher"
    });
    win.loadFile(saveTool.fromWorkdir("index.html"));
    ipcMain.on("quit", () => app.quit());
    ipcMain.on("minimize", () => win.minimize());
    ipcMain.on("reload", () => win.webContents.reload());
    ipcMain.on("devtool", () => win.webContents.toggleDevTools());
    ipcMain.on("launch", () => {
        child_process.spawn("D:/Star Rail/Game/StarRail.exe");
    });
    ipcMain.on("get-client-list", (_, e) => {
        win.webContents.send("get-client-list", { id: e, data: clients });
    });
    ipcMain.on("get-settings", (_, e) => {
        win.webContents.send("get-settings", { id: e, data: settings });
    });
    ipcMain.handle("select-file", (_, e) => {
        let result = dialog.showOpenDialogSync({
            properties: ["openFile"],
            filters: e
        });
        if (result) {
            return result[0];
        } else {
            return null;
        };
    });
    ipcMain.handle("create-client", (_, e) => {
        let current = {
            name: e.name,
            version: "unknown",
            path: e.path,
            type: e.game
        };
        clients.push(current);
        dumpConfig();
        return current;
    });
    messageBox.useRootWindow(win);
    if (settings.launcher.devTool) {
        win.webContents.openDevTools();
    };
});