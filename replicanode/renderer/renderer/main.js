import { initNavigation, showScreen } from "./navigation.js";
import { initLogin }                  from "./login.js";
import { initMetadata }               from "./metadata.js";
import { initSettings }               from "./settings.js";

const root = document.getElementById("root");

async function loadApp() {
  // Load navbar
  const navbar = await fetch("navbar.html").then(r => r.text());
  root.innerHTML = navbar;

  // Screens container
  const screensContainer = document.createElement("div");
  screensContainer.id = "screens";
  root.appendChild(screensContainer);

  // Load login screen by default
  const loginHTML = await fetch("login.html").then(r => r.text());
  screensContainer.innerHTML = loginHTML;

  // Initialize modules
  initNavigation();
  initLogin();
  initMetadata();
  initSettings();
}

loadApp();
