<template>
  <q-page v-if="project" class="page-project-mint" padding>
    <div class="row q-col-gutter-xl reverse">
      <!-- Project Image -->

      <div class="page-col col q-col-6">
        <div class="sticky header-top">
          <!-- Connect Wallet -->
          <LogIn
            v-if="!userAddress"
            class="full-width q-mb-lg"
            :label="$t('Connect Wallet')"
          />

          <!-- Mint NFT -->
          <q-btn
            v-if="userAddress && (!isRainbowPeriod || isOnRainbowList)"
            @click="mint"
            :label="$t('Mint NFT')"
            class="full-width q-mb-lg"
            color="primary"
          />

          <!-- Image -->
          <div class="square" :style="{ backgroundImage }" />
        </div>
      </div>

      <div class="page-col col q-col-6">
        <ProjectInfo :project="project" editable />

        <q-separator class="q-my-lg" />

        <!-- Qualitative Details -->

        <p class="text-subtitle">
          {{ $t("Artwork Description") }}
        </p>
        <p class="pre-line">{{ project.description }}</p>
        <br />

        <p class="text-subtitle">
          {{ $t("Creating Change") }}
        </p>
        <p class="pre-line">{{ project.changemaker.creatingChangeBy }}</p>

        <q-separator class="q-my-lg" />

        <!-- Quantitative Details -->

        <div class="row">
          <!-- Minted -->
          <div class="col-6 q-mb-lg">
            <p class="text-subtitle">
              {{ $t("Total Minted") }}
            </p>
            <p>
              {{
                $t("n of m", {
                  n: $n(minted || 0, "n8"),
                  m: $n(project.numMints || 0, "n8"),
                })
              }}
            </p>
          </div>

          <!-- Goal -->
          <!-- <div class="col-6 q-mb-lg">
            <p class="text-subtitle">
              {{ $t("Fundraising Goal") }}
            </p>
            <p>{{ $n(project.goalUSD, "compactUSD") }} USD</p>
          </div> -->
        </div>

        <!-- Price -->
        <div class="q-mb-lg">
          <p class="text-subtitle">
            {{ $t("Price per Token") }}
          </p>
          <p v-if="project.mintPriceInUsd > 0">
            {{ $n(project.mintPriceInUsd, "compactUSD") }} USD
            {{ $t("via [PaymentMethods]") }}
          </p>
          <p v-else>
            {{ $t("Free") }}
          </p>
        </div>

        <q-separator class="q-mb-lg" />

        <!-- Mint -->
        <div class="text-h4">
          <div class="col-grow q-mb-lg">
            {{ $t("Ready to support?") }}
          </div>

          <p v-if="isRainbowPeriod">
            <RelativeTime
              :before="
                $t(
                  isOnRainbowList
                    ? 'Rainbow period ends'
                    : 'Public minting begins'
                )
              "
              :value="rainbowExpiration"
              text-only
            />
          </p>

          <!-- Mint -->
          <q-btn
            v-if="userAddress && (!isRainbowPeriod || isOnRainbowList)"
            @click="mint"
            :label="$t('Mint NFT')"
            color="primary"
          />
          <!-- Connect Wallet -->
          <LogIn v-if="!userAddress" :label="$t('Connect Wallet')" />
        </div>
      </div>
    </div>

    <q-separator class="q-my-lg" />

    <!-- Split -->

    <div class="row q-col-gutter-xl">
      <!-- Project Split -->
      <div class="page-col col q-col-6">
        <p class="text-subtitle">
          {{ $t("Project Split") }}
        </p>
        <p>{{ $t("Primary Split Caption") }}</p>
        <ProjectSplit :project="project" />
      </div>

      <!-- Secondary Split -->
      <div class="page-col col q-col-6">
        <p class="text-subtitle">
          {{ $t("Secondary Split") }}
        </p>
        <p>{{ $t("Secondary Split Caption") }}</p>
        <SecondarySplit :project="project" />
      </div>
    </div>

    <router-view
      v-if="userAddress && project.numMintsBought < project.numMints"
      :projectID="projectID"
      :model-value="true"
      no-route-dismiss
      @hide="$router.back()"
    />
  </q-page>
</template>

<style lang="scss">
.page-project-mint {
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
import {
  defineComponent,
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
} from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import { Loading, useQuasar } from "quasar";

import LogIn from "../components/LogIn";
import ProjectInfo from "../components/ProjectInfo";
import ProjectSplit from "../components/ProjectSplit";
import SecondarySplit from "../components/SecondarySplit";
import RelativeTime from "../components/RelativeTime";

import Moralis from "moralis";
import SharedFunding from "../../contracts/deployments/rinkeby/SharedFunding.json";

export default defineComponent({
  name: "PageProjectView",

  props: ["projectID"],

  components: {
    LogIn,
    ProjectInfo,
    ProjectSplit,
    SecondarySplit,
    RelativeTime,
  },

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

    // Web3
    const userAddress = computed(() => store.state.web3.userAddress);
    const ethers = Moralis.web3Library;
    let sharedFundingClone;

    const minted = ref(null);
    const mintedOn = ref(null);
    const isRainbowPeriod = ref(false);
    const isOnRainbowList = computed(() => {
      return (
        userAddress.value &&
        project.value &&
        project.value.rainbowAddresses.includes(userAddress.value.toLowerCase())
      );
    });
    const rainbowExpiration = ref(null);

    const getMinted = async () => {
      minted.value = sharedFundingClone
        ? (await sharedFundingClone.callStatic.getMintedTokens()).toNumber()
        : null;
    };

    const mint = () => {
      router.push({ name: "project-mint" });
    };

    // Initialize
    onMounted(async () => {
      const provider = ethers.getDefaultProvider(process.env.chain);
      if (!project.value) {
        try {
          Loading.show();
          await store.dispatch("getProject", props.projectID);
        } catch (error) {
          console.error(error);
          notifyError(error.error || error);
        }
      }

      // Shared Funding Clone
      if (project.value.sharedFundingCloneAddress) {
        sharedFundingClone = new ethers.Contract(
          project.value.sharedFundingCloneAddress,
          SharedFunding.abi,
          provider
        );
        getMinted();
      }

      minted.value = project.value.numMintsBought;
      mintedOn.value = project.value.deployTimeInMS;

      // Rainbow Period
      const now = new Date().getTime();
      rainbowExpiration.value = new Date(
        mintedOn.value + project.value.rainbowDurationInMS
      );
      isRainbowPeriod.value = rainbowExpiration.value > now;
      if (isRainbowPeriod.value) {
        setTimeout(() => {
          isRainbowPeriod.value = false;
        }, rainbowExpiration.value - now);
      }
      Loading.hide();
    });

    onBeforeUnmount(() => {
      Loading.hide();
    });

    return {
      doubleColumn,
      project,
      backgroundImage,
      userAddress,
      mint,
      minted,
      rainbowExpiration,
      isRainbowPeriod,
      isOnRainbowList,
    };
  },
});
</script>
