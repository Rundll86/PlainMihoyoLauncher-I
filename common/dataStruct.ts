export enum ClientType { GenshinImpact = "YuanShen", StarRail = "StarRail", ZenlessZoneZero = "ZenlessZoneZero" };
export interface GameInfo {
    currentClient: string;
    label: string;
};
export interface ClientInfo {
    path: string;
};
export interface ClientConfigFile {
    path: string;
    disabledPlugins: string[];
    name: string;
    version: string;
    type: ClientType;
    launch: {
        fullscreen: boolean;
        workdir: string;
        window: {
            width: number;
            height: number;
        };
        arg: string;
    };
}
export interface SettingType {
    game: {
        YuanShen: GameInfo;
        StarRail: GameInfo;
        ZenlessZoneZero: GameInfo;
    };
    launcher: {
        devTool: false;
    };
};
export interface ClientStatus {
    status: boolean;
    message: any;
};
export interface PlainPlugin {
    displayName: string;
    id: string;
    version: string;
    description: string;
    author: string;
    supporttedGame: ClientType[] | "all";
};