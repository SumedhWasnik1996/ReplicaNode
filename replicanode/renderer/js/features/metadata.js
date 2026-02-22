import { renderFilePreview }      from "./filePreview.js";
import { updateSelectedMetadata } from "../store.js";

const currentMetadataState = {
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

    currentMetadataState.allMetadataTypes = metadata || [];
    currentMetadataState.filteredMetadataTypes = [...currentMetadataState.allMetadataTypes];

    renderSidebar();
    renderMobileSelect();

    if(currentMetadataState.allMetadataTypes.length > 0){
        currentMetadataState.activeType = currentMetadataState.allMetadataTypes[0];
        loadMetadataItems(currentMetadataState.activeType);
    }
}

function renderSidebar(){
    const sidebar = document.getElementById("metadataSidebar");

    sidebar.innerHTML = `
        <div class="p-2 border-b border-white/10">
            <input 
                id="sidebarSearch"
                type="text"
                placeholder="Search metadata..."
                class="w-full px-2 py-1 rounded bg-gray-800 text-white text-sm"/>
        </div>
        
        <div id="sidebarList" class="overflow-y-auto flex-1">
        </div>
    `;

    document
        .getElementById("sidebarSearch")
        .addEventListener("input", (e) => filterSidebar(e.target.value));

    renderSidebarList();
}

function renderSidebarList(){
    const list = document.getElementById("sidebarList");
    list.innerHTML = "";

    currentMetadataState.filteredMetadataTypes.forEach(type => {
        const btn = document.createElement("button");
        btn.innerText = type;
        btn.className = "w-full text-left px-3 py-2 hover:bg-gray-700 border-b border-white/10 text-sm";

        btn.onclick =() => {
            currentMetadataState.activeType = type;
            highlightActiveType();
            loadMetadataItems(type);
        };

        list.appendChild(btn);
    });

    highlightActiveType();
}

function filterSidebar(query){
    currentMetadataState.filteredMetadataTypes =
        currentMetadataState.allMetadataTypes
            .filter(
                type => type
                            .toLowerCase()
                            .includes(query.toLowerCase())
            );

    renderSidebarList();
}

function highlightActiveType(){
    const buttons = document.querySelectorAll("#sidebarList button");
    buttons.forEach(btn => {
        btn.classList.remove("bg-gray-700");
        if(btn.innerText === currentMetadataState.activeType){
            btn.classList.add("bg-gray-700");
        }
    });
}

function renderMobileSelect(){
    const select = document.getElementById("mobileGroupSelect");
    
    if(!select){
        return;
    }

    select.innerHTML = "";

    currentMetadataState.allMetadataTypes.forEach(type => {
        const option = document.createElement("option");
        option.value = type;
        option.text  = type;
        select.appendChild(option);
    });

    select.value = currentMetadataState.activeType;
    select.onchange = (e) => {
        currentMetadataState.activeType = e.target.value;
        renderSidebarList();
        loadMetadataItems(currentMetadataState.activeType);
    };
}

async function loadMetadataItems(type){

    const items = await window.api.getMetadataItems(type);
    currentMetadataState.currentItems  = items || [];
    currentMetadataState.filteredItems = [...currentMetadataState.currentItems];

    renderContent();
}

function renderContent(){
    const itemsList = document.getElementById("itemsList");
    
    if(!itemsList){
        return;
    }

    // Render metadata items as cards
    itemsList.innerHTML = currentMetadataState.filteredItems
        .map(
            item => `
                        <div class="bg-gray-800 rounded-lg p-3 flex justify-between items-center shadow hover:bg-gray-750">
                            <label class="flex items-center gap-2 text-sm truncate">
                                <input type="checkbox"
                                        value="${item.fullName}"
                                        ${currentMetadataState.selected
                                                                .get(currentMetadataState.activeType)
                                                                ?.has(item.fullName) 
                                            ? "checked" 
                                            : ""
                                        }
                                        onchange="toggleSelection('${item.fullName}', this.checked)">
                                <span class="truncate">
                                    ${item.fullName}
                                </span>
                            </label>

                            <button class="text-blue-400 hover:text-blue-300 text-lg px-2" 
                                    onclick="viewMetadata('${currentMetadataState.activeType}','${item.fullName}')">
                                🔍
                            </button>
                        </div>
                    `).join("");
}

function updateStateForSelectedMetadata(){
    console.log(currentMetadataState.selected);

    let selectedMetadataArray = [];

    for(const [key, value] of currentMetadataState.selected){
        selectedMetadataArray.push({
            type : key,
            name : Array.from(value) 
        });
    }

    console.log('Selected Metadata Array : ',selectedMetadataArray);

    updateSelectedMetadata(selectedMetadataArray);
}

window.viewMetadata = async function(type, name){
    const viewer = document.getElementById("fileViewer");
    viewer.innerText = "Loading...";

    const detail = currentMetadataState.currentItems
                        .find(metadata => metadata.fullName === name);

    const apiResponseDetails = await window.api.getMetadataContent(type, detail);

    console.log('API Response Details : ', apiResponseDetails);

    if(!apiResponseDetails.success){
        viewer.innerText = apiResponseDetails?.error || "No viewable content available.";
        return;
    }

    await renderFilePreview("fileViewer", type, apiResponseDetails.apiResponse);
};

window.toggleSelection = function(name, checked){
    const type = currentMetadataState.activeType;

    if(!currentMetadataState.selected.has(type)){
        currentMetadataState.selected.set(type, new Set());
    }

    const typeSet = currentMetadataState.selected.get(type);

    if(checked){
        typeSet.add(name);
    }else{
        typeSet.delete(name);
    }

    updateStateForSelectedMetadata();
};

window.selectAll = function(value){
    document.querySelectorAll("#itemsList input[type='checkbox']")
    .forEach(cb => {
                cb.checked = value;
                toggleSelection(cb.value, value);
            });
};

window.filterItems = function(query){
    currentMetadataState.filteredItems = currentMetadataState.currentItems
    .filter(i => i.toLowerCase()
                    .includes(query.toLowerCase())
    );

    renderContent();
};
