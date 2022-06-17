<template>
  <q-page
    v-if="project && mint"
    class="page-mint-tx"
    :class="{ doubleColumn }"
    padding
  >
    <!-- Page Title -->
    <p class="text-h3">{{ $t("Processing Transaction") }}</p>

    <!-- Progress (Single Column) -->
    <q-linear-progress v-if="isPending && !doubleColumn" indeterminate />

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
        <q-linear-progress v-if="isPending && doubleColumn" indeterminate />

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
                {{ $n(project.mintPriceInUsd, "USD") }} USD
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label>{{ $t("Number of Mints") }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label>{{ mint.tokenIds.length }}</q-item-label>
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
              <q-item-label
                >{{
                  $n(project.mintPriceInUsd * mint.tokenIds.length, "USD")
                }}
                USD</q-item-label
              >
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label>{{ $t("Currency") }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label>{{ mint.paymentType.toUpperCase() }}</q-item-label>
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
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { Loading, useQuasar } from "quasar";

import ProjectInfo from "../components/ProjectInfo";

import { TX_URL } from "../util/constants";
import { notifyError, listenPending } from "../util/notify";

import Moralis from "moralis";

export default {
  name: "PageMintTx",

  components: { ProjectInfo },

  props: ["projectID", "mintID"],

  setup(props, context) {
    const store = useStore();
    const $q = useQuasar();

    const doubleColumn = computed(() => $q.screen.width > 584);
    const project = computed(() => store.state.projects[props.projectID]);
    const mint = ref(null);
    const backgroundImage = computed(() => {
      return project.value && project.value.img
        ? `url(${project.value.img})`
        : null;
    });

    // Initialize
    let subscription = null;
    let pendingChanges = {};
    const isPending = ref(false);
    onMounted(async () => {
      Loading.show();

      if (!project.value) {
        try {
          await store.dispatch("getProject", props.projectID);
        } catch (error) {
          console.error(error);
          notifyError(error.error || error);
        }
      }

      try {
        mint.value = (
          await Moralis.Cloud.run("getMint", { mintId: props.mintID })
        ).mint;
      } catch (error) {
        console.error(error);
        notifyError(error);
      }

      let result = await listenPending({
        params: {
          entityType: "Mint",
          entityId: props.mintID,
        },
        onDeletion(change) {
          console.log("Deleted", change);
          delete pendingChanges[change.entityId];
          if (Object.keys(pendingChanges).length === 0) {
            console.log("Finished");
            isPending.value = false;
          } else {
          }
        },
      });
      subscription = result.subscription;
      pendingChanges = result.initialPendingChanges;
      isPending.value = Object.keys(pendingChanges).length > 0;

      Loading.hide();
    });

    onBeforeUnmount(() => {
      Loading.hide();
      if (subscription) {
        // Unlisten
        Moralis.LiveQuery.close();
        subscription = null;
      }
    });

    // Web3
    const user = computed(() => store.state.web3.user);

    const etherscanURL = computed(() =>
      mint.value ? TX_URL + mint.value.creationTransactionHash : ""
    );

    return {
      doubleColumn,
      isPending,
      project,
      backgroundImage,
      user,
      mint,
      etherscanURL,
    };
  },
};
</script>
