const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
    login: (creds) => ipcRenderer.invoke("sf-login", creds),
    getMetadata: () => ipcRenderer.invoke("sf-get-metadata"),
    backup: (types) => ipcRenderer.invoke("sf-backup", types),
    logout: () => ipcRenderer.invoke("sf-logout")
});
