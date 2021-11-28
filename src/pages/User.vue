<template>
  <q-page padding>
    <div class="text-h6">{{ $t("User") }}</div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "PageUser",
  props: ["id"]
});
</script>
