const fs = require("fs");
const path = require("path");

const settingsPath = path.join(__dirname, "..", "config", "settings.json");

function getSettings() {
  return JSON.parse(fs.readFileSync(settingsPath));
}

function saveSettings(data) {
  fs.writeFileSync(settingsPath, JSON.stringify(data, null, 2));
}

module.exports = { getSettings, saveSettings };
