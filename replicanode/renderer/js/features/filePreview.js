
export function renderFilePreview(containerId, type, content) {
    console.log("Render File Preview", containerId, type, content);

    const fileName  = content?.Name || '';

    const viewer = document.getElementById(containerId);
    if (!viewer) return;

    viewer.innerHTML = "";

    // 🔹 Root layout (flex column)
    viewer.className = "flex flex-col h-full";

    // ======================
    // 🔹 Sticky Header
    // ======================
    const header = document.createElement("div");
    header.className =
        "sticky top-0 z-10 bg-gray-800 border-b border-white/10 px-3 py-2 text-sm font-medium";
    header.textContent = fileName || "File Preview";

    // ======================
    // 🔹 Scrollable Body
    // ======================
    const body = document.createElement("div");
    body.className = "flex-1 overflow-auto p-2";

    // ======================
    // 🔹 Sticky Footer
    // ======================
    const footer = document.createElement("div");
    footer.className =
        "sticky bottom-0 z-10 bg-gray-800 border-t border-white/10 px-3 py-2 text-xs text-gray-300";
    footer.textContent = "End of preview";

    // Append layout
    viewer.appendChild(header);
    viewer.appendChild(body);
    viewer.appendChild(footer);

    // ======================
    // 🔹 Render content into BODY
    // ======================
    if (!content) {
        body.innerText = "No viewable content available";
        return;
    }

    if (content.Body) {
        renderCodeBlock(body, content.Body);
        return;
    }

    if (type === "LightningComponentBundle") {
        renderLwcBundle(body, content);
        return;
    }

    if (typeof content === "object") {
        renderCodeBlock(body, JSON.stringify(content, null, 2));
        return;
    }

    renderCodeBlock(body, content);
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