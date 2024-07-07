const { contextBridge, ipcRenderer } = require("type-electron");
function sendApiWithoutArgs(name) {
    contextBridge.exposeInMainWorld(name, () => ipcRenderer.send(name));
};
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
};
function randomString(length = 10, sets = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_$") {
    let result = "";
    for (let i = 0; i < length; i++) {
        result += sets[randomInt(0, sets.length)];
    }
    return result;
};
sendApiWithoutArgs("quit");
sendApiWithoutArgs("minimize");
sendApiWithoutArgs("launch");
sendApiWithoutArgs("reload");
sendApiWithoutArgs("devtool");
ipcRenderer.on("showInfo", (_, e) => alert(e));
contextBridge.exposeInMainWorld("randomInt", randomInt);
contextBridge.exposeInMainWorld("randomString", randomString);
contextBridge.exposeInMainWorld("getClientList", () => {
    return new Promise((resolve) => {
        let id = randomString();
        ipcRenderer.send("get-client-list", id);
        ipcRenderer.on("get-client-list", (_, e) => {
            if (e.id === id) {
                resolve(e.data);
                ipcRenderer.removeAllListeners("get-client-list");
            };
        });
    });
});
contextBridge.exposeInMainWorld("getSettings", () => {
    return new Promise((resolve) => {
        let id = randomString();
        ipcRenderer.send("get-settings", id);
        ipcRenderer.on("get-settings", (_, e) => {
            if (e.id === id) {
                resolve(e.data);
                ipcRenderer.removeAllListeners("get-settings");
            };
        });
    });
});
contextBridge.exposeInMainWorld("selectFile", (filters) => {
    return ipcRenderer.invoke("select-file", filters);
});
contextBridge.exposeInMainWorld("selectFolder", (filters) => {
    return ipcRenderer.invoke("select-folder", filters);
});
contextBridge.exposeInMainWorld("createClient", (path, name, game) => {
    return ipcRenderer.invoke("create-client", { path, name, game });
});
contextBridge.exposeInMainWorld("loadClient", (path) => {
    return ipcRenderer.invoke("load-client", path);
}); 