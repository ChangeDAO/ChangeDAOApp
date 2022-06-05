<template>
  <q-btn :label="$t('Connect')" class="text-bold text-color-white" v-bind="$attrs">
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

<style lang="scss" scoped>
.q-btn:before {
  border: 1px solid $primary;
}
</style>

<script>
import { defineComponent } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "LogIn",

  setup() {
    const store = useStore();

    const logIn = provider => {
      store.dispatch("logIn", provider);
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

    return {
      logIn,
      providers
    };
  }
});
</script>
