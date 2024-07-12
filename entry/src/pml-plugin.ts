interface launchArg {
    game: clientType;
    path: string;
    client: {
        name: string;
        version: string;
    };
};
type clientType = "GenshinImpact" | "StarRail" | "ZZZ";
type launchFunc = (arg: launchArg) => void;
export namespace PlainMihoyoLauncher {
    export namespace Plugins {
        let _plugins: { [key: string]: Plugin } = {};
        export function register(plugin: Plugin) {
            _plugins[plugin.id] = plugin;
        };
        export function get(id: string) {
            return _plugins[id];
        };
    };
    export class Plugin {
        displayName: string = "Some Plugin!";
        id: string = "some-plugin";
        version: string = "1.0.0";
        description: string = "This is a plugin for PlainMihoyoLauncher";
        author: string = "Human";
        supporttedGame: clientType[] | "all" = "all";
        main: launchFunc;
        constructor(launchFunc: launchFunc) {
            this.main = launchFunc;
        };
    };
};