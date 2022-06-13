<template>
  <q-dialog
    ref="dialog"
    :model-value="true"
    @hide="onHide"
    persistent
    v-bind="$attrs"
  >
    <q-card>
      <dialog-header :title="$t('Connect')" icon="lock_open" />

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
    </q-card>
  </q-dialog>
</template>

<script>
import dialogHeader from "./DialogHeader";

export default {
  name: "LogInDialog",

  components: { dialogHeader },

  data() {
    return {
      providers: [
        {
          value: "metamask",
          label: "Metamask",
        },
        {
          value: "walletconnect",
          label: "WalletConnect",
        },
      ],
    };
  },

  computed: {
    isLoggedIn() {
      return Boolean(this.$store.state.web3.user);
    },
  },

  methods: {
    logIn(provider) {
      this.$store.dispatch("logIn", provider);
    },
    onHide() {
      if (!this.isLoggedIn) {
        this.$router.back();
      }
    },
  },

  watch: {
    isLoggedIn(isLoggedIn) {
      if (isLoggedIn) {
        this.$refs.dialog.hide();
      }
    },
  },
};
</script>
