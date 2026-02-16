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

    const meta = await currentConnection.metadata.describe(currentConnection?.version || 60);
    return meta.metadataObjects.map(m => m.xmlName);
}

async function backupMetadata(selectedTypes) {
    if (!currentConnection) throw new Error("Not logged in");

    const backupDir = path.join(__dirname, "..", "data", currentOrg);
    await fs.ensureDir(backupDir);

    for (const type of selectedTypes) {
        const result = await currentConnection.metadata.list([{ type }], currentConnection?.version || 60);
        await fs.writeJson(
            path.join(backupDir, `${type}.json`),
            result || []
        );
    }

    return { success: true, location: backupDir };
}

async function getMetadataItems(type) {
    if (!currentConnection) throw new Error("Not logged in");

    const result = await currentConnection.metadata.list([{ type }], currentConnection.version || 60);

    if (!result) return [];

    if (Array.isArray(result)) {
        return result.map(r => r.fullName).sort();
    }

    return [result.fullName];
}

async function getMetadataContent(type, name) {
    try {
        const res = await currentConnection.metadata.read(type, [name]);

        return JSON.stringify(res, null, 2);

    } catch (error) {
        console.error("Error reading metadata:", error);
        return null;
    }
}

function logout() {
    currentConnection = null;
    currentOrg = null;
}

module.exports = {
    login,
    getMetadata,
    backupMetadata,
    logout,
    getMetadataItems,
    getMetadataContent
};
