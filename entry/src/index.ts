import { app, BrowserWindow, dialog, ipcMain } from "type-electron";
import { ClientConfigFile, ClientInfo, ClientStatus, ClientType, SettingType } from "../../common/dataStruct";
import { logger } from "./logger";
import * as saveTool from "save-tool";
import * as messageBox from "./messageBox";
import path from "path";
import fs from "fs";
import child_process from "child_process";
logger.info("模块加载完成");
saveTool.makeSaveRoot();
saveTool.makeSaveDir("pml");
logger.info("配置文件目录可用");
if (saveTool.createSaveFile("pml", "clients.json")[0]) {
    logger.info("未找到客户端列表信息，正在创建");
    let current: ClientInfo[] = [];
    fs.writeFileSync(saveTool.useSaveDir("pml", "clients.json"), JSON.stringify(current), { encoding: "utf8" });
};
if (saveTool.createSaveFile("pml", "setting.json")[0]) {
    logger.info("未找到设置信息，正在创建");
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
    fs.writeFileSync(saveTool.useSaveDir("pml", "clients.json"), JSON.stringify(c, null, 4), { encoding: "utf8" });
    fs.writeFileSync(saveTool.useSaveDir("pml", "setting.json"), JSON.stringify(s, null, 4), { encoding: "utf8" });
    logger.warning("正在写入配置文件");
};
function deleteFolderRecursive(folderPath: string) {
    logger.warning(`正在删除目录：${folderPath}`);
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
logger.info("配置文件解析完成");
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
    logger.info("正在创建窗口");
    win.loadFile(saveTool.fromWorkdir("index.html"));
    ipcMain.on("quit", () => { app.quit(); logger.warning("用户退出"); });
    ipcMain.on("minimize", () => { win.minimize(); logger.warning("用户最小化") });
    ipcMain.on("reload", () => { win.webContents.reload(); logger.warning("用户重载窗口"); });
    ipcMain.on("devtool", () => { win.webContents.toggleDevTools(); logger.warning("用户打开开发者工具"); });
    ipcMain.on("launch", () => {
        logger.info("正在启动游戏");
    });
    ipcMain.on("get-client-list", (_, e) => {
        win.webContents.send("get-client-list", { id: e, data: clients });
        logger.info("正在获取客户端列表");
    });
    ipcMain.on("get-settings", (_, e) => {
        win.webContents.send("get-settings", { id: e, data: settings });
        logger.info("正在获取设置");
    });
    ipcMain.handle("select-file", (_, e) => {
        logger.info("打开了文件选择框");
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
        logger.info("打开了目录选择框");
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
        logger.warning("正在转换原版客户端到PML客户端");
        let configPath = path.join(path.dirname(e.path), ".pml-client");
        if (fs.existsSync(configPath)) {
            let status = fs.statSync(configPath);
            if (status.isDirectory()) {
                deleteFolderRecursive(configPath);
            } else {
                fs.rmSync(configPath);
            };
            logger.warning("已清除原有的配置目录");
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
        logger.info("成功写入配置文件");
        let current: ClientInfo = {
            path: configPath
        };
        clients.push(current);
        dumpConfig();
        return { status: true, message: "" };
    });
    ipcMain.handle("load-client", (_, e): ClientStatus => {
        logger.warning("正在加载PML客户端");
        let clientConfigPath = path.join(e, ".pml-client");
        try {
            let clientConfig: ClientConfigFile = JSON.parse(fs.readFileSync(path.join(clientConfigPath, "client.json")).toString());
            clientConfig.name.toString();
            clientConfig.path.toString();
            clientConfig.plugins.toString();
            clientConfig.type.toString();
            clientConfig.version.toString();
            let current: ClientInfo = {
                path: clientConfigPath
            };
            clients.push(current);
            dumpConfig();
            return { status: true, message: "" };
        } catch (e) {
            logger.error(e);
            return { status: false, message: `这不是一个有效的PML客户端。错误：${e}` };
        };
    });
    messageBox.useRootWindow(win);
    if (settings.launcher.devTool) {
        win.webContents.openDevTools();
        logger.info("已通过配置文件打开开发者工具");
    };
});