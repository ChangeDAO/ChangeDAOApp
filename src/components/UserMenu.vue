<template>
  <q-btn v-if="user" color="primary" class="q-pl-sm" no-caps rounded>
    <q-avatar v-html="avatar" size="sm" class="overflow-hidden q-mr-md" />
    {{ ens || address }}
    <q-menu>
      <q-list class="text-no-wrap">
        <!-- balances -->
        <q-item v-for="token in balances" :key="token.symbol" disabled>
          <q-item-section avatar>
            <q-icon name="wallet" />
          </q-item-section>
          <q-item-section side>
            <q-item-label>
              {{ tokenValueTxt(token.balance, token.decimals, token.symbol) }}
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

  <q-btn
    v-else
    @click="logIn"
    icon="lock_open"
    :label="$t('Log In')"
    color="primary"
  />
</template>

<script>
import { defineComponent, computed } from "vue";
import { useStore } from "vuex";
import jazzicon from "jazzicon";

import { getEllipsisTxt, tokenValueTxt } from "../util/formatting";

export default defineComponent({
  name: "UserMenu",

  setup() {
    const store = useStore();

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

    const logIn = () => {
      store.dispatch("logIn");
    };

    const logOut = () => {
      store.dispatch("logOut");
    };

    return {
      tokenValueTxt,
      user,
      balances,
      avatar,
      address,
      ens,
      logIn,
      logOut
    };
  }
});
</script>
