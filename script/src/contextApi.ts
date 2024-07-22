import { ClientConfigFile, ClientStatus, ClientType, PlainPlugin, SettingType } from "../../common/dataStruct";
type FileFilter = { name: string, extensions: string[] };
export function quit() {
    window.quit();
};
export function minimize() {
    window.minimize();
};
export function launch(game: string) {
    window.launch(game);
};
export function reload() {
    window.reload();
};
export function devtool() {
    window.devtool();
};
export function getClientList(): Promise<ClientConfigFile[]> {
    return window.getClientList();
};
export function getSettings(): Promise<SettingType> {
    return window.getSettings();
};
export function saveSettings(settings: SettingType) {
    return window.saveSettings(settings);
};
export function saveClient(client: ClientConfigFile) {
    return window.saveClient(client);
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
export function loadClient(path: string, game: ClientType): Promise<ClientStatus> {
    return window.loadClient(path, game);
};
export function openClientFolder(name: string) {
    return window.openClientFolder(name);
};
export function openPmlClientFolder(name: string) {
    return window.openPmlClientFolder(name);
};
export function openClientConfigFile(name: string) {
    return window.openClientConfigFile(name);
};
export function generateLaunchCommand(name: string, type: "cmd" | "powershell"): Promise<string> {
    return window.generateLaunchCommand(name, type);
};
export function getClientPluginList(name: string): Promise<PlainPlugin[]> {
    return window.getClientPluginList(name);
};