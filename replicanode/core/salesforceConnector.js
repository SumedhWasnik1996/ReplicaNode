const jsforce = require("jsforce");
const fs      = require("fs-extra");
const path    = require("path");

let currentConnection = null;
let currentOrg        = null;

const METADATA_API_TYPE_MAP = {

  // ---------------- TOOLING ----------------
  ApexClass                           : 'tooling',
  ApexComponent                       : 'tooling',
  ApexEmailNotifications              : 'tooling',
  ApexPage                            : 'tooling',
  ApexTestSuite                       : 'tooling',
  ApexTrigger                         : 'tooling',
  CustomLabels                        : 'tooling',

  // ---------------- TOOLING BUNDLE ----------------
  AuraDefinitionBundle                : 'tooling-bundle',
  LightningComponentBundle            : 'tooling-bundle',

  // ---------------- METADATA BINARY ----------------
  Document                            : 'metadata-binary',
  StaticResource                      : 'metadata-binary',

  // ---------------- ORG SETTINGS ----------------
  Settings                            : 'org-settings',

  // ---------------- METADATA ----------------
  AIApplication                       : 'metadata',
  AIApplicationConfig                 : 'metadata',
  AccessControlPolicy                 : 'metadata',
  ActionLinkGroupTemplate             : 'metadata',
  AnalyticSnapshot                    : 'metadata',
  AnimationRule                       : 'metadata',
  AppMenu                             : 'metadata',
  ApprovalProcess                     : 'metadata',
  AssignmentRules                     : 'metadata',
  Audience                            : 'metadata',
  AuthProvider                        : 'metadata',
  AutoResponseRules                   : 'metadata',
  BatchProcessJobDefinition           : 'metadata',
  BlacklistedConsumer                 : 'metadata',
  BrandingSet                         : 'metadata',
  BriefcaseDefinition                 : 'metadata',
  CMSConnectSource                    : 'metadata',
  CallCenter                          : 'metadata',
  CallCoachingMediaProvider           : 'metadata',
  CanvasMetadata                      : 'metadata',
  Certificate                         : 'metadata',
  ChannelLayout                       : 'metadata',
  ChatterExtension                    : 'metadata',
  CleanDataService                    : 'metadata',
  Community                           : 'metadata',
  CommunityTemplateDefinition         : 'metadata',
  CommunityThemeDefinition            : 'metadata',
  ConnectedApp                        : 'metadata',
  ContentAsset                        : 'metadata',
  CorsWhitelistOrigin                 : 'metadata',
  CspTrustedSite                      : 'metadata',
  CustomApplication                   : 'metadata',
  CustomApplicationComponent          : 'metadata',
  CustomFeedFilter                    : 'metadata',
  CustomHelpMenuSection               : 'metadata',
  CustomIndex                         : 'metadata',
  CustomMetadata                      : 'metadata',
  CustomNotificationType              : 'metadata',
  CustomObject                        : 'metadata',
  CustomObjectTranslation             : 'metadata',
  CustomPageWebLink                   : 'metadata',
  CustomPermission                    : 'metadata',
  CustomSite                          : 'metadata',
  CustomTab                           : 'metadata',
  Dashboard                           : 'metadata',
  DataCategoryGroup                   : 'metadata',
  DelegateGroup                       : 'metadata',
  DuplicateRule                       : 'metadata',
  EclairGeoData                       : 'metadata',
  EmailServicesFunction               : 'metadata',
  EmailTemplate                       : 'metadata',
  EmbeddedServiceBranding             : 'metadata',
  EmbeddedServiceConfig               : 'metadata',
  EmbeddedServiceFlowConfig           : 'metadata',
  EmbeddedServiceMenuSettings         : 'metadata',
  EntitlementProcess                  : 'metadata',
  EntitlementTemplate                 : 'metadata',
  EscalationRules                     : 'metadata',
  ExperienceBundle                    : 'metadata',
  ExternalDataSource                  : 'metadata',
  ExternalServiceRegistration         : 'metadata',
  FlexiPage                           : 'metadata',
  Flow                                : 'metadata',
  FlowCategory                        : 'metadata',
  FlowDefinition                      : 'metadata',
  GatewayProviderPaymentMethodType    : 'metadata',
  GlobalValueSet                      : 'metadata',
  GlobalValueSetTranslation           : 'metadata',
  Group                               : 'metadata',
  HomePageComponent                   : 'metadata',
  HomePageLayout                      : 'metadata',
  IframeWhiteListUrlSettings          : 'metadata',
  InboundNetworkConnection            : 'metadata',
  InstalledPackage                    : 'metadata',
  KeywordList                         : 'metadata',
  Layout                              : 'metadata',
  LeadConvertSettings                 : 'metadata',
  Letterhead                          : 'metadata',
  LightningBolt                       : 'metadata',
  LightningExperienceTheme            : 'metadata',
  LightningMessageChannel             : 'metadata',
  LightningOnboardingConfig           : 'metadata',
  LiveChatSensitiveDataRule           : 'metadata',
  MLDataDefinition                    : 'metadata',
  MLPredictionDefinition              : 'metadata',
  MLRecommendationDefinition          : 'metadata',
  ManagedContentType                  : 'metadata',
  ManagedTopics                       : 'metadata',
  MatchingRules                       : 'metadata',
  MilestoneType                       : 'metadata',
  MobileApplicationDetail             : 'metadata',
  MobileSecurityPolicy                : 'metadata',
  ModerationRule                      : 'metadata',
  MutingPermissionSet                 : 'metadata',
  MyDomainDiscoverableLogin           : 'metadata',
  NamedCredential                     : 'metadata',
  NavigationMenu                      : 'metadata',
  Network                             : 'metadata',
  NetworkBranding                     : 'metadata',
  NotificationTypeConfig              : 'metadata',
  OauthCustomScope                    : 'metadata',
  OutboundNetworkConnection           : 'metadata',
  PathAssistant                       : 'metadata',
  PaymentGatewayProvider              : 'metadata',
  PermissionSet                       : 'metadata',
  PermissionSetGroup                  : 'metadata',
  PersonAccountOwnerPowerUser         : 'metadata',
  PlatformCachePartition              : 'metadata',
  PlatformEventChannel                : 'metadata',
  PlatformEventChannelMember          : 'metadata',
  PostTemplate                        : 'metadata',
  Profile                             : 'metadata',
  ProfilePasswordPolicy               : 'metadata',
  ProfileSessionSetting               : 'metadata',
  Prompt                              : 'metadata',
  Queue                               : 'metadata',
  QuickAction                         : 'metadata',
  RecommendationStrategy              : 'metadata',
  RecordActionDeployment              : 'metadata',
  RedirectWhitelistUrl                : 'metadata',
  RemoteSiteSetting                   : 'metadata',
  Report                              : 'metadata',
  ReportType                          : 'metadata',
  RestrictionRule                     : 'metadata',
  Role                                : 'metadata',
  SamlSsoConfig                       : 'metadata',
  Scontrol                            : 'metadata',
  SharingRules                        : 'metadata',
  SharingSet                          : 'metadata',
  SiteDotCom                          : 'metadata',
  StandardValueSet                    : 'metadata',
  StandardValueSetTranslation         : 'metadata',
  SynonymDictionary                   : 'metadata',
  TopicsForObjects                    : 'metadata',
  TransactionSecurityPolicy           : 'metadata',
  Translations                        : 'metadata',
  UserCriteria                        : 'metadata',
  UserProvisioningConfig              : 'metadata',
  Workflow                            : 'metadata'
};

