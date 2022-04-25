<template>
  <span v-if="textOnly">
    {{ before }}
    {{ isAbsolute ? tooltip : label }}
    {{ after }}
  </span>
  <q-chip v-else-if="value" v-bind="$attrs">
    <slot name="before">{{ before }}</slot>
    {{ isAbsolute ? tooltip : label }}
    <slot name="after">{{ after }}</slot>
    <Tooltip>{{ isAbsolute ? label : tooltip }}</Tooltip>
  </q-chip>
</template>

<script>
import Tooltip from "./Tooltip";

import { format, formatDistanceToNow } from "date-fns";

export default {
  name: "relative-time",
  components: { Tooltip },
  props: {
    before: String,
    after: String,
    value: Date,
    textOnly: Boolean,
    invert: Boolean,
    full: Boolean
  },
  data() {
    return {
      label: "",
      timer: null
    };
  },
  computed: {
    isAbsolute() {
      return this.invert;
    },
    tooltip() {
      return format(
        this.value,
        this.$t(this.full ? "format.date-time-full" : "format.date-time-short")
      );
    }
  },
  methods: {
    updateLabel() {
      this.label = formatDistanceToNow(this.value, { addSuffix: true });
    }
  },
  watch: {
    value() {
      this.updateLabel();
    }
  },
  created() {
    this.updateLabel();
    this.timer = setInterval(this.updateLabel, 15e3);
  },
  unmounted() {
    clearInterval(this.timer);
  }
};
</script>
