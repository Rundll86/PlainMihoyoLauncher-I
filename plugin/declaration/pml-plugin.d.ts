interface launchArg {
    game: clientType;
    path: string;
    client: {
        name: string;
        version: string;
    };
}
type clientType = "GenshinImpact" | "StarRail" | "ZZZ";
type launchFunc = (arg: launchArg) => void;
export declare namespace PlainMihoyoLauncher {
    namespace Plugins {
        function register(plugin: Plugin): void;
        function get(id: string): Plugin;
    }
    class Plugin {
        displayName: string;
        id: string;
        version: string;
        description: string;
        author: string;
        supporttedGame: clientType[] | "all";
        main: launchFunc;
        constructor(launchFunc: launchFunc);
    }
}
export {};
