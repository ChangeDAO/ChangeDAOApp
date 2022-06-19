import { deepFreeze } from "../../../util/misc";

export async function setUser(state, user) {
  if (user) {
    state.userAddress = user.get("ethAddress");
    state.user = deepFreeze(user);
  } else {
    state.user = null;
    state.userAddress = "";
    state.userENS = "";
    state.userNFTs = [];
    state.userRoles = [];
    state.userBalances = [];
    state.isAdmin = false;
  }
}

export function setAdmin(state, isAdmin) {
  state.isAdmin = Boolean(isAdmin);
}

export function setInitializing(state, value) {
  state.initializing = Boolean(value);
}

export function setInitialized(state, value) {
  state.initialized = Boolean(value);
}

export function setChain(state, chain) {
  state.chain = chain || null;
}

export function setProvider(state, provider) {
  state.provider = provider || null;
}

export function setUserAddress(state, address) {
  state.userAddress = (address || "").toLowerCase();
}

export function setUserENS(state, ens) {
  state.userENS = ens || "";
}

export function setUserNFTs(state, nfts) {
  // state.userNFTs = deepFreeze(nfts);
}

export function setUserRoles(state, roles) {
  state.userRoles = roles || [];
}

export function setUserBalances(state, balances) {
  // state.userBalances = deepFreeze(balances);
}

export function setOffers(state, nfts) {
  // state.offers = deepFreeze(nfts);
}
