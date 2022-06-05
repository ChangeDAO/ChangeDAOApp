<template>
  <q-input outlined label-color="grey-8" v-model="model" dense label="FEATURED" class="search-bar q-pr-lg">
    <template v-slot:append>
      <q-icon name="search" color="grey-8"></q-icon>
    </template>
  </q-input>
</template>

<style lang="scss">
.search-bar.q-field--outlined{
  .q-field__control:before {
    border: 1px solid $grey-8;
  }
}
</style>

<script>
import { computed } from "vue";

export default {
  name: "SearchProject",
  components: {},
  props: ["modelValue"],
  setup(props, { emit }) {
    const model = computed({
      get() {
        return props.modelValue;
      },
      set(value) {
        emit("update:modelValue", value);
      }
    });

    return { model };
  }
};
</script>
