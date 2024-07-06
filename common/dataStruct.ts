export type GameInfo = {
    currentClient: string;
};
export type ClientInfo = {
    name: string;
    version: string;
    path: string;
};
export type SettingType = {
    game: {
        sr: GameInfo,
        gi: GameInfo,
        zzz: GameInfo
    },
    launcher: {
        devTool: false
    }
};