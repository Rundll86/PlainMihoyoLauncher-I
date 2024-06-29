const { contextBridge, ipcRenderer } = require("type-electron");
contextBridge.exposeInMainWorld("quit", () => ipcRenderer.send("quit"));
contextBridge.exposeInMainWorld("minimize", () => ipcRenderer.send("minimize"));
contextBridge.exposeInMainWorld("launch", () => ipcRenderer.send("launch"));