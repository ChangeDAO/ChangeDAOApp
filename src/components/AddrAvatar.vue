<template>
  <q-avatar size="sm" v-bind="$attrs">
    <div v-html="avatar" />
    <slot />
  </q-avatar>
</template>

<script>
import jazzicon from "@metamask/jazzicon";

export default {
  name: "AddrAvatar",
  props: ["address"],
  computed: {
    avatar() {
      const addr = this.address.slice(2, 10);
      const seed = parseInt(addr, 16);
      const avatar = jazzicon(24, seed);
      return avatar.innerHTML;
    }
  }
};
</script>
