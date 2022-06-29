<template>
  <q-carousel-slide
    class="token-card square q-img__content overflow-hidden relative-position"
    v-bind="$attrs"
    :img-src="imageURL"
  >
    <div
      v-if="!isLoading"
      class="info-overlay absolute-bottom text-center non-selectable"
      :class="{ hide: !showInfo }"
    >
      <SmoothReflow>
        <div v-show="showInfo">
          <div class="text-h4">#{{ token }} {{ nft.name }}</div>
          <div class="text-subtitle1">{{ nft.description }}</div>
        </div>
      </SmoothReflow>
    </div>
    <q-inner-loading :showing="isLoading" />
  </q-carousel-slide>
</template>

<style lang="scss">
.token-card {
  background-size: contain;
  background-repeat: no-repeat;

  .info-overlay {
    background-color: rgba(#000, 0.8);
    opacity: 1;
    transition: opacity 0.3s linear;
    &.hide {
      opacity: 0;
    }
  }
}
</style>

<script>
import { computed, onMounted, ref, watch } from "vue";

import SmoothReflow from "./SmoothReflow";

import { IPFS, IPFS_GATEWAY } from "../util/constants";

export default {
  name: "TokenCard",

  components: { SmoothReflow },

  props: {
    baseURI: String,
    token: [String, Number],
    showInfo: Boolean,
  },

  setup(props) {
    const isLoading = ref(true);
    const nft = ref(null);
    const tokenURL = computed(() =>
      props.baseURI
        ? (IPFS.test(props.baseURI)
            ? props.baseURI.replace(IPFS, IPFS_GATEWAY)
            : IPFS_GATEWAY + props.baseURI + "/") + props.token
        : ""
    );
    const imageURL = computed(() =>
      nft.value ? nft.value.image.replace(IPFS, IPFS_GATEWAY) : null
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

    return { isLoading, nft, imageURL, tokenURL };
  },
};
</script>
