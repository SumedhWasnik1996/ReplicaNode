const metadata = {
  code: ["ApexClass1", "ApexClass2", "LWC1", "VisualforcePage1"],
  objects: ["Account", "Contact", "CustomObject1", "CustomObject2"],
  automation: ["Flow1", "Workflow1", "ProcessBuilder1"]
};

export function initMetadata() {
  const tabs = document.querySelectorAll(".tab");
  if (!tabs.length) return;

  // Tab click
  tabs.forEach(tab => {
    tab.onclick = () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      loadMetadataTab(tab.dataset.tab);
    };
  });

  // Load default active tab
  const activeTab = document.querySelector(".tab.active");
  if (activeTab) loadMetadataTab(activeTab.dataset.tab);
}

export function loadMetadataTab(tab) {
  const tabContent = document.getElementById("tabContent");
  if (!tabContent) return;

  let items = metadata[tab] || [];
  items.sort();

  tabContent.innerHTML = items.map(i => `
    <label class="flex items-center bg-gray-700 dark:bg-gray-600 px-3 py-1 rounded hover:bg-gray-600">
      <input type="checkbox" class="mr-2 metadata-checkbox"> ${i}
    </label>
  `).join("");

  // Search filter
  const searchInput = document.getElementById("metadataSearch");
  if (searchInput) {
    searchInput.oninput = () => {
      const query = searchInput.value.toLowerCase();
      tabContent.querySelectorAll("label").forEach(label => {
        label.classList.toggle("hidden", !label.innerText.toLowerCase().includes(query));
      });
    };
  }

  // Select All
  const selectAllBtn = document.getElementById("selectAllBtn");
  if (selectAllBtn) {
    selectAllBtn.onclick = () => {
      const checkboxes = tabContent.querySelectorAll(".metadata-checkbox");
      const allChecked = Array.from(checkboxes).every(c => c.checked);
      checkboxes.forEach(c => c.checked = !allChecked);
    };
  }
}
