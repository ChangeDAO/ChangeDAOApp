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
    state.userBalances = [];
  }
}

export function setUserAddress(state, address) {
  state.userAddress = (address || "").toLowerCase();
}

export function setUserENS(state, ens) {
  state.userENS = ens || "";
}

export function setUserNFTs(state, nfts) {
  state.userNFTs = deepFreeze(nfts);
}

export function setUserBalances(state, balances) {
  state.userBalances = deepFreeze(balances);
}

export function setOffers(state, nfts) {
  state.offers = deepFreeze(nfts);
}
