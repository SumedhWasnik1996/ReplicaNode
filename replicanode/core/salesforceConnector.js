const jsforce = require("jsforce");
const fs = require("fs-extra");
const path = require("path");

let currentConnection = null;
let currentOrg = null;

async function login(username, password) {
    try {
        const conn = new jsforce.Connection();
        await conn.login(username, password);

        currentConnection = conn;
        currentOrg = username.replace(/[@.]/g, "_");

        return { success: true, org: currentOrg };
    } catch (err) {
        return {
            success: false,
            message: err.message || "Login failed"
        };
    }
}


async function getMetadata() {
    if (!currentConnection) throw new Error("Not logged in");

    const meta = await currentConnection.metadata.describe(60);
    return meta.metadataObjects.map(m => m.xmlName);
}

async function backupMetadata(selectedTypes) {
    if (!currentConnection) throw new Error("Not logged in");

    const backupDir = path.join(__dirname, "..", "data", currentOrg);
    await fs.ensureDir(backupDir);

    for (const type of selectedTypes) {
        const result = await currentConnection.metadata.list([{ type }], 60);
        await fs.writeJson(
            path.join(backupDir, `${type}.json`),
            result || []
        );
    }

    return { success: true, location: backupDir };
}

function logout() {
    currentConnection = null;
    currentOrg = null;
}

module.exports = {
    login,
    getMetadata,
    backupMetadata,
    logout
};
