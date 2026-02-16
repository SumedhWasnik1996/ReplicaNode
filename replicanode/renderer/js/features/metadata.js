const metadataState = {
  allMetadataTypes: [],
  filteredMetadataTypes: [],
  selected: new Set(),
  activeType: "",
  currentItems: [],
  filteredItems: []
};

export async function initMetadata() {
  const metadata = await window.api.getMetadata();
  metadata.sort();

  metadataState.allMetadataTypes = metadata || [];
  metadataState.filteredMetadataTypes = [...metadataState.allMetadataTypes];

  renderSidebar();
  renderMobileSelect();

  if (metadataState.allMetadataTypes.length > 0) {
    metadataState.activeType = metadataState.allMetadataTypes[0];
    loadMetadataItems(metadataState.activeType);
  }
}

function renderSidebar() {
  const sidebar = document.getElementById("metadataSidebar");

  sidebar.innerHTML = `
    <div class="p-2 border-b border-white/10">
      <input 
        id="sidebarSearch"
        type="text"
        placeholder="Search metadata..."
        class="w-full px-2 py-1 rounded bg-gray-800 text-white text-sm"
      />
    </div>
    <div id="sidebarList" class="overflow-y-auto flex-1"></div>
  `;

  document.getElementById("sidebarSearch")
          .addEventListener("input", (e) => filterSidebar(e.target.value));

  renderSidebarList();
}

function renderSidebarList() {
  const list = document.getElementById("sidebarList");
  list.innerHTML = "";

  metadataState.filteredMetadataTypes.forEach(type => {
    const btn = document.createElement("button");
    btn.innerText = type;
    btn.className = "w-full text-left px-3 py-2 hover:bg-gray-700 border-b border-white/10 text-sm";

    btn.onclick = () => {
      metadataState.activeType = type;
      highlightActiveType();
      loadMetadataItems(type);
    };

    list.appendChild(btn);
  });

  highlightActiveType();
}

function filterSidebar(query) {
  metadataState.filteredMetadataTypes =
    metadataState.allMetadataTypes.filter(t =>
      t.toLowerCase().includes(query.toLowerCase())
    );

  renderSidebarList();
}

function highlightActiveType() {
  const buttons = document.querySelectorAll("#sidebarList button");
  buttons.forEach(btn => {
    btn.classList.remove("bg-gray-700");
    if (btn.innerText === metadataState.activeType) {
      btn.classList.add("bg-gray-700");
    }
  });
}

function renderMobileSelect() {
  const select = document.getElementById("mobileGroupSelect");
  if (!select) return;

  select.innerHTML = "";

  metadataState.allMetadataTypes.forEach(type => {
    const option = document.createElement("option");
    option.value = type;
    option.text = type;
    select.appendChild(option);
  });

  select.value = metadataState.activeType;
  select.onchange = (e) => {
    metadataState.activeType = e.target.value;
    renderSidebarList();
    loadMetadataItems(metadataState.activeType);
  };
}

async function loadMetadataItems(type) {

  const items = await window.api.getMetadataItems(type);
  metadataState.currentItems = items || [];
  metadataState.filteredItems = [...metadataState.currentItems];

  renderContent();
}

function renderContent() {
  const itemsList = document.getElementById("itemsList");
  if (!itemsList) return;

  // Render metadata items as cards
  itemsList.innerHTML = metadataState.filteredItems.map(item => `
    <div class="bg-gray-800 rounded-lg p-3 flex justify-between items-center shadow hover:bg-gray-750">
      <label class="flex items-center gap-2 text-sm truncate">
        <input type="checkbox"
               value="${item}"
               ${metadataState.selected.has(item) ? "checked" : ""}
               onchange="toggleSelection('${item}', this.checked)">
        <span class="truncate">${item}</span>
      </label>

      <button onclick="viewMetadata('${metadataState.activeType}','${item}')"
              class="text-blue-400 hover:text-blue-300 text-lg px-2">
        🔍
      </button>
    </div>
  `).join("");
}

window.viewMetadata = async function (type, name) {
  const viewer = document.getElementById("fileViewer");
  viewer.innerText = "Loading...";

  const content = await window.api.getMetadataContent(type, name);
  if (!content) {
    viewer.innerText = "No viewable content available.";
    return;
  }

  viewer.innerText = typeof content === "object" ? JSON.stringify(content, null, 2) : content;

  // Auto scroll to top
  viewer.scrollTop = 0;
};

window.toggleSelection = function (item, checked) {
  if (checked) metadataState.selected.add(item);
  else metadataState.selected.delete(item);
};

window.selectAll = function (value) {
  document.querySelectorAll("#itemsList input[type='checkbox']").forEach(cb => {
    cb.checked = value;
    toggleSelection(cb.value, value);
  });
};

window.filterItems = function(query) {
  metadataState.filteredItems = metadataState.currentItems.filter(i =>
    i.toLowerCase().includes(query.toLowerCase())
  );
  renderContent();
};
