<template>
  <q-btn v-if="user" color="primary" class="q-pl-sm" no-caps rounded>
    <AddrAvatar :address="address" class="q-mr-md" />
    {{ ens || shortAddr(address) }}
    <q-menu auto-close>
      <q-list class="text-no-wrap">
        <template v-if="roles.includes('Admin')">
          <q-item :to="{ name: 'admin-deploy' }" clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="admin" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ $t("Deployed Contracts") }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item :to="{ name: 'admin-approve' }" clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="admin" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ $t("Changemaker Approval") }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator />
        </template>

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

        <q-separator />
        
        <!-- Claims -->
        <q-item :to="{ name: 'claims' }" clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="claims" />
          </q-item-section>
          <q-item-section>
            <q-item-label>
              {{ $t("Claims") }}
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-separator />

        <!-- Log Out -->
        <q-item @click="logOut" clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="disconnect" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ "Disconnect" }}</q-item-label>
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

import { shortAddr } from "../util/formatting";
import AddrAvatar from "./AddrAvatar";
import LogIn from "./LogIn";

export default defineComponent({
  name: "UserMenu",

  components: { AddrAvatar, LogIn },

  setup() {
    const store = useStore();

    const logIn = (provider) => {
      store.dispatch("logIn", provider);
    };

    const logOut = async () => {
      store.dispatch("logOut");
    };

    const providers = [
      {
        value: "metamask",
        label: "Metamask",
      },
      {
        value: "walletconnect",
        label: "WalletConnect",
      },
    ];

    const user = computed(() => store.state.web3.user);
    const roles = computed(() => store.state.web3.userRoles);

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
      user,
      roles,
      balances,
      address,
      shortAddr,
      ens,
    };
  },
});
</script>
