import { on }           from "./events.js";
import { getState }     from "./store.js";
import { initLogin }    from "./features/login.js";
import { initMetadata } from "./features/metadata.js";
import { initSettings } from "./features/settings.js";

export function initNavbar() {
    document.getElementById("navMetadata").onclick = () =>
        showScreen("metadata.html");

    document.getElementById("navSettings").onclick = () =>
        showScreen("settings.html");

    document.getElementById("backupBtn")?.addEventListener("click", async () => {
        try{

            const state = getState();
            const selectedMetadata = state.selectedMetadata;

            if(!selectedMetadata || selectedMetadata.length === 0){
                alert("No metadata selected.");
                return;
            }

            await window.api.backup(selectedMetadata);
            alert("Backup completed!");
        }catch(error){
            console.error(error);
            alert("Backup failed.");
        }
    });

    on("stateChanged", refreshNavbar);
}

function refreshNavbar(){
    const state = getState();

    document.getElementById("navMetadata").classList.toggle("hidden", !state.isLoggedIn);

    document.getElementById("orgLabel").innerText = state.currentOrg || "";

    const backupBtn = document.getElementById("backupBtn");
    if(backupBtn){
        backupBtn.classList.toggle("hidden", state.selectedMetadata?.length === 0);
    }
}

export async function showScreen(screenFile){
    const html      = await fetch(`screens/${screenFile}`).then(r => r.text());
    
    const container     = document.getElementById("screens");
    container.innerHTML = html;

    const state = getState();

    initLogin();
    
    if(state.isLoggedIn){
        initMetadata();
    }
    
    initSettings();
}
