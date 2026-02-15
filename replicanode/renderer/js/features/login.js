import { setState } from "../store.js";
import { showScreen } from "../navigation.js";

export function initLogin() {
  const btn = document.getElementById("loginBtn");
  if (!btn) return;

  btn.onclick = async () => {
    document.getElementById("loginError").innerText = '';

    const u = "salesforcedeveloper086@playful-panda-fn4s1l.com"; //document.getElementById("username").value;
    const p = "qwerT123456$$s7bFRR00Fu4Nx2nbxCJwubIf"; //document.getElementById("password").value;
    
    if (!u || !p) {
      document.getElementById("loginError").innerText =
        "Please enter username and password";
      return;
    }

    const res = await window.api.login(u, p);

    if (res.success) {
      setState({ isLoggedIn: true, currentOrg: res?.org || "test org" });
      showScreen("metadata.html");
    } else {
      document.getElementById("loginError").innerText = res.message;
    }
  };
}
