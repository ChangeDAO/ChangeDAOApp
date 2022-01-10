<template>
  <q-btn v-if="user" color="primary" class="q-pl-sm" no-caps rounded>
    <q-avatar v-html="avatar" size="sm" class="overflow-hidden q-mr-md" />
    {{ username }}
    <q-menu>
      <q-list>
        <!-- Address -->
        <q-item @click="logOut" disabled>
          <q-item-section avatar>
            <q-icon name="wallet" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ address }}</q-item-label>
          </q-item-section>
        </q-item>

        <!-- Log Out -->
        <q-item @click="logOut" clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="lock" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t("Log Out") }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>

  <q-btn
    v-else
    @click="logIn"
    icon="lockOpen"
    :label="$t('Log In')"
    color="primary"
  />
</template>

<script>
import { defineComponent, computed } from "vue";
import { useStore } from "vuex";
import jazzicon from "jazzicon";

export default defineComponent({
  name: "UserMenu",

  setup() {
    const store = useStore();

    const user = computed(() => store.state.web3.user);

    const address = computed(() => {
      if (user.value) {
        let address = user.value.get("ethAddress");
        return `${address.substr(0, 6)}***${address.substr(-4)}`;
      }
      return "";
    });

    const username = computed(() => {
      if (user.value) {
        return user.value.get("username");
      }
      return "";
    });

    const avatar = computed(() => {
      if (user.value) {
        const addr = user.value.get("ethAddress").slice(2, 10);
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

    store.dispatch("logIn", true);

    return {
      user,
      avatar,
      address,
      username,
      logIn,
      logOut
    };
  }
});
</script>
