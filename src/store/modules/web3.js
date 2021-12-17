import Moralis from "moralis";
import { deepFreeze } from "../../util/misc";
import { i18n } from "../../boot/i18n";
const { t } = i18n.global;

export default {
  state: {
    user: null
  },

  mutations: {
    setUser(state, user) {
      state.user = user ? deepFreeze(user) : null;
    }
  },

  actions: {
    async logIn({ state, commit }, silently = false) {
      let user = Moralis.User.current();
      if (!user && !silently) {
        try {
          user = await Moralis.authenticate({
            signingMessage: t("Log in to ChangeDAO")
          });
        } catch (error) {
          if (!user && error.code !== 4001) {
            console.log(error);
            try {
              user = await Moralis.authenticate({
                signingMessage: t("Log in to ChangeDAO"),
                provider: "walletconnect"
              });
            } catch (error) {
              console.error(error);
            }
          }
        }
      }
      commit("setUser", user);
      return user;
    },

    async logOut({ commit }) {
      await Moralis.User.logOut();
      commit("setUser", null);
    }
  }
};
