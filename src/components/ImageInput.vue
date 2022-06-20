<template>
  <SmoothReflow class="image-input">
    <div v-if="image">
      <q-img
        class="input-image"
        :src="image"
        :ratio="square ? 1 : null"
        cover
        native-context-menu
      />
      <q-menu v-if="!disable" auto-close touch-position>
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
    <q-btn v-else class="fit relative-position" :disable="disable" padding="0">
      <div class="fit flex flex-center" :class="{ square }">
        <q-icon name="image" size="lg" />
      </div>
      <q-file
        v-model="file"
        @input="fileSelected"
        accept="image/*"
        display-value=""
        class="overflow-hidden absolute fit"
        input-class="absolute fit"
        style="min-width: 3em"
        :max-file-size="MAX_FILE_BYTES"
        :disable="disable"
        borderless
      />
    </q-btn>
  </SmoothReflow>
</template>

<script>
import { computed, ref } from "vue";

import SmoothReflow from "./SmoothReflow";

import { MAX_FILE_BYTES } from "../util/constants";
import { notifyError } from "../util/notify";

export default {
  name: "ImageInput",

  components: { SmoothReflow },

  props: {
    modelValue: String,
    disable: Boolean,
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
        if (newFile.size > MAX_FILE_BYTES) {
          notifyError("fileTooBig");
        } else {
          const reader = new FileReader();
          reader.onload = () => {
            image.value = reader.result;
          };
          reader.readAsDataURL(newFile);
        }
        file.value = null;
      }
    };

    return {
      file,
      image,
      fileSelected,
      MAX_FILE_BYTES,
    };
  },
};
</script>

<style lang="scss">
.image-input {
  background-color: $img-bg;

  .input-image {
    display: block;
    margin: 0 auto;
  }
}
</style>
