import { emit } from "./events.js";

const state = {
    isLoggedIn       : false,
    currentOrg       : null,
    selectedMetadata : []
};

export function getState(){
    return state;
}

export function setState(update){
    Object.assign(state, update);
    emit("stateChanged", state);
}

export function updateSelectedMetadata(newMetadataList) {
    const state = getState();

    setState({
        ...state,
        selectedMetadata : newMetadataList
    });
}
