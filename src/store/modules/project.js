import { deepFreeze } from "../../util/misc";
import { i18n } from "../../boot/i18n";
const { t } = i18n.global;
import Moralis from "moralis";

export default {
  namespaced: false,

  state: {},

  mutations: {
    setProject(state, { project, id }) {
      state[id] = deepFreeze(project);
    },
  },

  actions: {
    async getProject({ state, commit }, projectId) {
      try {
        if (!state[projectId]) {
          const result = await Moralis.Cloud.run("getProject", {
            projectId,
          });

          commit("setProject", { project: result.project, id: projectId });
        }
        return state[projectId];
      } catch (error) {
        console.error(error);
        throw t("error.loadingProject");
      }
    },
  },
};