async function login(username, password){
    try{
        const conn = new jsforce.Connection();
        await conn.login(username, password);

        currentConnection = conn;
        currentOrg        = username.replace(/[@.]/g, "_");

        return { 
            success : true, 
            org     : currentOrg 
        };
    }catch(err){
        return {
            success : false,
            message : err.message || "Login failed"
        };
    }
}

async function getMetadata(){
    if(!currentConnection){ 
        throw new Error("Not logged in");
    }

    const meta = await currentConnection.metadata
                            .describe(currentConnection?.version || 60);
    
    return meta.metadataObjects.map(m => m.xmlName);
}

async function backupMetadata(selectedTypes){
    if(!currentConnection){
        throw new Error("Not logged in");
    }

    const backupDir = path.join(__dirname, "..", "data", currentOrg);
    await fs.ensureDir(backupDir);

    for(const type of selectedTypes){
        const result = await currentConnection.metadata.list([{ type }], currentConnection?.version || 60);
        await fs.writeJson(
            path.join(backupDir, `${type}.json`),
            result || []
        );
    }

    return { 
        success  : true, 
        location : backupDir
    };
}

async function getMetadataItems(type){
    if(!currentConnection){ 
        throw new Error("Not logged in");
    }

    const result = await currentConnection.metadata
                            .list(
                                    [{ type }], 
                                    currentConnection.version || 60
                                );
    if(!result){
        return [];
    }

    if(Array.isArray(result)){
        return result;
    }

    return [result];
}

