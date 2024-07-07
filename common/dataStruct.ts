export enum ClientType { GenshinImpact, StarRail, ZenlessZoneZero };
export interface GameInfo {
    currentClient: string;
};
export interface ClientInfo {
    name: string;
    version: string;
    path: string;
    type: ClientType;
    game: string;
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
        sr: GameInfo;
        gi: GameInfo;
        zzz: GameInfo;
    };
    launcher: {
        devTool: false;
    };
};
export interface ClientStatus {
    status: boolean;
    message: string;
};