interface launchArg {
    game: clientType;
    path: string;
    client: {
        name: string;
        version: string;
    };
}
interface PluginEvents {
    onload: () => void;
    onlaunchGame: launchFunc;
}
type clientType = "YuanShen" | "StarRail" | "ZenlessZoneZero";
type launchFunc = (arg: launchArg) => void;
export declare namespace PlainMihoyoLauncher {
    export namespace CurrentPlugin {
        export function addEvent<T extends keyof PluginEvents>(name: T, func: PluginEvents[T]): void;
        export function requireArray(name: string): void;
        export function getRequiredArray<T>(name: string): T[];
    }
    export namespace MessageBox {
        export function showInfo(msg: string): void;
    }
}