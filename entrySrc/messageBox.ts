import { BrowserWindow } from "type-electron";
var _window: BrowserWindow | null = null;
function checkRootWindow() {
    if (!_window) {
        throw new Error("require a window.");
    };
};
export function useRootWindow(target: BrowserWindow) {
    _window = target;
};
export function showInfo(msg: string) {
    checkRootWindow();
    _window?.webContents.send("showInfo", msg);
};