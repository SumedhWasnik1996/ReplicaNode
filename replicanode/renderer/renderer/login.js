export function initLogin() {
  const loginBtn = document.getElementById("loginBtn");
  if (!loginBtn) return;

  loginBtn.onclick = async () => {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    document.getElementById("loginSpinner").classList.remove("hidden");

    const result = await window.api.login({ username, password });

    document.getElementById("loginSpinner").classList.add("hidden");

    if (result.success) {
      document.getElementById("orgLabel").innerText = result.org;
      import("./navigation.js").then(mod => mod.showScreen("metadata.html"));
    } else {
      document.getElementById("loginError").innerText = result.message;
    }
  };
}