async function getMetadataContent(type, details){
    try{
        //console.log('Getting Details for metadata type : ', type, ' Metadata Details : ',details);

        if(!currentConnection){
            throw new Error("Not logged in");
        }

        const apiType = METADATA_API_TYPE_MAP[type];

        if(!apiType){
            throw new Error(`Preview not supported for ${type}`);
        }

        switch(apiType){
            case 'tooling': {
                const toolingApiResponse = await currentConnection.tooling
                                                    .sobject(type)
                                                    .retrieve(details.id);

                //console.log("Tooling Api Response : ", toolingApiResponse);
                return {
                    success     : true,
                    apiResponse : toolingApiResponse
                };
            }
            case 'tooling-bundle': {

                const query = `SELECT Id, FilePath, Format, Source  
                                    FROM  ${type === 'AuraDefinitionBundle'
                                                    ? 'AuraDefinition'
                                                    : 'LightningComponentResource'}
                                    WHERE ${type === 'AuraDefinitionBundle'
                                                    ? 'AuraDefinitionBundleId'
                                                    : 'LightningComponentBundleId'}
                                             = '${details.id}'`;

                const toolingBundleApiResponse = await currentConnection.tooling
                                                            .query(query);

                //console.log("Tooling Bundle Api Response : ", toolingBundleApiResponse);
                return {
                    success     : true,
                    apiResponse : toolingBundleApiResponse
                };
            }
            case 'metadata': {
                const metadataApiResponse = await currentConnection.metadata
                                                        .read(
                                                            type,
                                                            details.fullName
                                                        );

               // console.log("Metadata Api Response : ", metadataApiResponse);
                return {
                    success     : true,
                    apiResponse : metadataApiResponse
                };
            }
            case 'metadata-binary': {
                const metadataBindaryApiResponse = {};

                if(type === 'StaticResource'){
                    metadataBindaryApiResponse = await currentConnection.metadata
                                                            .read(
                                                                'StaticResource',
                                                                details.fullName
                                                            );                                             
                }else if(type === 'Document'){
                    const doumentData = await currentConnection
                                                .sobject('Document')
                                                .retrieve(details.id);

                    const buffer = Buffer.from(doumentData.Body, 'base64');
                    
                    metadataBindaryApiResponse = {
                        ...doumentData,
                        decodedBody: buffer
                    }
                }else{
                    throw new Error(`Binary Handler not implemented for ${type}`);
                }

                //console.log("Metadata Binary Api Response : ", metadataBindaryApiResponse);
                return {
                    success     : true,
                    apiResponse : metadataBindaryApiResponse
                }; 
            }
            case 'org-settings': {
                const orgSettingRequest = {
                    apiVersion    : currentConnection.version,
                    singlePackage : true,
                    unpackaged    : {
                                     types : [{
                                            name    : 'Settings',
                                            members : ['*']
                                        }]
                    }
                };

                const orgSettingApiResponse = await currentConnection.metadata
                                                        .retrieve(orgSettingRequest)
                                                        .complete();

                //console.log("Org Settings Api Response : ", orgSettingApiResponse);
                return {
                    success     : true,
                    apiResponse : orgSettingApiResponse
                };
            }            
            default:{
                throw new Error(`Api not configured for ${type}`);
            }
        }

    }catch(error){
        console.error("Error reading metadata:", error);
        return {
            success: false,
            error: error.message
        };
    }
}


function logout(){
    currentConnection = null;
    currentOrg = null;
}

module.exports = {
    login,
    getMetadata,
    backupMetadata,
    logout,
    getMetadataItems,
    getMetadataContent
};
