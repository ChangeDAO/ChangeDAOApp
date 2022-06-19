<template>
  <div class="column">
    <q-carousel
      v-model="currentToken"
      :swipeable="Boolean(navOptions.length)"
      transition-prev="slide-right"
      transition-next="slide-left"
      height="auto"
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
        />
      </template>
      <TokenCard v-if="!tokenIds || !tokenIds.length" :name="0" :key="0" />

      <template v-if="tokenIds && tokenIds.length" v-slot:control>
        <q-carousel-control position="top-right" :offset="[12, 12]">
          <q-btn
            @click="fullscreen = !fullscreen"
            :icon="fullscreen ? 'fullscreen_exit' : 'fullscreen'"
            color="white"
            dense
            round
            flat
          />
        </q-carousel-control>
      </template>
    </q-carousel>

    <!-- Buttons -->
    <div v-if="navOptions.length" class="row justify-center">
      <q-btn-toggle v-model="currentToken" :options="navOptions" />
    </div>
  </div>
</template>

<script>
import { computed, ref, watch } from "vue";

import TokenCard from "./TokenCard.vue";

export default {
  name: "TokenCarousel",

  components: { TokenCard },

  props: {
    baseURI: String,
    tokenIds: Array,
  },

  setup(props) {
    const currentToken = ref(0);
    const fullscreen = ref(false);

    const navOptions = computed(() =>
      props.tokenIds
        ? props.tokenIds.map((value) => ({
            label: value,
            value,
          }))
        : []
    );

    watch(
      () => props.tokenIds,
      (ids) => {
        currentToken.value = ids && ids.length ? ids[0] : 0;
        console.log(ids, (currentToken.value = ids && ids.length ? ids[0] : 0));
      }
    );
    currentToken.value = props.tokenIds ? props.tokenIds[0] || 0 : 0;

    return { currentToken, fullscreen, navOptions };
  },
};
</script>
