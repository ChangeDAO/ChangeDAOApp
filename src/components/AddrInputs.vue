<template>
  <q-list>
    <slot name="before" />
    <SmoothReflow>
      <q-item v-for="(item, i) in model" :key="i + 1">
        <q-item-section>
          <q-item-label>
            <q-input
              class="col"
              v-model="model[i]"
              :rules="[isValid]"
              :autofocus="!item"
              :disable="disable"
              hide-bottom-space
              v-bind="$attrs"
            >
              <template v-slot:prepend>
                <AddrAvatar v-if="isValid(model[i])" :address="model[i]" />
                <q-avatar v-else color="primary" size="sm" />
              </template>
            </q-input>
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn
            @click="remove(i)"
            icon="delete"
            :disable="disable"
            round
            flat
          />
        </q-item-section>
      </q-item>
    </SmoothReflow>

    <q-item
      v-show="model.length < limit"
      @click="add()"
      class="non-selectable"
      :disabled="disable"
      :clickable="!disable"
      v-ripple="!disable"
    >
      <q-item-section side>
        <q-icon name="add" />
      </q-item-section>
      <q-item-section>
        {{ $t("Add") }}
      </q-item-section>
    </q-item>

    <slot name="after" />
  </q-list>
</template>

<script>
import AddrAvatar from "./AddrAvatar";
import SmoothReflow from "./SmoothReflow";

import Moralis from "moralis";
import { computed } from "vue";

export default {
  name: "AddrInputs",
  components: { AddrAvatar, SmoothReflow },
  props: {
    addresses: Array,
    disable: Boolean,
    limit: {
      type: Number,
      default: Infinity,
    },
  },
  setup(props, { emit }) {
    const model = computed({
      get() {
        return props.addresses;
      },
      set(value) {
        emit("update:addresses", value);
      },
    });

    const add = (addr = "") => {
      if (!props.disable && model.value.length < props.limit) {
        model.value.push(addr);
      }
    };

    const remove = (index) => {
      model.value.splice(index, 1);
    };

    const isValid = (addr) => Moralis.web3Library.utils.isAddress(addr);

    return { model, add, remove, isValid };
  },
};
</script>
