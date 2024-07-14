import * as saveTool from "save-tool";
import * as messageBox from "./messageBox";
import AdmZip from "adm-zip";
import path from "path";
import fs from "fs";
import process from "process";
import { ClientType } from "../../common/dataStruct";
interface launchArg {
    game: ClientType;
    path: string;
    client: {
        name: string;
        version: string;
    };
};
interface PluginEvents {
    onload: () => void;
    onlaunchGame: (arg: launchArg) => void;
};
interface Plugin {
    displayName: string;
    id: string;
    version: string;
    description: string;
    author: string;
    supporttedGame: ClientType[] | "all";
    events: PluginEvents;
    workDirectry: string;
    required: { [key: string]: any[]; };
};
export namespace PlainMihoyoLauncher {
    export const MessageBox = messageBox;
    export namespace Plugins {
        let _plugins: Plugin[] = [];
        export function runPluginEvent<T extends keyof PluginEvents>(id: string, name: T, arg: Parameters<PluginEvents[T]>[0] = undefined) {
            _plugins.forEach(e => {
                if (e.id === id) {
                    process.chdir(e.workDirectry);
                    e.events[name](arg as any);
                    process.chdir(path.resolve(__dirname, "../../../.."));
                };
            });
        };
        export function install(pluginPath: string) {
            let pluginFile = new AdmZip(pluginPath);
            let pluginFileName = path.basename(pluginPath);
            pluginFile.extractAllTo(saveTool.useSaveDir("pml", "plugins", pluginFileName), true);
        };
        export function refresh() {
            _plugins = [];
            fs.readdirSync(saveTool.useSaveDir("pml", "plugins")).forEach((plugin) => {
                try {
                    let pluginConfig = JSON.parse(fs.readFileSync(saveTool.useSaveDir("pml", "plugins", plugin, "mpp-config.json")).toString());
                    _plugins.push({
                        ...pluginConfig,
                        events: {
                            onload: () => { },
                            onlaunchGame: () => { },
                        },
                        workDirectry: saveTool.useSaveDir("pml", "plugins", plugin),
                        required: {}
                    });
                    CurrentPlugin.setName(pluginConfig.id);
                    require(saveTool.useSaveDir("pml", "plugins", plugin, pluginConfig.entry));
                } catch { };
            });
        };
        export function getPlugins() {
            return _plugins;
        };
        export function reload() {
            _plugins.forEach(e => {
                runPluginEvent(e.id, "onload");
            });
        };
    };
    export namespace CurrentPlugin {
        let _id = "";
        export function setName(id: string) {
            _id = id;
        };
        export function addEvent<T extends keyof PluginEvents>(name: T, func: PluginEvents[T]) {
            Plugins.getPlugins().forEach((plugin) => {
                if (plugin.id == _id) {
                    plugin.events[name] = func;
                };
            });
        };
        export function requireArray(name: string) {
            Plugins.getPlugins().forEach((plugin) => {
                if (plugin.id == _id) {
                    plugin.required[name] = [];
                };
            })
        };
        export function getRequiredArray<T>(name: string): T[] | null {
            let result: T[] | null = null;
            Plugins.getPlugins().forEach((plugin) => {
                if (plugin.id == _id) {
                    return plugin.required[name] as T[];
                };
            });
            return result;
        };
    };
};