<template>
  <q-page padding>
    <div class="text-h6">{{ $t("Collection") }}</div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "PageCollection",
  props: ["id"]
});
</script>
