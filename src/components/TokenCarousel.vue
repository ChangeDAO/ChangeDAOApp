<template>
  <q-carousel
    v-model="currentToken"
    control-color="grey-8"
    height="auto"
    keep-alive
    :swipeable="Boolean(tokenIds && tokenIds.length)"
    :animated="Boolean(tokenIds && tokenIds.length)"
    :arrows="Boolean(tokenIds && tokenIds.length)"
    prev-icon="arrow_left"
    next-icon="arrow_right"
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
  </q-carousel>
</template>

<script>
import { ref, watch } from "vue";

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

    watch(props.tokenIds, (ids) => {
      currentToken.value = ids ? ids[0] : 0;
    });
    currentToken.value = props.tokenIds ? props.tokenIds[0] : 0;

    return { currentToken };
  },
};
</script>
