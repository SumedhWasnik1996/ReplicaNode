const loginScreen    = document.getElementById("loginScreen");
const metadataScreen = document.getElementById("metadataScreen");

document.getElementById("loginBtn").onclick = async () => {

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    document.getElementById("loginSpinner").classList.remove("hidden");
    document.getElementById("loginError").innerText = "";

    const result = await window.api.login({ username, password });

    document.getElementById("loginSpinner").classList.add("hidden");

    if (result.success) {
        document.getElementById("orgName").innerText = result.org;
        loadMetadata();
        loginScreen.classList.add("hidden");
        metadataScreen.classList.remove("hidden");
    } else {
        document.getElementById("loginError").innerText = result.message;
    }
};


async function loadMetadata() {
    const metadata = await window.api.getMetadata();

    const groups = {
        Code: [
            "ApexClass",
            "ApexTrigger",
            "ApexPage",
            "LightningComponentBundle",
            "AuraDefinitionBundle"
        ],
        Automations: [
            "Flow",
            "Workflow",
            "ProcessBuilder",
            "ApprovalProcess"
        ],
        Objects: [
            "CustomObject",
            "StandardObject",
            "Layout",
            "CompactLayout",
            "RecordType",
            "FieldSet"
        ],
        Others: []
    };

    const groupedData = {
        Code: [],
        Automations: [],
        Objects: [],
        Others: []
    };

    metadata.forEach(type => {
        let placed = false;

        for (let group in groups) {
            if (groups[group].includes(type)) {
                groupedData[group].push(type);
                placed = true;
                break;
            }
        }

        if (!placed) {
            groupedData["Others"].push(type);
        }
    });

    renderTabs(groupedData);
}

function renderTabs(groupedData) {
    const container = document.getElementById("metadataList");

    container.innerHTML = `
        <div class="flex space-x-4 mb-4">
            ${Object.keys(groupedData).map(group => `
                <button class="tabBtn px-4 py-2 rounded"
                        data-tab="${group}">
                    ${group}
                </button>
            `).join("")}
        </div>

        ${Object.keys(groupedData).map(group => `
            <div class="tabContent hidden" id="tab-${group}">
                
                <!-- Search + Select All -->
                <div class="flex justify-between mb-3">
                    <input type="text"
                           placeholder="Search..."
                           class="searchInput input w-60"
                           data-group="${group}">
                    
                    <button class="selectAllBtn btn"
                            data-group="${group}">
                        Select All
                    </button>
                </div>

                <div class="metaContainer">
                    ${groupedData[group]
                        .sort((a,b)=>a.localeCompare(b))
                        .map(type => `
                            <label class="block metaItem">
                                <input type="checkbox"
                                       value="${type}"
                                       class="metaCheck"
                                       data-group="${group}">
                                ${type}
                            </label>
                        `).join("")}
                </div>

            </div>
        `).join("")}
    `;

    activateTabs();
    attachTabFeatures();
}


function activateTabs() {
    const buttons = document.querySelectorAll(".tabBtn");
    const contents = document.querySelectorAll(".tabContent");

    buttons.forEach(btn => {
        btn.onclick = () => {
            contents.forEach(c => c.classList.add("hidden"));
            buttons.forEach(b => b.classList.remove("bg-indigo-600"));

            document
                .getElementById(`tab-${btn.dataset.tab}`)
                .classList.remove("hidden");

            btn.classList.add("bg-indigo-600");
        };
    });

    // Activate first tab by default
    if (buttons.length > 0) {
        buttons[0].click();
    }
}

function attachTabFeatures() {

    // Select All
    document.querySelectorAll(".selectAllBtn").forEach(btn => {
        btn.onclick = () => {
            const group = btn.dataset.group;
            const checkboxes = document.querySelectorAll(
                `.metaCheck[data-group="${group}"]`
            );

            checkboxes.forEach(cb => cb.checked = true);
        };
    });

    // Search Filter
    document.querySelectorAll(".searchInput").forEach(input => {
        input.oninput = () => {
            const group = input.dataset.group;
            const filter = input.value.toLowerCase();

            const items = document.querySelectorAll(
                `#tab-${group} .metaItem`
            );

            items.forEach(item => {
                const text = item.innerText.toLowerCase();
                item.style.display = text.includes(filter)
                    ? "block"
                    : "none";
            });
        };
    });
}



document.getElementById("backupBtn").onclick = async () => {

    const selected = [...document.querySelectorAll(".metaCheck:checked")]
        .map(el => el.value);

    const progress = document.getElementById("backupProgress");

    if (selected.length === 0) {
        progress.innerText = "No metadata selected.";
        return;
    }

    progress.innerText = "Backing up...";

    const result = await window.api.backup(selected);

    if (result.success) {
        progress.innerText = `Backup completed at: ${result.location}`;
    } else {
        progress.innerText = "Backup failed.";
    }
};


document.getElementById("logoutBtn").onclick = async () => {
    await window.api.logout();
    metadataScreen.classList.add("hidden");
    loginScreen.classList.remove("hidden");
};
