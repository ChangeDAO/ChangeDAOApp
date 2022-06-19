<template>
  <q-btn v-if="user" color="primary" class="q-pl-sm" no-caps rounded>
    <AddrAvatar :address="address" class="q-mr-md" />
    {{ displayName }}
    <q-menu auto-close>
      <q-list class="text-no-wrap">
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

        <!-- Changemaker -->
        <template v-if="changemaker">
          <q-item :to="{ name: 'project-new' }" clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="admin" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ $t("New Project") }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>

        <!-- Non-Changemaker -->
        <q-item v-else :to="{ name: 'signup' }" clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="admin" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t("Changemaker Signup") }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator />

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

        <template v-if="isAdmin">
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
    const isAdmin = computed(() => store.state.web3.isAdmin);
    const changemaker = computed(() => store.state.changemakers[address.value]);

    const balances = computed(() => store.state.web3.userBalances);

    const address = computed(() =>
      user.value ? store.state.web3.userAddress : ""
    );

    const displayName = computed(() =>
      changemaker.value
        ? changemaker.value.displayName
        : store.state.web3.userENS || shortAddr(address.value)
    );

    return {
      logIn,
      logOut,
      providers,
      user,
      isAdmin,
      changemaker,
      balances,
      address,
      displayName,
    };
  },
});
</script>
