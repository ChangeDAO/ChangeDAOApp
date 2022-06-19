<template>
  <SmoothReflow class="image-input" :class="{ square }">
    <div v-if="image">
      <q-img
        class="input-image"
        :src="image"
        :ratio="square ? 1 : null"
        cover
        native-context-menu
      />
      <q-menu auto-close touch-position>
        <q-list>
          <q-item @click="image = null" clickable>
            <q-item-section avatar>
              <q-icon name="delete" />
            </q-item-section>
            <q-item-section>
              {{ $t("Delete") }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </div>
    <q-btn
      v-else
      icon="image"
      size="lg"
      class="fit relative-position"
      v-bind="$attrs"
    >
      <q-file
        v-model="file"
        @input="fileSelected"
        accept="image/*"
        display-value=""
        class="overflow-hidden absolute fit"
        input-class="absolute fit"
        style="min-width: 3em"
        borderless
        v-bind="$attrs"
      />
    </q-btn>
  </SmoothReflow>
</template>

<script>
import { computed, ref } from "vue";

import SmoothReflow from "./SmoothReflow";

export default {
  name: "ImageInput",

  components: { SmoothReflow },

  props: {
    modelValue: String,
    square: Boolean,
  },

  setup(props, { emit }) {
    const file = ref(null);
    const image = computed({
      get() {
        return props.modelValue;
      },
      set(value) {
        emit("update:modelValue", value);
      },
    });

    const fileSelected = (event) => {
      let newFile = event.currentTarget.files[0];
      if (newFile) {
        const reader = new FileReader();
        reader.onload = () => {
          image.value = reader.result;
        };
        reader.readAsDataURL(newFile);
        file.value = null;
      }
    };

    return {
      file,
      image,
      fileSelected,
    };
  },
};
</script>

<style lang="scss">
.image-input {
  background-color: $grey-9;

  .input-image {
    display: block;
    margin: 0 auto;
  }

  &.square {
    .q-btn {
      padding: 0;
    }
    .q-btn__content:after {
      content: "";
      display: block;
      padding-bottom: 100%;
    }
  }
}
</style>
