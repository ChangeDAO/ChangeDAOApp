<template>
  <q-carousel-slide
    class="q-img__content square overflow-hidden relative-position"
    v-bind="$attrs"
    :img-src="imageURL"
  >
    <div v-if="!isLoading" class="absolute-bottom text-center non-selectable">
      <div class="text-h4">{{ nft.name }}</div>
      <div class="text-subtitle1">{{ nft.description }}</div>
    </div>
    <q-inner-loading :showing="isLoading" />
  </q-carousel-slide>
</template>

<style lang="scss">
.square {
  background-color: $img-bg;
  background-size: contain;
  background-repeat: no-repeat;
}
</style>

<script>
import { computed, onMounted, ref, watch } from "vue";

import { IPFS_GATEWAY } from "../util/constants";

export default {
  name: "TokenCard",

  props: {
    baseURI: String,
    token: [String, Number],
  },

  setup(props) {
    const isLoading = ref(true);
    const nft = ref(null);
    const tokenURL = computed(() =>
      props.baseURI ? IPFS_GATEWAY + props.baseURI + "/" + props.token : ""
    );
    const imageURL = computed(() =>
      nft.value ? nft.value.image.replace(/^ipfs:\/\//i, IPFS_GATEWAY) : null
    );

    const init = async () => {
      if (tokenURL.value) {
        try {
          isLoading.value = true;
          nft.value = await (await fetch(tokenURL.value)).json();
          if (nft.value && nft.value.image) {
            await new Promise((resolve) => {
              const image = new Image();
              image.addEventListener("load", () => resolve(image));
              image.src = imageURL.value;
            });
          }
        } catch (error) {
          console.error(error);
        } finally {
          isLoading.value = false;
        }
      } else {
        isLoading.value = true;
        nft.value = null;
      }
    };

    watch(tokenURL, () => init());
    onMounted(() => init());

    return { isLoading, nft, imageURL };
  },
};
</script>
