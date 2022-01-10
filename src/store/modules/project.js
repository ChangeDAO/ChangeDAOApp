import { deepFreeze } from "../../util/misc";
import { i18n } from "../../boot/i18n";
const { t } = i18n.global;

export default {
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
          img: "",
          name: "Mint Title Would Go Here",
          creator: {
            id: "sampleuser",
            name: "Usernamehere"
          },
          collaborators: [
            { id: "collaborator1", name: "Collaborator1usernamehere" },
            { id: "collaborator2", name: "Collaborator2usernamehere" }
          ],
          collection: {
            id: "samplecollection",
            name: "Collection Name Here"
          },
          areasOfChange: [
            "energy-environment",
            "financial-inclusion",
            "identity-vulnerable"
          ],
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
          how:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
          minted: 808,
          mintable: 1e3,
          goalUSD: 1e5,
          tokenPriceUSD: 250,
          primarySplit: {
            creator: 55,
            collaborator1: 35,
            collaborator2: 8,
            changeDaoCommunityTreasury: 1,
            changeDaoOperationsTreasury: 1
          },
          secondarySplit: {
            creator: 55,
            collaborator1: 35,
            collaborator2: 8,
            changeDaoCommunityTreasury: 1,
            changeDaoOperationsTreasury: 1
          }
        });
      } catch (error) {
        console.error(error);
        throw t("error.loadingProject");
      }
    }
  }
};
