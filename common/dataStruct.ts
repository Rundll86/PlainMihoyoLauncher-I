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
    plugins: string[];
    name: string;
    version: string;
    type: ClientType;
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