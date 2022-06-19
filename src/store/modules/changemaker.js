import { deepFreeze } from "../../util/misc";
import Moralis from "moralis";

export default {
  namespaced: false,

  state: {},

  mutations: {
    setChangemaker(state, { changemaker, id }) {
      state[id.toLowerCase()] = changemaker ? deepFreeze(changemaker) : null;
    },
  },

  actions: {
    async getChangemaker({ state, commit }, walletAddress) {
      walletAddress = walletAddress.toLowerCase();
      try {
        if (!state[walletAddress]) {
          const result = await Moralis.Cloud.run(
            "getChangemakerByWalletAddress",
            { walletAddress }
          );

          commit("setChangemaker", {
            changemaker: result.changemaker,
            id: walletAddress,
          });
        }
        return state[walletAddress];
      } catch (error) {
        console.error(error);
      }
    },
  },
};
