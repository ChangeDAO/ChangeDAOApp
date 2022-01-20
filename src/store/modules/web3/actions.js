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

  if (user) {
    // Initialize Web3
    try {
      const provider = Moralis.provider;
      await Moralis.enableWeb3({ chain, provider });
    } catch (error) {
      console.error(error);
    }
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
  if (!state.address) {
    return;
  }
  const address = state.address;

  const ens = await Moralis.Web3API.resolve.resolveAddress({ address, chain });
  commit("setUserENS", ens);

  const nfts = await Moralis.Web3.getNFTs({ chain });
  commit("setUserNFTs", nfts);

  let balances = await Moralis.Web3.getAllERC20({ chain });
  balances = zipObject(
    balances.map(b => b.symbol),
    balances
  );
  commit("setUserBalances", balances);
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
