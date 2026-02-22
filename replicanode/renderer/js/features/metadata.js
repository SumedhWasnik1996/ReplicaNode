import{ renderFilePreview }      from "./filePreview.js";
import{ updateSelectedMetadata } from "../store.js";

const state = {
    allMetadataTypes      : [],
    filteredMetadataTypes : [],
    selected              : new Map(),
    activeType            : "",
    currentItems          : [],
    filteredItems         : []
};

export async function initMetadata(){
    const metadata = await window.api.getMetadata();
    metadata.sort();

    state.allMetadataTypes      = metadata || [];
    state.filteredMetadataTypes = [...state.allMetadataTypes];

    renderSidebar();
    renderMobileSelect();

    if(state.allMetadataTypes.length > 0){
        state.activeType = state.allMetadataTypes[0];
        await loadMetadataItems(state.activeType);
    }

    wireControls();
}

function wireControls(){
    document.getElementById("itemSearch")
                ?.addEventListener("input", e => filterItems(e.target.value));

    document.getElementById("selectAllBtn")
                ?.addEventListener("click",() => selectAll(true));

    document.getElementById("deselectAllBtn")
                ?.addEventListener("click",() => selectAll(false));
}

function renderSidebar(){
    renderSidebarList();

    document.getElementById("sidebarSearch")
                ?.addEventListener("input", e => filterSidebar(e.target.value));
}

function renderSidebarList(){
    const list     = document.getElementById("sidebarList");
    list.innerHTML = "";

    state.filteredMetadataTypes.forEach(type =>{
        const btn = document.createElement("button");

        btn.className = `w-full text-left px-3 py-2 text-sm hover:bg-gray-800
                            ${state.activeType === type 
                                    ? "bg-indigo-600/20 text-indigo-300 border-l-2 border-indigo-500" 
                                    : "text-gray-300"}
                            `;

        btn.textContent = type;

        btn.onclick = async() => {
            state.activeType = type;
            renderSidebarList();
            await loadMetadataItems(type);
        };

        list.appendChild(btn);
    });
}

function filterSidebar(query){
    state.filteredMetadataTypes = state.allMetadataTypes.filter(t => t.toLowerCase().includes(query.toLowerCase()));

    renderSidebarList();
}

function renderMobileSelect(){
    const select = document.getElementById("mobileGroupSelect");

    if(!select){
        return;
    }

    select.innerHTML = "";

    state.allMetadataTypes.forEach(type =>{
        const option = document.createElement("option");
        option.value = type;
        option.text  = type;
        select.appendChild(option);
    });

    select.onchange = async e =>{
        state.activeType = e.target.value;
        renderSidebarList();
        await loadMetadataItems(state.activeType);
    };
}

async function loadMetadataItems(type){
    const items = await window.api.getMetadataItems(type);

    items.sort((a, b) => a.fullName.localeCompare(b.fullName));

    state.currentItems  = items || [];
    state.filteredItems = [...state.currentItems];

    renderItems();
    updateSelectedCount();
}

function renderItems(){
    const itemsList = document.getElementById("itemsList");

    itemsList.innerHTML = state.filteredItems.map(item =>{
        const checked = state.selected.get(state.activeType)?.has(item.fullName);

        return `<div class="group bg-gray-800/70 hover:bg-gray-800 rounded-lg p-3 flex items-center justify-between 
                            cursor-pointer transition"
                        onclick="viewMetadata('${state.activeType}','${item.fullName}')">
                    <label class="flex items-center gap-3 text-sm truncate cursor-pointer">
                        <input type="checkbox"
                                class="accent-indigo-500"
                                value="${item.fullName}"
                                ${checked ? "checked" : ""}
                                onclick="event.stopPropagation()"
                                onchange="toggleSelection('${item.fullName}', this.checked)"/>
                        <span class="truncate">${item.fullName}</span>
                    </label>
                    <span class="text-gray-500 group-hover:text-indigo-400">🔍</span>
                </div>
                `;
                }).join("");
}

function updateSelectedCount(){
    const el    = document.getElementById("selectedCount");
    const count = state.selected.get(state.activeType)?.size || 0;
    if(el){
        el.textContent = `${count} selected`;
    }
}

function updateStateForSelectedMetadata(){
    const arr = [];

    for(const [key, value] of state.selected){
        arr.push({ type: key, name: Array.from(value) });
    }

    updateSelectedMetadata(arr);
    updateSelectedCount();
}

window.viewMetadata = async function(type, name){
    const header     = document.getElementById("previewHeader");
    header.innerHTML = `<span class="text-gray-400">Loading ${name}…</span>`;

    const detail = state.currentItems.find(m => m.fullName === name);
    const res    = await window.api.getMetadataContent(type, detail);

    if(!res.success){
        document.getElementById("fileViewer").innerText = res?.error || "No viewable content available.";
        return;
    }

    header.innerHTML = `<span class="text-gray-300 font-medium">${name}</span>`;

    await renderFilePreview("fileViewer", type, res.apiResponse);
};

window.toggleSelection = function(name, checked){
    const type = state.activeType;

    if(!state.selected.has(type)){
        state.selected.set(type, new Set());
    }

    const set = state.selected.get(type);

    checked ? set.add(name) : set.delete(name);

    updateStateForSelectedMetadata();
};

window.selectAll = function(value){
    document.querySelectorAll("#itemsList input[type='checkbox']")
        .forEach(cb =>{
            cb.checked = value;
            toggleSelection(cb.value, value);
        });
};

window.filterItems = function(query){
    state.filteredItems = state.currentItems.filter(i =>
        i.fullName.toLowerCase().includes(query.toLowerCase())
    );

    renderItems();
};