import Moralis from "moralis";
import { zipObject } from "lodash";
import { i18n } from "../../../boot/i18n";
const { t } = i18n.global;

const chain = process.env.chain;

// Init
export async function init({ commit, dispatch }) {
  Moralis.onAccountChanged(async address => {
    if (!address) {
      dispatch("logOut");
      return;
    }

    commit("setUserAddress", address);

    // 'Link this address to your account?'
    // await Moralis.link(address);
    // 'Address added!';

    if (address) {
      commit("setUser", Moralis.User.current());
      dispatch("getUserData");
    }
  });

  return dispatch("logIn", true);
}

// Log In
export async function logIn({ state, commit, dispatch }, silently = false) {
  let user = Moralis.User.current();
  if (!user && !silently) {
    const signingMessage = "Log in to ChangeDAO";
    try {
      user = await Moralis.authenticate({
        signingMessage,
        provider: "metamask"
      });
    } catch (error) {
      if (!user && error.code !== 4001) {
        console.log(error);
        try {
          user = await Moralis.authenticate({
            signingMessage,
            provider: "walletconnect"
          });
        } catch (error) {
          console.error(error);
        }
      }
    }
  }

  commit("setUser", user);
  dispatch("getUserData");

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

  const user = state.user;
  const address = state.userAddress;

  const balances = {};

  // Native balance
  let nativeBalance = await Moralis.Web3API.account.getNativeBalance({
    address,
    chain
  });
  if (nativeBalance && nativeBalance.balance) {
    balances.ETH = { ...nativeBalance, symbol: "ETH", decimals: 18 };
  }

  // ERC20 Tokens
  let tokens = await Moralis.Web3API.account.getTokenBalances({
    address,
    chain
  });
  if (tokens && tokens.length) {
    tokens.forEach(t => (balances[t.symbol] = t));
  }
  commit("setUserBalances", balances);

  // NFTs
  const nfts = await Moralis.Web3API.account.getNFTs({ address, chain });
  commit("setUserNFTs", nfts);

  // ENS (Mainnet only?)
  // const ens = await Moralis.Web3API.resolve.resolveAddress({ address });
  // commit("setUserENS", ens);
}

// Mint nft
export async function mintNFT({ commit, state }, options) {
  // return Moralis.executeFunction({
  //   chain,
  //   contractAddress: AddrRecursiveExchange,
  //   functionName: "placeOffering",
  //   abi: [],
  //   params: {
  //     _hostContract: token_address,
  //     _tokenId: token_id,
  //     _price: Moralis.Units.ETH(price)
  //   }
  // });
}
