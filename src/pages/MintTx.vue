<template>
  <q-page class="page-mint-tx" :class="{ doubleColumn }" padding>
    <!-- Page Title -->
    <p v-if="isPending" class="text-h3">{{ $t("Processing Transaction") }}</p>

    <div
      v-if="project && mint"
      class="row"
      :class="{ 'q-col-gutter-xl': doubleColumn }"
    >
      <!-- Token Images -->
      <div class="image-column page-col col q-col-3">
        <div>
          <TokenCarousel
            class="full-width full-height q-mb-lg"
            :baseURI="project.baseURI"
            :token-ids="mint.tokenIds"
          />
        </div>
      </div>

      <!-- Info column -->
      <div
        class="info-column page-col col q-col-9"
        :class="{ 'q-gutter-lg': $q.screen.gt.sm }"
      >
        <!-- Project Info -->
        <ProjectInfo :project="project" />

        <div v-if="isPending">
          <q-linear-progress indeterminate />
        </div>
        <q-separator v-else color="white" />

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
          <q-item
            v-if="mint.numMints || (mint.tokenIds && mint.tokenIds.length)"
          >
            <q-item-section>
              <q-item-label>{{ $t("Number of Mints") }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label>{{
                mint.numMints || (mint.tokenIds ? mint.tokenIds.length : "?")
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
    const project = ref(null);
    const mint = ref(null);

    const getMint = async () => {
      try {
        mint.value = (
          await Moralis.Cloud.run("getMint", {
            mintId: props.mintID,
          })
        ).mint;
        isPending.value = mint.value.tokenIds.length === 0;
      } catch (error) {
        console.error(error);
        notifyError(error);
      }
    };

    // Initialize
    let subscription = null;
    let pendingChanges = {};
    const isPending = ref(false);
    const init = async () => {
      Loading.show();

      // Load project if necessary
      if (!project.value) {
        try {
          project.value = await store.dispatch("getProject", props.projectID);
        } catch (error) {
          console.error(error);
          notifyError(error.error || error);
        }
      }

      // Abort if project not loaded
      if (!project.value) {
        Loading.hide();
        return notifyError("loadingProject");
      }

      if (!mint.value) {
        await getMint();
      }

      // Abort if mint not loaded
      if (!mint.value) {
        Loading.hide();
        return notifyError("loadingMint");
      }

      // Listen for pending changes
      if (!mint.value.tokenIds.length) {
        isPending.value = true;
        try {
          let result = await listenPending({
            params: {
              entityType: "Mint",
              entityId: props.mintID,
            },
            onDeletion(change) {
              delete pendingChanges[change.id];
              console.info("Remaining pending changes", pendingChanges);
              if (Object.keys(pendingChanges).length === 0) {
                // Unlisten
                if (subscription) {
                  Moralis.LiveQuery.close();
                  subscription = null;
                }
                setTimeout(getMint, 5e3);
              }
            },
          });
          subscription = result.subscription;
          pendingChanges = result.initialPendingChanges;
          console.info("Initial pending changes", pendingChanges);
        } catch (error) {
          console.error(error);
          notifyError(error);
        }
      }

      if (Object.values(pendingChanges).length) {
        Object.assign(
          mint.value,
          ...Object.values(pendingChanges).map((c) => c.dataFromChain)
        );
      } else {
        // Unlisten
        if (subscription) {
          Moralis.LiveQuery.close();
          subscription = null;
        }
      }

      Loading.hide();
    };
    onMounted(init);

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
