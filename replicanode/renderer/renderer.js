const loginScreen = document.getElementById("loginScreen");
const metadataScreen = document.getElementById("metadataScreen");

document.getElementById("loginBtn").onclick = async () => {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const result = await window.api.login({ username, password });

    if (result.success) {
        loadMetadata();
        loginScreen.classList.add("hidden");
        metadataScreen.classList.remove("hidden");
    }
};

async function loadMetadata() {
    const metadata = await window.api.getMetadata();
    const container = document.getElementById("metadataList");

    container.innerHTML = metadata.map(type => `
        <label class="block">
          <input type="checkbox" value="${type}" class="metaCheck">
          ${type}
        </label>
    `).join("");
}

document.getElementById("backupBtn").onclick = async () => {
    const selected = [...document.querySelectorAll(".metaCheck:checked")]
        .map(el => el.value);

    await window.api.backup(selected);
    alert("Backup completed");
};

document.getElementById("logoutBtn").onclick = async () => {
    await window.api.logout();
    metadataScreen.classList.add("hidden");
    loginScreen.classList.remove("hidden");
};
