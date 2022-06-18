<template>
  <q-page class="page-mint-tx" :class="{ doubleColumn }" padding>
    <!-- Page Title -->
    <p v-if="isPending" class="text-h3">{{ $t("Processing Transaction") }}</p>

    <!-- Progress (Single Column) -->
    <q-linear-progress v-if="isPending && !doubleColumn" indeterminate />

    <div
      v-if="project && mint"
      class="row"
      :class="{ 'q-col-gutter-xl': doubleColumn }"
    >
      <!-- Info column -->
      <div class="image-column page-col col q-col-3">
        <div>
          <!-- Images -->
          <TokenCarousel
            class="full-width full-height q-mb-lg"
            :baseURI="project.baseURI"
            :token-ids="mint.tokenIds"
          />
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
          <q-item v-if="project.mintPriceInUsd">
            <q-item-section>
              <q-item-label>{{ $t("Cost per Mint") }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label>
                {{ $n(project.mintPriceInUsd, "USD") }} USD
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-if="mint.numMints || mint.tokenIds">
            <q-item-section>
              <q-item-label>{{ $t("Number of Mints") }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label>{{
                mint.numMints || mint.tokenIds ? mint.tokenIds.length : 0
              }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-if="mint.tipAmountInUsd">
            <q-item-section>
              <q-item-label>ChangeDAO {{ $t("Tip") }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label>{{ $n(mint.tipAmountInUsd, "USD") }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label>{{ $t("Total") }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label
                >{{
                  $n(
                    (mint.totalPriceInUsd || 0) + (mint.tipAmountInUsd || 0),
                    "USD"
                  )
                }}
                USD</q-item-label
              >
            </q-item-section>
          </q-item>
          <q-item v-if="mint.paymentType">
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
}
</style>

<script>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { Loading, useQuasar } from "quasar";

import ProjectInfo from "../components/ProjectInfo";
import TokenCarousel from "../components/TokenCarousel";

import { TX_URL } from "../util/constants";
import { notifyError, listenPending } from "../util/notify";

import Moralis from "moralis";

export default {
  name: "PageMintTx",

  components: { ProjectInfo, TokenCarousel },

  props: ["projectID", "mintID"],

  setup(props, context) {
    const store = useStore();
    const $q = useQuasar();

    const doubleColumn = computed(() => $q.screen.width > 584);
    const project = computed(() => store.state.projects[props.projectID]);
    const mint = ref(null);

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
        let result = await Moralis.Cloud.run("getMint", {
          mintId: props.mintID,
        });
        mint.value = result.mint;

        result = await listenPending({
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
            }
          },
        });
        subscription = result.subscription;
        pendingChanges = result.initialPendingChanges;
        isPending.value = Object.keys(pendingChanges).length > 0;
        if (isPending.value) {
          Object.assign(
            mint.value,
            ...Object.values(pendingChanges).map((c) => c.dataFromChain)
          );
        }
      } catch (error) {
        console.error(error);
        notifyError(error);
      }

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
      user,
      mint,
      etherscanURL,
    };
  },
};
</script>
