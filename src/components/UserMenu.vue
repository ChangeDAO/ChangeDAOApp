<template>
  <q-btn v-if="user" color="primary" class="q-pl-sm" no-caps rounded>
    <AddrAvatar :value="address" class="q-mr-md" />
    {{ ens || shortAddr(address) }}
    <q-menu auto-close>
      <q-list class="text-no-wrap">
        <!-- Wallet Providers -->
        <q-item
          v-for="provider in providers"
          :key="provider.value"
          clickable
          v-ripple
          @click="logIn(provider.value)"
        >
          <q-item-section avatar>
            <q-icon name="wallet" />
          </q-item-section>
          <q-item-section side>
            <q-item-label>
              {{ provider.label }}
            </q-item-label>
          </q-item-section>
        </q-item>

        <!-- Log Out -->
        <q-item @click="logOut" clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="lock" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ "Log Out" }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>

  <LogIn v-else />
</template>

<script>
import { defineComponent, computed } from "vue";
import { useStore } from "vuex";

import { shortAddr, tokenValueTxt } from "../util/formatting";
import AddrAvatar from "./AddrAvatar";
import LogIn from "./LogIn";

export default defineComponent({
  name: "UserMenu",

  components: { AddrAvatar, LogIn },

  setup() {
    const store = useStore();

    const logIn = provider => {
      store.dispatch("logIn", provider);
    };

    const logOut = () => {
      store.dispatch("logOut");
    };

    const providers = [
      {
        value: "metamask",
        label: "Metamask"
      },
      {
        value: "walletconnect",
        label: "WalletConnect"
      }
    ];

    const user = computed(() => store.state.web3.user);

    const balances = computed(() => store.state.web3.userBalances);

    const address = computed(() => {
      if (user.value) {
        return store.state.web3.userAddress;
      }
      return "";
    });

    const ens = computed(() => store.state.web3.userENS);

    return {
      logIn,
      logOut,
      providers,
      tokenValueTxt,
      user,
      balances,
      address,
      shortAddr,
      ens
    };
  }
});
</script>
