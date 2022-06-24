<template>
  <q-btn v-if="user" color="primary" class="q-pl-sm" no-caps rounded>
    <AddrAvatar :address="address" class="q-mr-md" />
    {{ displayName }}
    <q-menu>
      <q-list class="text-no-wrap">
        <!-- New Project -->
        <q-item
          v-if="changemaker"
          @click="$router.push({ name: 'project-new' })"
          clickable
          v-ripple
          v-close-popup
        >
          <q-item-section avatar>
            <q-icon name="add" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t("New Project") }}</q-item-label>
          </q-item-section>
        </q-item>

        <!-- Changemaker Signup -->
        <q-item
          v-else
          @click="$router.push({ name: 'signup' })"
          clickable
          v-ripple
          v-close-popup
        >
          <q-item-section avatar>
            <q-icon name="changemaker" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t("Changemaker Signup") }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator />

        <!-- Claims -->
        <q-item
          @click="$router.push({ name: 'claims' })"
          clickable
          v-ripple
          v-close-popup
        >
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

        <template v-if="isAdmin">
          <q-item
            @click="$router.push({ name: 'admin-deploy' })"
            clickable
            v-ripple
            v-close-popup
          >
            <q-item-section avatar>
              <q-icon name="admin" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ $t("Deployed Contracts") }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            @click="$router.push({ name: 'admin-approve' })"
            clickable
            v-ripple
            v-close-popup
          >
            <q-item-section avatar>
              <q-icon name="admin" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ $t("Changemaker Approval") }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator />
        </template>

        <!-- Reconnect -->
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="wallet" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t("Reconnect") }}</q-item-label>
          </q-item-section>

          <!-- Wallet Providers -->
          <q-menu>
            <q-list>
              <q-item
                v-for="provider in providers"
                :key="provider.value"
                clickable
                v-ripple
                @click="logIn(provider.value)"
                v-close-popup
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
        </q-item>

        <!-- Log Out -->
        <q-item @click="logOut" clickable v-ripple v-close-popup>
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
