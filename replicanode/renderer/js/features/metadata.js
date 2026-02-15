const metadataGroups = {
  "AI_and_Einstein": [
    "AIApplication",
    "AIApplicationConfig",
    "MLDataDefinition",
    "MLPredictionDefinition",
    "MLRecommendationDefinition",
    "RecommendationStrategy"
  ],
  "Apex_and_Programmatic_Logic": [
    "ApexClass",
    "ApexComponent",
    "ApexEmailNotifications",
    "ApexPage",
    "ApexTestSuite",
    "ApexTrigger",
    "Scontrol"
  ],
  "Automation": [
    "ApprovalProcess",
    "AssignmentRules",
    "AutoResponseRules",
    "EntitlementProcess",
    "EntitlementTemplate",
    "EscalationRules",
    "Flow",
    "FlowCategory",
    "FlowDefinition",
    "FlowTest",
    "MilestoneType",
    "ProcessFlowMigration",
    "Workflow"
  ],
  "Data_Model": [
    "CustomIndex",
    "CustomLabels",
    "CustomMetadata",
    "CustomObject",
    "CustomObjectTranslation",
    "DataCategoryGroup",
    "DuplicateRule",
    "FieldRestrictionRule",
    "GlobalValueSet",
    "GlobalValueSetTranslation",
    "MatchingRules",
    "RestrictionRule",
    "StandardValueSet",
    "StandardValueSetTranslation",
    "SynonymDictionary"
  ],
  "Analytics_and_Reporting": [
    "AnalyticSnapshot",
    "Dashboard",
    "Report",
    "ReportType"
  ],
  "UI_and_Lightning": [
    "CustomApplication",
    "CustomApplicationComponent",
    "CustomPageWebLink",
    "CustomTab",
    "FlexiPage",
    "HomePageComponent",
    "HomePageLayout",
    "Layout",
    "LightningBolt",
    "LightningComponentBundle",
    "LightningExperienceTheme",
    "LightningMessageChannel",
    "LightningOnboardingConfig",
    "PathAssistant",
    "Prompt",
    "QuickAction",
    "RecordActionDeployment"
  ],
  "Experience_Cloud": [
    "Audience",
    "BrandingSet",
    "Community",
    "CommunityTemplateDefinition",
    "CommunityThemeDefinition",
    "DigitalExperienceBundle",
    "DigitalExperienceConfig",
    "ExperienceBundle",
    "ExperienceContainer",
    "ExperiencePropertyTypeBundle",
    "ManagedTopics",
    "ModerationRule",
    "NavigationMenu",
    "Network",
    "NetworkBranding",
    "SharingSet",
    "TopicsForObjects"
  ],
  "Security_and_Access_Control": [
    "Certificate",
    "ExternalCredential",
    "Group",
    "IPAddressRange",
    "MutingPermissionSet",
    "MyDomainDiscoverableLogin",
    "NamedCredential",
    "OauthCustomScope",
    "OauthTokenExchangeHandler",
    "PermissionSet",
    "PermissionSetGroup",
    "PersonAccountOwnerPowerUser",
    "PortalDelegablePermissionSet",
    "Profile",
    "ProfilePasswordPolicy",
    "ProfileSessionSetting",
    "Queue",
    "Role",
    "SamlSsoConfig",
    "SharingRules",
    "TransactionSecurityPolicy"
  ],
  "Integration_and_API": [
    "ConnectedApp",
    "CorsWhitelistOrigin",
    "EventRelayConfig",
    "ExternalClientApplication",
    "ExternalDataSource",
    "ExternalServiceRegistration",
    "ExtlClntAppConfigurablePolicies",
    "ExtlClntAppGlobalOauthSettings",
    "ExtlClntAppOauthConfigurablePolicies",
    "ExtlClntAppOauthSettings",
    "IframeWhiteListUrlSettings",
    "InboundNetworkConnection",
    "ManagedEventSubscription",
    "OutboundNetworkConnection",
    "PlatformEventChannel",
    "PlatformEventChannelMember",
    "PlatformEventSubscriberConfig",
    "RemoteSiteSetting"
  ],
  "Service_and_Messaging": [
    "CallCenter",
    "CallCoachingMediaProvider",
    "ConversationMessageDefinition",
    "EmbeddedServiceBranding",
    "EmbeddedServiceConfig",
    "EmbeddedServiceFlowConfig",
    "EmbeddedServiceMenuSettings",
    "GatewayProviderPaymentMethodType",
    "LiveChatSensitiveDataRule",
    "MessagingChannel",
    "PaymentGatewayProvider"
  ],
  "Content_and_Communication": [
    "CMSConnectSource",
    "ContentAsset",
    "Document",
    "EmailServicesFunction",
    "EmailTemplate",
    "Letterhead",
    "ManagedContentType",
    "PostTemplate"
  ],
  "Mobile": [
    "BriefcaseDefinition",
    "MobSecurityCertPinConfig",
    "MobileApplicationDetail",
    "MobileSecurityAssignment",
    "MobileSecurityPolicy"
  ],
  "Platform_and_Org_Configuration": [
    "ActionLauncherItemDef",
    "ActionLinkGroupTemplate",
    "AppMenu",
    "BatchProcessJobDefinition",
    "BlacklistedConsumer",
    "CanvasMetadata",
    "ChannelLayout",
    "ChatterExtension",
    "CleanDataService",
    "DataWeaveResource",
    "DelegateGroup",
    "EclairGeoData",
    "InstalledPackage",
    "KeywordList",
    "LeadConvertSettings",
    "NotificationTypeConfig",
    "PlatformCachePartition",
    "RedirectWhitelistUrl",
    "SearchCustomization",
    "Settings",
    "UserCriteria",
    "UserProvisioningConfig"
  ]
}

