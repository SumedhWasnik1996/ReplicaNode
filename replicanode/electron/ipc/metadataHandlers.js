const { ipcMain } = require("electron");
const connector = require("../../core/salesforceConnector");

function registerHandlers() {

    ipcMain.handle("login", async (event, username, password) => {
        if(!username || !password){
            return {success : false, message: "Invalid Credentails"};
        }
        const sfconnector = await connector.login(username, password);
        console.log('SF connector : ',sfconnector);
        return sfconnector;
    });

    ipcMain.handle("getMetadata", async () => {
        return await connector.getMetadata();
    });

    ipcMain.handle("backup", async (event, selected) => {
        return await connector.backupMetadata(selected);
    });

    ipcMain.handle("logout", async () => {
        connector.logout();
        return { success: true };
    });

    ipcMain.handle("getMetadataItems", async (e, type) => {
        const conn = getCurrentOrgConnection();
        return await getMetadataItems(conn, type);
    });

    ipcMain.handle("getMetadataContent", async (e, type, name) => {
        const conn = getCurrentOrgConnection();
        return await getMetadataContent(conn, type, name);
    });

}

module.exports = registerHandlers;
