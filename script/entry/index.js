"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const type_electron_1 = require("type-electron");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const child_process_1 = __importDefault(require("child_process"));
const saveTool = __importStar(require("save-tool"));
saveTool.makeSaveRoot();
saveTool.makeSaveDir("pml");
if (saveTool.createSaveFile("pml", "clients.json")[0]) {
    fs_1.default.writeFileSync(saveTool.useSaveDir("pml", "clients.json"), JSON.stringify([]), { encoding: "utf8" });
}
;
if (saveTool.createSaveFile("pml", "setting.json")[0]) {
    fs_1.default.writeFileSync(saveTool.useSaveDir("pml", "setting.json"), JSON.stringify({}), { encoding: "utf8" });
}
;
type_electron_1.app.on("ready", () => {
    const win = new type_electron_1.BrowserWindow({
        width: 860,
        height: 520,
        minWidth: 860,
        minHeight: 520,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            preload: path_1.default.resolve(__dirname, "script/preload.js")
        },
        icon: "img/favicon.ico",
        title: "Plain Mihoyo Launcher"
    });
    win.loadFile("index.html");
    type_electron_1.ipcMain.on("quit", () => type_electron_1.app.quit());
    type_electron_1.ipcMain.on("minimize", () => win.minimize());
    type_electron_1.ipcMain.on("launch", () => {
        child_process_1.default.spawn("D:/Star Rail/Game/StarRail.exe");
    });
});