const metadataState = {
  allMetadata: [],
  selected: new Set(),
  activeGroup: ""
};

export async function initMetadata() {
  const metadata = await window.api.getMetadata(); // Fetch from Salesforce
  metadataState.allMetadata = metadata;

  renderSidebar();
  renderMobileSelect();
  // Set first group as active
  metadataState.activeGroup = Object.keys(metadataGroups)[0];
  renderContent(metadataState.activeGroup);
}

function renderSidebar() {
  const sidebar = document.getElementById("metadataSidebar");
  sidebar.innerHTML = "";

  Object.keys(metadataGroups).forEach(group => {
    const btn = document.createElement("button");
    btn.innerText = group.replaceAll("_", " ");
    btn.className = "w-full text-left px-3 py-2 rounded hover:bg-gray-700 border-b border-white/10";

    btn.onclick = () => {
      metadataState.activeGroup = group;
      renderContent(group);
      highlightActiveGroup();
    };

    sidebar.appendChild(btn);
  });

  highlightActiveGroup();
}

function highlightActiveGroup() {
  const buttons = document.querySelectorAll("#metadataSidebar button");
  buttons.forEach(btn => {
    btn.classList.remove("bg-gray-700");
    if (btn.innerText === metadataState.activeGroup.replaceAll("_", " ")) {
      btn.classList.add("bg-gray-700");
    }
  });
}

function renderMobileSelect() {
  const select = document.getElementById("mobileGroupSelect");
  select.innerHTML = "";

  Object.keys(metadataGroups).forEach(group => {
    const option = document.createElement("option");
    option.value = group;
    option.text = group.replaceAll("_", " ");
    select.appendChild(option);
  });

  select.value = metadataState.activeGroup;
  select.onchange = (e) => {
    metadataState.activeGroup = e.target.value;
    renderContent(metadataState.activeGroup);
  };
}

