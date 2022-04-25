<template>
  <span v-if="textOnly">
    {{ before }}
    {{ isAbsolute ? tooltip : label }}
    {{ after }}
  </span>
  <q-chip v-else-if="date" v-bind="$attrs">
    <slot name="before">{{ before }}</slot>
    {{ isAbsolute ? tooltip : label }}
    <slot name="after">{{ after }}</slot>
    <Tooltip>{{ isAbsolute ? label : tooltip }}</Tooltip>
  </q-chip>
</template>

<script>
import Tooltip from "./Tooltip";

import {
  differenceInDays,
  format,
  formatDistance,
  parse,
  startOfDay,
  startOfToday
} from "date-fns";

export default {
  name: "relative-date",
  components: { Toolip },
  props: {
    before: String,
    after: String,
    value: [Date, Number, Object, String],
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
    today() {
      return startOfToday();
    },
    date() {
      return !this.value || this.value instanceof Date
        ? this.value
        : parse(this.value, this.$t("format.date-standard"), new Date());
    },
    tooltip() {
      return format(
        this.date,
        this.$t(this.full ? "format.date-full" : "format.date-short")
      );
    }
  },
  methods: {
    updateLabel() {
      const diff = differenceInDays(startOfDay(this.date), this.today);
      if (Math.abs(diff) < 2) {
        this.label = this.$t(
          diff < 0 ? "yesterday" : diff > 0 ? "tomorrow" : "today"
        );
      } else {
        this.label = formatDistance(startOfDay(this.date), this.today, {
          addSuffix: true
        });
      }
    }
  },
  watch: {
    value() {
      this.updateLabel();
    }
  },
  created() {
    this.updateLabel();
    this.timer = setInterval(this.updateLabel, 9e5);
  },
  destroyed() {
    clearInterval(this.timer);
  }
};
</script>
