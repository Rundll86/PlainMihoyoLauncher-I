import { ClientInfo, SettingType } from "../../common/dataStruct";
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