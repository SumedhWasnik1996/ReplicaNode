export function initSettings() {
  const btn = document.getElementById("themeToggle");
  if (!btn) return;

  btn.onclick = () => {
    document.body.classList.toggle("bg-gray-900");
    document.body.classList.toggle("bg-white");
  };
}
