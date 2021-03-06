import Moralis from "moralis";
import { i18n } from "../../../boot/i18n";
const { t } = i18n.global;

const chain = process.env.chain;

// Init
export async function init({ commit, dispatch, state }) {
  Moralis.onChainChanged((chain) => {
    commit("setChain", parseInt(chain, 16));
    dispatch("getUserData");
  });

  // Moralis.onAccountChanged(async (address) => {
  //   if (address) {
  //     // await Moralis.link(address);
  //     commit("setUser", Moralis.User.current());
  //     commit("setUserAddress", address);
  //     dispatch("getUserData");
  //   } else {
  //     commit("setUserAddress");
  //     return dispatch("logOut");
  //   }
  // });

  // Moralis.onConnect((provider) => {
  //   console.log("provider", provider);
  //   commit("setProvider", provider);
  // });

  return dispatch("logIn");
}

// Enable Web3
export async function enableWeb3({ state, commit, dispatch }) {
  commit("setInitializing", true);
  let result;
  try {
    result = await Moralis.enableWeb3({
      provider: state.provider || "metamask",
    });
    commit("setInitialized", true);
  } catch (error) {
    console.warn(error);
    try {
      result = await Moralis.enableWeb3({
        provider: state.provider || "walletconnect",
      });
      commit("setInitialized", true);
    } catch (error) {
      console.warn(error);
    }
  }
  commit("setChain", result.network.chainId);
  commit("setInitializing", false);
  await dispatch("getUserData");
  return result;
}

// Log In
export async function logIn({ state, commit, dispatch }, provider) {
  let user = Moralis.User.current();
  if (provider) {
    try {
      user = await Moralis.authenticate({
        signingMessage: t("Connect to ChangeDAO"),
        provider,
        chain,
      });
      commit("setProvider", provider);
      commit("setChain", Moralis.chainId);
    } catch (error) {
      console.log(error);
    }
  }

  if (Moralis.User.current()) {
    commit("setUser", user);
    dispatch("enableWeb3");
  } else {
    commit("setUser", null);
  }

  return user;
}

// Log Out
export async function logOut({ commit }) {
  await Moralis.User.logOut();
  commit("setUser", null);
}

// Get User Data
export async function getUserData({ commit, state }) {
  if (!state.userAddress) {
    return;
  }

  const address = state.userAddress;

  const roles = await getRoles();
  commit("setUserRoles", roles);

  // Roles
  const isAdmin = roles.includes("Admin");
  commit("setAdmin", isAdmin);

  const isChangemaker = roles.includes("Changemaker");
  if (isChangemaker) {
    this.dispatch("getChangemaker", address);
  }

  // Web3 required past this point
  if (!Moralis.isWeb3Enabled()) {
    return;
  }

  const balances = {};

  // Native balance
  let nativeBalance = await Moralis.Web3API.account.getNativeBalance({
    address,
    chain,
  });
  if (nativeBalance && nativeBalance.balance) {
    balances.ETH = { ...nativeBalance, symbol: "ETH", decimals: 18 };
  }

  // ERC20 Tokens
  let tokens = await Moralis.Web3API.account.getTokenBalances({
    address,
    chain,
  });
  if (tokens && tokens.length) {
    tokens.forEach((t) => (balances[t.symbol] = t));
  }
  commit("setUserBalances", balances);

  // NFTs
  const nfts = await Moralis.Web3API.account.getNFTs({ address, chain });
  commit("setUserNFTs", nfts);

  // ENS (Mainnet only?)
  // const ens = await Moralis.Web3API.resolve.resolveAddress({ address });
  // commit("setUserENS", ens);
}

export async function hasRole(context, role) {
  const matchingRole = await new Moralis.Query(Moralis.Role)
    .equalTo("name", role)
    .equalTo("users", Moralis.User)
    .first();
  return Boolean(matchingRole);
}

export async function getRoles() {
  return (
    await new Moralis.Query(Moralis.Role).equalTo("users", Moralis.User).find()
  ).map((role) => role.get("name"));
}
