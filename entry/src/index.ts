import { app, BrowserWindow, dialog, ipcMain } from "type-electron";
import { ClientConfigFile, ClientInfo, ClientStatus, ClientType, SettingType } from "../../common/dataStruct";
import { logger } from "./logger";
import * as saveTool from "save-tool";
import * as messageBox from "./messageBox";
import path from "path";
import child_process from "child_process";
import fs from "fs";
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
            YuanShen: {
                currentClient: "未选择客户端",
                label: "原神"
            },
            StarRail: {
                currentClient: "未选择客户端",
                label: "崩坏：星穹铁道"
            },
            ZenlessZoneZero: {
                currentClient: "未选择客户端",
                label: "绝区零"
            }
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
function getClientList() {
    let result: ClientConfigFile[] = [];
    clients.forEach((e) => {
        result.push(JSON.parse(fs.readFileSync(path.join(e.path, "client.json")).toString()));
    })
    return result;
}
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
    ipcMain.on("devtool", () => {
        if (settings.launcher.devTool) {
            win.webContents.toggleDevTools();
            logger.warning("用户滚动开发者工具");
        } else {
            logger.error("用户尝试调用开发者工具，但开发者工具被禁用");
        };
    });
    ipcMain.on("launch", (_, e: ClientType) => {
        logger.info(`正在启动：${settings.game[e].currentClient}`);
        let currentPath = null;
        getClientList().forEach(f => {
            if (f.name === settings.game[e].currentClient) {
                currentPath = f.path;
            };
        });
        if (currentPath) {
            let _gameStdout = "";
            child_process.spawn(currentPath).stdout.on("data", (data) => {
                _gameStdout += data.toString();
                logger.info(`客户端${settings.game[e].currentClient}输出：${data.toString()}`);
                fs.writeFileSync("gameLog.txt", _gameStdout, { encoding: "utf8" });
            });
        } else {
            win.webContents.send("cannot-find-client", settings.game[e].currentClient);
        };
    });
    ipcMain.on("get-client-list", (_, e) => {
        win.webContents.send("get-client-list", { id: e, data: getClientList() });
        logger.info("正在获取客户端列表");
    });
    ipcMain.on("get-settings", (_, e) => {
        win.webContents.send("get-settings", { id: e, data: settings });
        logger.info("正在获取设置");
    });
    ipcMain.on("save-settings", (_, e) => {
        logger.warning("正在保存设置");
        settings = e;
        dumpConfig();
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
        let haveSameClient = false;
        getClientList().forEach(f => {
            if (path.normalize(path.join(path.dirname(f.path), ".pml-client")) === path.normalize(configPath)) {
                logger.error(`用户尝试创建一个已存在的原版客户端：${e.path}`);
                haveSameClient = true;
            };
        });
        if (haveSameClient) {
            return { status: false, message: "该客户端已存在" };
        };
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
            type: e.game
        };
        fs.writeFileSync(path.join(configPath, "client.json"), JSON.stringify(gameConfig), { encoding: "utf8" });
        logger.info("转换成功");
        let current: ClientInfo = {
            path: configPath
        };
        clients.push(current);
        dumpConfig();
        return { status: true, message: e.path };
    });
    ipcMain.handle("load-client", (_, e): ClientStatus => {
        logger.warning("正在加载PML客户端");
        let clientConfigPath = path.join(e.path, ".pml-client");
        let haveSameClient = false;
        getClientList().forEach(f => {
            if (path.normalize(path.join(path.dirname(f.path), ".pml-client")) === path.normalize(clientConfigPath)) {
                logger.error(`用户尝试加载一个已存在的PML客户端：${path.join(e.path, `${e.game}.exe`)}`);
                haveSameClient = true;
            };
        });
        if (haveSameClient) {
            return { status: false, message: "该客户端已存在" };
        };
        try {
            logger.info("正在读取配置文件");
            let clientConfig: ClientConfigFile = JSON.parse(fs.readFileSync(path.join(clientConfigPath, "client.json")).toString());
            logger.info("正在验证配置文件完整性");
            logger.info(`客户端名称有效：${clientConfig.name.toString()}`);
            logger.info(`客户端路径有效：${clientConfig.path.toString()}`);
            logger.info(`客户端插件列表有效：${clientConfig.plugins.toString()}`);
            logger.info(`客户端类型有效：${clientConfig.type.toString()}`);
            logger.info(`客户端版本有效：${clientConfig.version.toString()}`);
            let current: ClientInfo = {
                path: clientConfigPath
            };
            clients.push(current);
            dumpConfig();
            return { status: true, message: clientConfig };
        } catch (e) {
            logger.error(e);
            return { status: false, message: `这不是一个有效的PML客户端。错误：${e}` };
        };
    });
    messageBox.useRootWindow(win);
});