const { ipcMain } = require("electron");
const connector   = require("../../core/salesforceConnector");

function registerHandlers() {

    ipcMain.handle("login", async (event, username, password) => {
        if(!username || !password){
            return {
                success : false, 
                message : "Invalid Credentails"
            };
        }
        
        const sfconnector = await connector.login(username, password);
        return sfconnector;
    });

    ipcMain.handle("getMetadata", async () => {
        return await connector.getMetadata();
    });

    ipcMain.handle("logout", async () => {
        connector.logout();
        return { 
            success : true 
        };
    });

    ipcMain.handle("getMetadataItems", async (e, type) => {
        return await connector.getMetadataItems(type);
    });

    ipcMain.handle("getMetadataContent", async (e, type, name) => {
        return await connector.getMetadataContent(type, name);
    });

    ipcMain.handle("backup", async (event, selectedMetadataList) => {
        return await connector.backupMetadata(selectedMetadataList);
    });
}

module.exports = registerHandlers;
