import { emit } from "./events.js";

const state = {
  isLoggedIn: false,
  currentOrg: null
};

export function getState() {
  return state;
}

export function setState(update) {
  Object.assign(state, update);
  emit("stateChanged", state);
}
