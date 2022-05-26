import { deepFreeze } from "../../util/misc";
import { i18n } from "../../boot/i18n";
const { t } = i18n.global;

export default {
  namespaced: false,

  state: {},

  mutations: {
    setProject(state, project) {
      state[project.id] = deepFreeze(project);
    }
  },

  actions: {
    async getProject({ state, commit }, id) {
      try {
        // const project = await fetchProjectFromDB(id);
        // commit("setProject", project);

        // Sample
        commit("setProject", {
          id: "sample",
          areaOfChange: "humanRights",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
          transactionHash:
            "0xa7b3ad591a619f25d3d68b3e2ff7fb6d4fba0e3619fa560ba9ec73bde575498f",
          _baseURI:
            "bafybeictkqabee4vesqkrxbjkwbjaghtdzsjeyui6mycfxov7bgzq3l32a",
          _creators: ["0x6c0067bfb691d349d2ae20e55e833f5508483fce"],
          _fundingPayees: ["0x6c0067bfb691d349d2ae20e55e833f5508483fce"],
          _fundingShares: [9800],
          _movementName: "Freedom",
          _projectName: "A New Test",
          _royaltiesPayees: ["0x6c0067bfb691d349d2ae20e55e833f5508483fce"],
          _royaltiesShares: [8000],
          transactionHash: "",
          _changeDaoNFTClone: "0xf7a1949B926a8dc781d30e7cB8f573Ea45347593",
          _fundingPSClone: "0x04eC1709a91295C43a63846a771f79c282F46B03",
          _maxMintAmountPublic: 5,
          _maxMintAmountRainbow: "",
          _mintPrice: 1,
          _rainbowDuration: 0,
          _rainbowMerkleRoot: "",
          _totalMints: 100,
          minted: "?"
        });
      } catch (error) {
        console.error(error);
        throw t("error.loadingProject");
      }
    }
  }
};
