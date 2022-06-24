<template>
  <q-avatar @click.stop.prevent="copy" size="sm" v-bind="$attrs">
    <div v-html="avatar" />
    <Tooltip class="overflow-hidden">
      <slot>
        <div class="text-no-wrap">
          <q-icon name="copy" left />
          {{ tooltip || shortAddr(address) }}
        </div>
      </slot>
    </Tooltip>
  </q-avatar>
</template>

<script>
import jazzicon from "@metamask/jazzicon";
import Tooltip from "./Tooltip";
import { shortAddr } from "src/util/formatting";
import { notifyCopied, notifyError } from "src/util/notify";
import { copyToClipboard } from "quasar";

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

  methods: {
    copy() {
      copyToClipboard(this.address)
        .then(() => notifyCopied(this.address))
        .catch(notifyError);
    },
    shortAddr,
  },
};
</script>
