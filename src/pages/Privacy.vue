<template>
  <q-page
    :style="{ maxWidth: $q.screen.sizes.md + 'px' }"
    class="q-mx-auto"
    padding
  >
    <q-markdown :src="text" no-heading-anchor-links />
  </q-page>
</template>

<script>
import { defineComponent } from "vue";

import text from "raw-loader!../i18n/en-US/privacy.md";

export default defineComponent({
  name: "PagePrivacy}",
  setup() {
    return { text };
  },
});
</script>
