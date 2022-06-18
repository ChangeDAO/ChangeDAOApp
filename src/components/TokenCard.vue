<template>
  <q-carousel-slide
    class="square overflow-hidden"
    v-bind="$attrs"
    :img-src="imageURL"
  >
    <div v-if="!isLoading" class="absolute-bottom overlay text-center q-pa-sm">
      <div class="text-h4">{{ nft.name }}</div>
      <div class="text-subtitle1">{{ nft.description }}</div>
    </div>
    <q-inner-loading :showing="isLoading" />
  </q-carousel-slide>
</template>

<style lang="scss">
.square {
  background-color: $grey-9;
  background-size: contain;

  &:after {
    content: "";
    display: block;
    padding-bottom: 100%;
  }
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
      props.baseURI && props.token
        ? IPFS_GATEWAY + props.baseURI + "/" + props.token
        : ""
    );
    const imageURL = computed(() =>
      nft.value ? nft.value.image.replace(/^ipfs:\/\//i, IPFS_GATEWAY) : null
    );

    const init = async () => {
      if (tokenURL.value) {
        try {
          isLoading.value = true;
          nft.value = await (await fetch(tokenURL.value)).json();
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