function renderContent(groupName) {
  const content = document.getElementById("metadataContent");
  const items = metadataGroups[groupName].filter(m =>
    metadataState.allMetadata.includes(m)
  );

  content.innerHTML = `
    <div class="flex gap-2 mb-3">
      <input type="text" placeholder="Search..."
             class="border px-2 py-1 rounded w-64"
             oninput="filterItems('${groupName}', this.value)">
      <button onclick="selectAll('${groupName}', true)" class="px-2 py-1 bg-gray-700 rounded">Select All</button>
      <button onclick="selectAll('${groupName}', false)" class="px-2 py-1 bg-gray-700 rounded">Deselect All</button>
    </div>
    <div id="list-${groupName}" class="space-y-1  overflow-y-auto">
      ${items.map(item => `
        <label class="block">
          <input type="checkbox" class="meta-${groupName}" value="${item}"
            ${metadataState.selected.has(item) ? "checked" : ""}
            onchange="toggleSelection('${item}', this.checked)">
          ${item}
        </label>
      `).join("")}
    </div>
  `;
}

window.toggleSelection = function(item, checked) {
  if (checked) metadataState.selected.add(item);
  else metadataState.selected.delete(item);
};

window.selectAll = function(groupName, value) {
  document.querySelectorAll(`.meta-${groupName}`).forEach(cb => {
    cb.checked = value;
    toggleSelection(cb.value, value);
  });
};

window.filterItems = function(groupName, query) {
  const list = document.getElementById(`list-${groupName}`);
  list.querySelectorAll("label").forEach(label => {
    label.style.display = label.innerText.toLowerCase().includes(query.toLowerCase()) ? "block" : "none";
  });
};


// function renderTabs(sfMetadata) {
//   const tabsContainer = document.getElementById("metadataTabs");
//   const contentContainer = document.getElementById("metadataContent");

//   tabsContainer.innerHTML = "";
//   contentContainer.innerHTML = "";

//   Object.keys(metadataGroups).forEach((groupName, index) => {
//     const tabBtn = document.createElement("button");

//     tabBtn.innerText = groupName.replaceAll("_", " ");
//     tabBtn.className =
//       "px-3 py-2 text-sm border-b-2 border-transparent hover:border-blue-500";

//     tabBtn.onclick = () => {
//       document.querySelectorAll(".metadata-tab").forEach(t => t.classList.add("hidden"));
//       document.getElementById(`tab-${groupName}`).classList.remove("hidden");
//     };

//     tabsContainer.appendChild(tabBtn);

//     const tabContent = document.createElement("div");
//     tabContent.id = `tab-${groupName}`;
//     tabContent.className = "metadata-tab hidden";

//     const groupItems = metadataGroups[groupName].filter(m =>
//       sfMetadata.includes(m)
//     );

//     tabContent.innerHTML = buildTabUI(groupName, groupItems);

//     contentContainer.appendChild(tabContent);

//     if (index === 0) tabContent.classList.remove("hidden");
//   });
// }


// function buildTabUI(groupName, items) {
//   return `
//     <div class="mb-3 flex gap-2">
//       <input 
//         type="text"
//         placeholder="Search..."
//         class="border px-2 py-1 rounded w-64"
//         oninput="filterMetadata('${groupName}', this.value)"
//       />

//       <button onclick="selectAll('${groupName}', true)" class="px-2 py-1 bg-gray-200 rounded">
//         Select All
//       </button>

//       <button onclick="selectAll('${groupName}', false)" class="px-2 py-1 bg-gray-200 rounded">
//         Deselect All
//       </button>
//     </div>

//     <div id="list-${groupName}">
//       ${items.map(item => `
//         <label class="block">
//           <input type="checkbox" class="meta-${groupName}" value="${item}">
//           ${item}
//         </label>
//       `).join("")}
//     </div>
//   `;
// }

// window.filterMetadata = function(groupName, search) {
//   const list = document.getElementById(`list-${groupName}`);
//   const items = list.querySelectorAll("label");

//   items.forEach(label => {
//     const text = label.innerText.toLowerCase();
//     label.style.display = text.includes(search.toLowerCase()) ? "block" : "none";
//   });
// };

// window.selectAll = function(groupName, value) {
//   document
//     .querySelectorAll(`.meta-${groupName}`)
//     .forEach(cb => cb.checked = value);
// };


// async function loadMetadata(container) {
//   const metadata = await window.api.getMetadata();

//   metadata.sort();

//   container.innerHTML = metadata
//     .map(m => `<div class="p-1 border-b">${m}</div>`)
//     .join("");
// }
