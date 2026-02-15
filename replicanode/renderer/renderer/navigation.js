export function initNavigation() {
  const navLogin = document.getElementById("navLogin");
  if (navLogin) navLogin.onclick = () => showScreen("login.html");

  const navMetadata = document.getElementById("navMetadata");
  if (navMetadata) navMetadata.onclick = () => showScreen("metadata.html");

  const settingsBtn = document.getElementById("settingsBtn");
  if (settingsBtn) settingsBtn.onclick = () => showScreen("settings.html");
}

export async function showScreen(file) {
  const screensContainer = document.getElementById("screens");
  const html = await fetch(file).then(r => r.text());
  screensContainer.innerHTML = html;

  const screenDiv = screensContainer.firstElementChild;
  if (screenDiv) screenDiv.classList.remove("hidden");

  // Re-init modules after screen load
  import("./login.js").then(mod => mod.initLogin());
  import("./metadata.js").then(mod => mod.initMetadata());
  import("./settings.js").then(mod => mod.initSettings());
}
