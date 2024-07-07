import { ClientInfo, ClientStatus, ClientType, SettingType } from "../../common/dataStruct";
type FileFilter = { name: string, extensions: string[] };
export function quit() {
    window.quit();
};
export function minimize() {
    window.minimize();
};
export function launch() {
    window.launch();
};
export function reload() {
    window.reload();
};
export function devtool() {
    window.devtool();
};
export function getClientList(): Promise<ClientInfo[]> {
    return window.getClientList();
};
export function getSettings(): Promise<SettingType> {
    return window.getSettings();
};
export function selectFile(filters: FileFilter[] = []): Promise<string> {
    return window.selectFile(filters);
};
export function selectFolder(): Promise<string> {
    return window.selectFolder();
};
export function createClient(path: string, name: string, game: ClientType): Promise<ClientStatus> {
    return window.createClient(path, name, game);
};
export function loadClient(path: string): Promise<ClientStatus> {
    return window.loadClient(path);
};