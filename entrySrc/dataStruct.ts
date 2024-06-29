type gameInfo = {
    currentClient: string;
};
export type clientInfo = {
    name: string;
    version: string;
    path: string;
};
export type settingType = {
    games: {
        sr: gameInfo,
        gi: gameInfo,
        zzz: gameInfo
    }
};