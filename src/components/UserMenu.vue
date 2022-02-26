<template>
  <q-btn v-if="user" color="primary" class="q-pl-sm" no-caps rounded>
    <q-avatar v-html="avatar" size="sm" class="overflow-hidden q-mr-md" />
    {{ ens || address }}
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

  <q-btn v-else icon="lock_open" :label="$t('Log In')" color="primary">
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
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script>
import { defineComponent, computed } from "vue";
import { useStore } from "vuex";
import jazzicon from "@metamask/jazzicon";

import { getEllipsisTxt, tokenValueTxt } from "../util/formatting";

export default defineComponent({
  name: "UserMenu",

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
        return "0x" + getEllipsisTxt(store.state.web3.userAddress.slice(2));
      }
      return "";
    });

    const ens = computed(() => store.state.web3.userENS);

    const avatar = computed(() => {
      if (user.value) {
        const addr = store.state.web3.userAddress.slice(2, 10);
        const seed = parseInt(addr, 16);
        const avatar = jazzicon(24, seed);
        return avatar.innerHTML;
      }
      return "";
    });

    return {
      logIn,
      logOut,
      providers,
      tokenValueTxt,
      user,
      balances,
      avatar,
      address,
      ens
    };
  }
});
</script>
