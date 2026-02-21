let monacoInstance = null;
let monacoReady    = false;

function ensureMonacoReady(){
    return new Promise((resolve) => {
        if(monacoReady) return resolve();

        require(["vs/editor/editor.main"], function(){
            monacoReady = true;
            resolve();
        });
    });
}

export async function renderFilePreview(containerId, type, content){
    await ensureMonacoReady();

    const viewer = document.getElementById(containerId);
    if(!viewer){
        return;
    }

    viewer.innerHTML = "";
    viewer.className = "flex flex-col w-full h-full min-h-0 bg-[#1e1e1e] text-gray-200 rounded overflow-hidden";

    const header     = document.createElement("div");
    header.className = "flex-shrink-0 bg-[#252526] px-3 py-2 text-sm flex items-center gap-2";

    const editorWrapper     = document.createElement("div");
    editorWrapper.className = "flex-1 relative min-h-0 flex flex-col";

    const footer     = document.createElement("div");
    footer.className = "flex-shrink-0 bg-[#007acc] text-white text-xs px-3 py-1 flex items-center";

    viewer.append(header, editorWrapper, footer);

    if(!content){
        editorWrapper.innerText = "No viewable content available";
        footer.textContent      = "No content";
        return;
    }

    const fileName = content?.fileName || "";

    header.innerHTML = `
        <span>${getFileIcon(fileName)}</span>
        <span class="font-medium truncate">${fileName}</span>
        <span class="text-xs text-gray-500 ml-auto">${type}</span>
    `;

    if(type === "LightningComponentBundle"){
        console.log('LWC Content : ', content);
        const lwcName = content.records[0].FilePath.split('/')[1] || '';
        renderLwcTabs(editorWrapper, header, footer, content, lwcName);
        return;
    }

    const codeText = content.Body ?? (typeof content === "object"
                                                ? JSON.stringify(content, null, 2)
                                                : content);

    createOrUpdateMonaco(editorWrapper, codeText, fileName);
    updateFooterStats(footer, codeText);
}

function renderLwcTabs(editorWrapper, header, footer, bundle, folderName){
    const files      = bundle.records;
    let activeFileId = files[0].Id;

    const tabsBar     = document.createElement("div");
    tabsBar.className = "flex bg-[#2d2d2d] border-b border-black/40 overflow-x-auto";

    const editorArea     = document.createElement("div");
    editorArea.className = "flex-1 min-h-0";

    editorWrapper.append(tabsBar, editorArea);

    function openFile(fileId){
        activeFileId = fileId;

        const fileData = files.find( file => file.Id === fileId);
        const codeText = fileData.Source || '';
        const fileName = fileData.FilePath.split('/')[2] || '';

        header.innerHTML = `
            <span>📦</span>
            <span class="font-medium truncate">
                ${folderName} > ${fileName}
            </span>
            <span class="text-xs text-gray-500 ml-auto">LWC</span>
        `;

        createOrUpdateMonaco(editorArea, codeText, fileName);
        updateFooterStats(footer, codeText);
        renderTabs();
    }

    function renderTabs(){
        tabsBar.innerHTML = "";

        files.forEach((file) => {
            const isActive = file.Id === activeFileId;

            const fileName = file.FilePath.split('/')[2] || '';

            const tab      = document.createElement("button");
            tab.className  = "px-4 py-2 text-xs font-mono border-r border-black/40 whitespace-nowrap " +
                                (isActive
                                    ? "bg-[#1e1e1e] text-white"
                                    : "bg-[#2d2d2d] text-gray-300 hover:bg-[#3a3a3a]");

            tab.innerHTML  = `${getFileIcon(fileName)} ${fileName}`;
            tab.onclick    = () => openFile(file.Id);

            tabsBar.appendChild(tab);
        });
    }

    openFile(activeFileId);
}

function createOrUpdateMonaco(container, code, fileName){
    const language = detectLanguage(fileName);

    if(monacoInstance){
        const currentDom = monacoInstance.getDomNode();

        if(!container.contains(currentDom)){
            monacoInstance.dispose();
            monacoInstance = null;
        }
    }

    if(!monacoInstance){
        const model = monaco.editor.createModel(code, language);

        monacoInstance = monaco.editor.create(container, {
                                                            model,
                                                            theme               : "vs-dark",
                                                            readOnly            : true,
                                                            automaticLayout     : true,
                                                            fontSize             : 12,
                                                            scrollBeyondLastLine : false,
                                                            minimap : { 
                                                                        enabled : false
                                                                    },
                                                        });
    }else{
        const oldModel = monacoInstance.getModel();
        const newModel = monaco.editor.createModel(code, language);

        monacoInstance.setModel(newModel);

        oldModel?.dispose();

        monacoInstance.layout();
    }
}

// ================= LANGUAGE DETECTION =================
function detectLanguage(fileName = ""){
    const ext = fileName.split(".").pop()?.toLowerCase();

    const map = {
        js   : "javascript",
        ts   : "typescript",
        html : "html",
        css  : "css",
        xml  : "xml",
        json : "json",
        cls  : "java",
        apex : "java",
    };

    return map[ext] || "plaintext";
}

// ================= FILE ICONS =================
function getFileIcon(fileName = ""){
    const ext = fileName.split(".").pop()?.toLowerCase();

    const map = {
        js   : "🟨",
        ts   : "🟦",
        html : "🟥",
        css  : "🟪",
        xml  : "🟧",
        json : "🟫",
        cls  : "🧩",
        apex : "🧩",
    };

    return map[ext] || "📄";
}

// ================= FOOTER STATS =================
function updateFooterStats(footer, codeText){
    const lines = codeText.split("\n").length;
    const chars = codeText.length;

    footer.textContent = `Ln ${lines} • ${chars.toLocaleString()} chars`;
}