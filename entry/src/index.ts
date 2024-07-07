import { app, BrowserWindow, dialog, ipcMain } from "type-electron";
import { ClientConfigFile, ClientInfo, ClientStatus, ClientType, SettingType } from "../../common/dataStruct";
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
function deleteFolderRecursive(folderPath: string) {
    if (fs.existsSync(folderPath)) {
        fs.readdirSync(folderPath).forEach((file) => {
            const currentPath = path.join(folderPath, file);
            if (fs.lstatSync(currentPath).isDirectory()) {
                deleteFolderRecursive(currentPath);
            } else {
                fs.unlinkSync(currentPath);
            };
        });
        fs.rmdirSync(folderPath);
    };
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
    ipcMain.handle("select-folder", (_, e) => {
        let result = dialog.showOpenDialogSync({
            properties: ["openDirectory"]
        });
        if (result) {
            return result[0];
        } else {
            return null;
        };
    });
    ipcMain.handle("create-client", (_, e): ClientStatus => {
        let configPath = path.join(path.dirname(e.path), ".pml-client");
        if (fs.existsSync(configPath)) {
            let status = fs.statSync(configPath);
            if (status.isDirectory()) {
                deleteFolderRecursive(configPath);
            } else {
                fs.rmSync(configPath);
            };
        };
        fs.mkdirSync(configPath);
        let gameConfig: ClientConfigFile = {
            path: e.path,
            plugins: [],
            name: e.name,
            version: "unknown",
            type: ClientType.StarRail
        };
        fs.writeFileSync(path.join(configPath, "client.json"), JSON.stringify(gameConfig), { encoding: "utf8" });
        let current = {
            name: gameConfig.name,
            version: gameConfig.version,
            path: configPath,
            type: gameConfig.type,
            game: e.path
        };
        clients.push(current);
        dumpConfig();
        return { status: true, message: "" };
    });
    ipcMain.handle("load-client", (_, e): ClientStatus => {
        let clientConfigPath = path.join(e, ".pml-client");
        if (fs.existsSync(clientConfigPath)) {
            try {
                let clientConfig: ClientConfigFile = JSON.parse(fs.readFileSync(path.join(clientConfigPath, "client.json")).toString());
                let current: ClientInfo = {
                    name: clientConfig.name,
                    version: clientConfig.version,
                    path: clientConfigPath,
                    type: clientConfig.type,
                    game: clientConfig.path
                };
                clients.push(current);
                dumpConfig();
                return { status: true, message: "" };
            } catch (e) {
                return { status: false, message: `客户端没有有效的配置文件。${e}` };
            };
        } else {
            return { status: false, message: "这不是一个有效的PML客户端。" };
        };
    });
    messageBox.useRootWindow(win);
    if (settings.launcher.devTool) {
        win.webContents.openDevTools();
    };
});