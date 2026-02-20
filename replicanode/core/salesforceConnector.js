const jsforce = require("jsforce");
const fs = require("fs-extra");
const path = require("path");

let currentConnection = null;
let currentOrg = null;

const METADATA_PREVIEW_CONFIG = {
  ApexClass: {
    api: 'tooling',
    object: 'ApexClass',
    bodyField: 'Body',
    isText: true
  },
  ApexTrigger: {
    api: 'tooling',
    object: 'ApexTrigger',
    bodyField: 'Body',
    isText: true
  },
  ApexPage: {
    api: 'tooling',
    object: 'ApexPage',
    bodyField: 'Markup',
    isText: true
  },
  ApexComponent: {
    api: 'tooling',
    object: 'ApexComponent',
    bodyField: 'Markup',
    isText: true
  },
  LightningComponentBundle: {
    api: 'tooling-bundle',
    object: 'LightningComponentResource',
    isText: true
  },
  StaticResource: {
    api: 'metadata',
    isText: false
  }
};

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
        return result;
    }

    return [result];
}

async function getMetadataContent(metadataType, metadataDetails) {
    try {
        
        if (!currentConnection) throw new Error("Not logged in");

        const config = METADATA_PREVIEW_CONFIG[metadataType];

        if (!config) {
            throw new Error(`Preview not supported for ${metadataType}`);
        }

        console.log('metadataType : ', metadataType);
        
        console.log('metadataDetails : ', JSON.stringify(metadataDetails));


        if (config.api === 'tooling') {
            const record = await currentConnection.tooling
                .sobject(config.object)
                .retrieve(metadataDetails.id);

            return {
                success: true,
                type: metadataType,
                name: record.Name,
                apiVersion: record.ApiVersion,
                lastModifiedDate: record.LastModifiedDate,
                lastModifiedBy: record.LastModifiedById,
                content: record[config.bodyField],
                isText: config.isText
            };
        }

            // -----------------------------
            // LWC / Aura bundles
            // -----------------------------
        if (config.api === 'tooling-bundle') {
            const res = await currentConnection.tooling.query(`
                SELECT Id, FilePath, Format, Source
                FROM LightningComponentResource
                WHERE LightningComponentBundleId = '${metadataDetails.bundleId}'
            `);

            return {
                success: true,
                type: metadataType,
                files: res.records,
                isText: true
            };
        }

            // -----------------------------
            // METADATA API fallback
            // -----------------------------
        if (config.api === 'metadata') {
            const meta = await currentConnection.metadata.read(
                metadataType,
                metadataDetails.fullName
            );

            return {
                success: true,
                type: metadataType,
                content: meta,
                isText: false
            };
        }

    } catch (error) {
        console.error("Error reading metadata:", error);
        return {
            success: false,
            error: error.message
        };
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
