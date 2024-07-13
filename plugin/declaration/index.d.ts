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
type launchFunc = (arg: launchArg) => void;
export declare namespace PlainMihoyoLauncher {
    export namespace CurrentPlugin {
        export function addEvent<T extends keyof PluginEvents>(name: T, func: PluginEvents[T]): void;
    };
};