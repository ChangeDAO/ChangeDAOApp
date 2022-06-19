<template>
  <q-tooltip
    :delay="0"
    self="bottom middle"
    anchor="top middle"
    transition-show="jump-up"
    transition-hide="jump-down"
    content-class="non-selectable"
    :offset="offset"
    v-bind="$attrs"
  >
    <slot />
  </q-tooltip>
</template>

<script>
export default {
  name: "tooltip",
  computed: {
    offset() {
      return this.$q.platform.has.touch ? [0, 20] : [0, 5];
    },
  },
};
</script>

<style lang="scss">
.q-tooltip--style {
  font-size: 0.8rem;
  background-color: rgba(#000, 0.8);
  color: #fff;
}
</style>
