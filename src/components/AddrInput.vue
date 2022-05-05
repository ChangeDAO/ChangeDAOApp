<template>
  <q-input v-model="model" :rules="[isValid]" hide-bottom-space v-bind="$attrs">
    <template v-slot:prepend>
      <AddrAvatar v-if="isValid(model.value)" :modelValue="model" />
    </template>
    <template v-for="(_, name) in $slots" v-slot:[name]="slotData"
      ><slot :name="name" v-bind="slotData"
    /></template>
  </q-input>
</template>

<script>
import Moralis from "moralis";
import AddrAvatar from "./AddrAvatar";
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
