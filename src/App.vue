<template>
  <router-view />
</template>
<script>
import { defineComponent } from "vue";
import { useQuasar } from 'quasar'

import ICONS from "./icons";

export default defineComponent({
  name: "App",

  setup() {
    const $q = useQuasar();

    $q.iconMapFn = (name) => {
      const icon = ICONS[name];
      if (icon !== undefined) {
        return { icon };
      }
    };
  }
});
</script>
