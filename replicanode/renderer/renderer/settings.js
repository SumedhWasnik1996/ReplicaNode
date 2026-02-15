export function initSettings() {
  const darkModeBtn = document.getElementById("darkModeBtn");
  if (darkModeBtn) darkModeBtn.onclick = () => document.documentElement.classList.add("dark");

  const lightModeBtn = document.getElementById("lightModeBtn");
  if (lightModeBtn) lightModeBtn.onclick = () => document.documentElement.classList.remove("dark");

  const chooseFolderBtn = document.getElementById("chooseFolderBtn");
  if (chooseFolderBtn) {
    chooseFolderBtn.onclick = async () => {
      const folder = await window.api.chooseFolder();
      if (folder) document.getElementById("folderPath").innerText = folder;
    };
  }
}
