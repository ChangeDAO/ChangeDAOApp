<template>
  <router-view />
</template>
<script>
import { defineComponent } from "vue";
import { useQuasar } from 'quasar'
import { useStore } from "vuex";

import ICONS from "./icons";

export default defineComponent({
  name: "App",

  setup() {
    const $q = useQuasar();
    const store = useStore();

    $q.dark.set(true);

    // Custom icon mapping
    $q.iconMapFn = (name) => {
      const icon = ICONS[name];
      if (icon !== undefined) {
        return { icon };
      }
    };

    // Initialize Web3
    store.dispatch("init");
  }
});
</script>
