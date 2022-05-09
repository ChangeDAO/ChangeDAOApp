<template>
  <q-list>
    <slot name="before" />
    <SmoothReflow>
      <q-item v-for="(item, i) in model" :key="i + 1">
        <q-item-section class="q-pr-sm" side>
          <q-btn icon="menu_dots" dense flat>
            <q-menu auto-close>
              <q-list>
                <q-item @click="remove(i)" clickable>
                  <q-item-section avatar>
                    <q-icon name="delete" />
                  </q-item-section>
                  <q-item-section>
                    {{ $t("Delete") }}
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-item-section>
        <q-input
          class="col"
          v-model="model[i]"
          :rules="[isValid]"
          hide-bottom-space
          v-bind="$attrs"
        >
          <template v-slot:prepend>
            <AddrAvatar v-if="isValid(model[i])" :address="model[i]" />
          </template>
        </q-input>
      </q-item>
    </SmoothReflow>

    <q-item @click="add" class="non-selectable" clickable v-ripple>
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
  props: ["addresses"],
  setup(props, { emit }) {
    const model = computed({
      get() {
        return props.addresses;
      },
      set(value) {
        emit("update:addresses", value);
      }
    });

    const add = () => {
      model.value.push("");
    };

    const remove = index => {
      model.value.splice(index, 1);
    };

    const isValid = addr => Moralis.web3Library.utils.isAddress(addr);

    return { model, add, remove, isValid };
  }
};
</script>
