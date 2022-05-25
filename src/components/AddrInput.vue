<template>
  <q-input v-model="model" :rules="[isValid]" hide-bottom-space v-bind="$attrs">
    <template v-slot:prepend>
      <AddrAvatar v-if="isValid(model)" :address="model" />
      <q-avatar v-else color="primary" size="sm" />
    </template>
    <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope || {}" />
    </template>
  </q-input>
</template>

<script>
import AddrAvatar from "./AddrAvatar";

import Moralis from "moralis";
import { computed } from "vue";

export default {
  name: "AddrInput",
  components: { AddrAvatar },
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

    const isValid = addr => Moralis.web3Library.utils.isAddress(addr);

    return { model, isValid };
  }
};
</script>
