const { ipcMain } = require("electron");
const connector = require("../../core/salesforceConnector");

function registerHandlers() {

    ipcMain.handle("sf-login", async (event, creds) => {
        return await connector.login(creds.username, creds.password);
    });

    ipcMain.handle("sf-get-metadata", async () => {
        return await connector.getMetadata();
    });

    ipcMain.handle("sf-backup", async (event, selected) => {
        return await connector.backupMetadata(selected);
    });

    ipcMain.handle("sf-logout", async () => {
        connector.logout();
        return { success: true };
    });

}

module.exports = registerHandlers;
