const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
    login: (u, p)   => ipcRenderer.invoke("login", u, p),
    getMetadata: () => ipcRenderer.invoke("getMetadata"),
    backup: (types) => ipcRenderer.invoke("backup", types),
    logout: ()      => ipcRenderer.invoke("logout"),
    getMetadataItems: (type)         => ipcRenderer.invoke("getMetadataItems", type),
    getMetadataContent: (type, name) => ipcRenderer.invoke("getMetadataContent", type, name)
});
