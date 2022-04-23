<template>
  <q-avatar v-html="avatar" size="sm" class="overflow-hidden" v-bind="$attrs" />
</template>

<script>
import jazzicon from "@metamask/jazzicon";

export default {
  name: "AddrAvatar",
  props: ["value"],
  computed: {
    avatar() {
      const addr = this.value.slice(2, 10);
      const seed = parseInt(addr, 16);
      const avatar = jazzicon(24, seed);
      return avatar.innerHTML;
    }
  }
};
</script>
