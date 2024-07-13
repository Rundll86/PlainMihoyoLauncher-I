import * as saveTool from "save-tool";
import AdmZip from "adm-zip";
import path from "path";
import fs from "fs";
interface launchArg {
    game: clientType;
    path: string;
    client: {
        name: string;
        version: string;
    };
};
interface PluginEvents {
    onload: () => void;
    onlaunchGame: launchFunc;
};
interface Plugin {
    displayName: string;
    id: string;
    version: string;
    description: string;
    author: string;
    supporttedGame: clientType[] | "all";
    events: PluginEvents;
};
type clientType = "GenshinImpact" | "StarRail" | "ZZZ";
type launchFunc = (arg: launchArg) => void;
export namespace PlainMihoyoLauncher {
    export namespace Plugins {
        let _plugins: Plugin[] = [];
        export function install(pluginPath: string) {
            let pluginFile = new AdmZip(pluginPath);
            let pluginFileName = path.basename(pluginPath);
            pluginFile.extractAllTo(saveTool.useSaveDir("pml", "plugins", pluginFileName));
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
                        }
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
            _plugins.forEach((plugin) => {
                plugin.events.onload();
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
    };
};