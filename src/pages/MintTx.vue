<template>
  <q-page v-if="project" class="page-mint-tx" :class="{ doubleColumn }" padding>
    <!-- Page Title -->
    <p class="text-h3">{{ $t("Processing Transaction") }}</p>

    <!-- Progress (Single Column) -->
    <div v-if="!doubleColumn">
      <q-linear-progress indeterminate />
    </div>

    <div class="row" :class="{ 'q-col-gutter-xl': doubleColumn }">
      <!-- Info column -->
      <div class="image-column page-col col q-col-3">
        <div>
          <!-- Image -->
          <div class="square q-mb-lg" :style="{ backgroundImage }" />
        </div>
      </div>

      <!-- Info column -->
      <div class="info-column page-col col q-col-9 q-gutter-lg">
        <!-- Progress (Double Column) -->
        <div v-if="doubleColumn">
          <q-linear-progress indeterminate />
        </div>

        <!-- Project Info -->
        <ProjectInfo :project="project" />

        <q-separator color="white" />

        <!-- Transaction Details -->

        <q-list separator>
          <q-item>
            <q-item-section>
              <q-item-label>{{ $t("Transaction Summary") }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label>
                <a
                  :href="etherscanURL"
                  class="external"
                  target="_blank"
                  rel="nofollow"
                >
                  {{ $t("View on Etherscan") }}
                </a>
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label>{{ $t("Cost per Mint") }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label>
                {{ $n(project.tokenPriceUSD, "USD") }} USD
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label>{{ $t("Number of Mints") }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label>{{ 2 }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label>ChangeDAO {{ $t("Tip") }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label>tip</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label>{{ $t("Total") }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label>{{ $n(525, "USD") }} USD</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label>{{ $t("Currency") }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label>ETH</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </q-page>
</template>

<style lang="scss">
.page-mint-tx {
  &.doubleColumn > .row > .image-column {
    max-width: 350px;
  }

  .square {
    background-color: $grey-9;
    background-image: url(~assets/chest.png);
    background-size: contain;

    &:after {
      content: "";
      display: block;
      padding-bottom: 100%;
    }
  }
}
</style>

<script>
import { defineComponent, computed } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import { useQuasar } from "quasar";

import ProjectInfo from "../components/ProjectInfo";

export default defineComponent({
  name: "PageMintTx",

  components: { ProjectInfo },

  props: ["projectID", "txID"],

  setup(props, context) {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const $q = useQuasar();

    const doubleColumn = computed(() => $q.screen.width > 584);
    const project = computed(() => store.state.projects[props.projectID]);
    const backgroundImage = computed(() => {
      return project.value && project.value.img
        ? `url(${project.value.img})`
        : null;
    });

    // Fetch the project
    store.dispatch("getProject", props.projectID).catch(message => {
      $q.notify({
        message,
        type: "negative",
        icon: "alert",
        position: "top"
      });
    });

    // Web3
    const user = computed(() => store.state.web3.user);

    const etherscanURL = "https://etherscan.io/";

    return {
      doubleColumn,
      project,
      backgroundImage,
      user,
      etherscanURL
    };
  }
});
</script>
