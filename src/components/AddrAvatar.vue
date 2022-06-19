<template>
  <q-avatar size="sm" v-bind="$attrs">
    <div v-html="avatar" />
    <slot>
      <Tooltip>{{ tooltip || address }}</Tooltip>
    </slot>
  </q-avatar>
</template>

<script>
import jazzicon from "@metamask/jazzicon";
import Tooltip from "./Tooltip";

export default {
  name: "AddrAvatar",

  components: { Tooltip },

  props: ["address", "tooltip"],

  computed: {
    avatar() {
      const addr = this.address.slice(2, 10);
      const seed = parseInt(addr, 16);
      const avatar = jazzicon(24, seed);
      return avatar.innerHTML;
    },
  },
};
</script>
