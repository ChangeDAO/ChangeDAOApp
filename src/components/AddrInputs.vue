<template>
  <q-list>
    <slot name="before" />
    <SmoothReflow>
      <q-item v-for="(item, i) in model" :key="i">
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
        <AddrInput
          class="col"
          :modelValue="item"
          @update:modelValue="set(i, $event)"
          :key="i"
          v-bind="$attrs"
        />
        {{ JSON.stringify(model) }}
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
import AddrInput from "./AddrInput";
import SmoothReflow from "./SmoothReflow";

import { computed } from "vue";

export default {
  name: "AddrInputs",
  components: { AddrInput, SmoothReflow },
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

    const add = () => {
      model.value.push("");
    };

    const remove = index => {
      model.value.splice(index, 1);
    };

    const set = (index, value) => {
      model.value[index] = value;
    };

    return { model, add, remove, set };
  }
};
</script>
