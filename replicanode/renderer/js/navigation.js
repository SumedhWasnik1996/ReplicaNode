import { on } from "./events.js";
import { getState } from "./store.js";
import { initLogin } from "./features/login.js";
import { initMetadata } from "./features/metadata.js";
import { initSettings } from "./features/settings.js";

export function initNavbar() {
  document.getElementById("navMetadata").onclick = () =>
    showScreen("metadata.html");

  document.getElementById("navSettings").onclick = () =>
    showScreen("settings.html");

  on("stateChanged", refreshNavbar);
}

function refreshNavbar() {
  const state = getState();

  document
    .getElementById("navMetadata")
    .classList.toggle("hidden", !state.isLoggedIn);

  document.getElementById("orgLabel").innerText =
    state.currentOrg || "";
}

export async function showScreen(screenFile) {
  const container = document.getElementById("screens");
  const html = await fetch(`screens/${screenFile}`).then(r => r.text());
  container.innerHTML = html;

  const state = getState();

  initLogin();
  if(state.isLoggedIn) initMetadata();
  initSettings();
}
