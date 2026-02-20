
export function renderFilePreview(containerId, type, content) {
  const viewer = document.getElementById(containerId);
  if (!viewer) return;

  viewer.innerHTML = "";

  if (!content) {
    viewer.innerText = "No viewable content available";
    return;
  }

  if (content.Body) {
    renderCodeBlock(viewer, content.Body);
    return;
  }

  if (type === "LightningComponentBundle") {
    renderLwcBundle(viewer, content);
    return;
  }

  if (typeof content === "object") {
    renderCodeBlock(viewer, JSON.stringify(content, null, 2));
    return;
  }

  renderCodeBlock(viewer, content);
}

function renderCodeBlock(parent, code) {
  const pre = document.createElement("pre");
  pre.className =
    "bg-gray-900 p-3 rounded text-xs overflow-auto whitespace-pre-wrap";
  pre.textContent = code;

  parent.appendChild(pre);
}

function renderLwcBundle(parent, bundle) {
  Object.entries(bundle).forEach(([file, code]) => {
    const wrapper = document.createElement("div");
    wrapper.className = "mb-3 border border-white/10 rounded";

    wrapper.innerHTML = `
      <button class="w-full text-left px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-t">
        ${file}
      </button>
      <pre class="hidden bg-gray-900 p-3 text-xs overflow-auto whitespace-pre-wrap"></pre>
    `;

    const btn = wrapper.querySelector("button");
    const pre = wrapper.querySelector("pre");

    pre.textContent =
      typeof code === "object"
        ? JSON.stringify(code, null, 2)
        : code;

    btn.onclick = () => {
      pre.classList.toggle("hidden");
    };

    parent.appendChild(wrapper);
  });
}