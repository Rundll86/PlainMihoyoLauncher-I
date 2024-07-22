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
sendApiWithoutArgs("reload");
sendApiWithoutArgs("devtool");
ipcRenderer.on("showInfo", (_, e) => alert(e));
contextBridge.exposeInMainWorld("launch", (game) => {
    ipcRenderer.send("launch", game);
});
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
contextBridge.exposeInMainWorld("saveSettings", (settings) => {
    return ipcRenderer.send("save-settings", settings);
});
contextBridge.exposeInMainWorld("saveClient", (client) => {
    return ipcRenderer.send("save-client", client);
});
contextBridge.exposeInMainWorld("openClientFolder", (name) => {
    return ipcRenderer.send("open-client-folder", { name });
});
contextBridge.exposeInMainWorld("openPmlClientFolder", (name) => {
    return ipcRenderer.send("open-PML-client-folder", { name });
});
contextBridge.exposeInMainWorld("openClientConfigFile", (name) => {
    return ipcRenderer.send("open-client-config-file", { name });
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
contextBridge.exposeInMainWorld("loadClient", (path, game) => {
    return ipcRenderer.invoke("load-client", { path, game });
});
contextBridge.exposeInMainWorld("generateLaunchCommand", (name, type) => {
    return ipcRenderer.invoke("generate-launch-command", { name, type });
});
contextBridge.exposeInMainWorld("getClientPluginList", (name) => {
    return ipcRenderer.invoke("get-client-plugin-list", name);
});