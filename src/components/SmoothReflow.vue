<template>
  <component v-bind="$attrs" :is="tag">
    <slot />
  </component>
</template>

<script>
import smoothReflow from "vue-smooth-reflow";
import { defaults } from "lodash";

export default {
  name: "smooth-reflow",
  mixins: [smoothReflow],
  props: {
    tag: {
      type: String,
      default: "div",
    },
    options: Object,
    heightOnly: Boolean,
    widthOnly: Boolean,
  },
  mounted() {
    this.$smoothReflow(
      defaults(this.options, {
        property: this.heightOnly
          ? "height"
          : this.widthOnly
          ? "width"
          : ["width", "height"],
        transition: ".3s cubic-bezier(.25, .8, .5, 1)",
      })
    );
  },
};
</script>
