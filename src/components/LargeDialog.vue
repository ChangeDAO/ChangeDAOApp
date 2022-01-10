<template>
  <q-dialog
    ref="dialog"
    :content-class="classes"
    :maximized="maximized"
    @hide="hide"
    no-route-dismiss
    v-bind="$attrs"
  >
    <q-layout view="hHh lpr fFf" :style="{ height, maxWidth: maxWidth + 'px' }" container>
      <q-header v-if="$slots.header" :reveal="$q.screen.height <= 400" elevated>
        <slot name="header" />
      </q-header>

      <q-footer v-if="$slots.footer" bordered elevated>
        <slot name="footer" />
      </q-footer>

      <q-page-container class="fit">
        <slot />
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script>
const HEIGHT = 700;

export default {
  name: "LargeDialog",
  props: {
    fullscreen: Boolean,
    goBack: Boolean,
    minHeight: Number,
    maxWidth: {
      type: Number,
      default: 560
    },
    noMaximize: Boolean,
    contentClass: String,
  },
  computed: {
    maximized() {
      return (
        this.fullscreen ||
        (!this.noMaximize &&
          (this.$q.screen.lt.sm ||
            (this.$q.screen.width <= this.$q.screen.sizes.md &&
              this.$q.screen.height <= this.$q.screen.sizes.sm)))
      );
    },
    height() {
      return this.maximized ? "100%" : (this.minHeight || HEIGHT) + "px";
    },
    classes() {
      let classes = ["large-dialog", "non-selectable", this.contentClass];
      if (this.maximized) {
        classes.push("maximized");
      }
      return classes;
    },
  },
  methods: {
    hide() {
      if (this.goBack) {
        this.$router.back();
      }
    },
  },
};
</script>

<style lang="scss">
.large-dialog {
  .q-layout-container {
    transition: height $generic-hover-transition;
  }
}
</style>
