<template>
  <div class="column">
    <q-carousel
      v-model="currentToken"
      :swipeable="Boolean(navOptions.length)"
      transition-prev="slide-right"
      transition-next="slide-left"
      keep-alive
      animated
      :arrows="fullscreen"
      prev-icon="arrow_left"
      next-icon="arrow_right"
      v-model:fullscreen="fullscreen"
      v-bind="$attrs"
    >
      <template v-if="tokenIds">
        <TokenCard
          v-for="(token, i) in tokenIds"
          :key="i"
          :baseURI="baseURI"
          :token="token"
          :name="token"
          :show-info="showInfo"
        />
      </template>
      <TokenCard v-if="!tokenIds || !tokenIds.length" :name="-1" :key="-1" />

      <template v-if="tokenIds && tokenIds.length" v-slot:control>
        <q-carousel-control position="top-left" :offset="[12, 12]">
          <q-btn
            @click="showInfo = !showInfo"
            icon="info"
            color="white"
            round
            flat
          />
        </q-carousel-control>
        <q-carousel-control position="top-right" :offset="[12, 12]">
          <q-btn
            @click="fullscreen = !fullscreen"
            :icon="fullscreen ? 'fullscreen_exit' : 'fullscreen'"
            color="white"
            round
            flat
          />
        </q-carousel-control>
      </template>
    </q-carousel>

    <!-- Buttons -->
    <div v-if="navOptions.length" class="row justify-center">
      <q-pagination
        v-model="currentTokenIndex"
        :max="navOptions.length"
        :max-pages="8"
        color="accent"
        active-color="primary"
        direction-links
      />
    </div>
  </div>
</template>

<script>
import { computed, ref, toRef, watch } from "vue";

import TokenCard from "./TokenCard.vue";

export default {
  name: "TokenCarousel",

  components: { TokenCard },

  props: {
    baseURI: String,
    tokenIds: Array,
  },

  setup(props) {
    const currentToken = ref(-1);
    const currentTokenIndex = computed({
      get() {
        return props.tokenIds.indexOf(currentToken.value) + 1;
      },
      set(i) {
        currentToken.value = props.tokenIds[i - 1];
      },
    });
    const fullscreen = ref(false);
    const showInfo = ref(true);
    const navOptions = toRef(props, "tokenIds");

    watch(
      () => props.tokenIds,
      (ids) => {
        currentToken.value = ids && ids.length ? ids[0] : -1;
      }
    );
    currentToken.value = props.tokenIds ? props.tokenIds[0] || -1 : -1;

    return {
      currentToken,
      currentTokenIndex,
      fullscreen,
      showInfo,
      navOptions,
    };
  },
};
</script>
