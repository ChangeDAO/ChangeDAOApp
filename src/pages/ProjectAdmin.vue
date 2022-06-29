<template>
  <q-page
    v-if="!isPending"
    class="page-project-admin"
    :class="{ doubleColumn }"
    padding
  >
    <LogInDialog
      v-if="project && !isOwner"
      icon="lock"
      :subtitle="$t('error.notAdmin')"
    />
    <div
      v-else-if="project"
      class="row"
      :class="{ 'q-col-gutter-xl': doubleColumn }"
    >
      <!-- Project Info -->
      <div class="page-col col">
        <div class="q-mb-md">
          <q-img
            :src="project.coverImageUrl"
            ratio="1"
            class="project-cover"
            :class="{ 'no-image': !project.coverImageUrl }"
          />
        </div>
        <ProjectInfo :project="project" />
      </div>

      <!-- Admin Actions -->
      <div class="page-col col">
        <!-- Title -->
        <div class="text-h4 q-my-md">
          {{ $t("Project Administration") }}
        </div>
        <div class="text-h6 q-my-md">
          <template v-if="project">
            <router-link :to="{ name: 'project-view' }">
              {{ $t("View Project Page") }}
            </router-link>
          </template>
          <q-skeleton v-else type="text" width="15em" />
          <p v-if="!isPending" class="text-caption">
            {{ $tc("n Mints Remaining", mintable - minted) }}
          </p>
        </div>

        <q-list v-if="!isPending" bordered>
          <!-- Pause/Unpause -->
          <q-item>
            <q-item-section>
              <q-item-label header class="q-pl-none">
                Pause/Unpause Minting
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn
                @click="togglePause"
                :label="isPaused ? 'Unpause' : 'Pause'"
                :loading="isPausing"
                color="primary"
              />
            </q-item-section>
          </q-item>

          <!-- Base URI -->
          <!-- <q-input
            v-model="baseURI"
            label="Content Identifier"
            prefix="ipfs://"
            suffix="/"
            :placeholder="project.baseURI"
            :rules="[validCid]"
            hide-bottom-space
            item-aligned
          >
            <template v-slot:after>
              <q-btn
                @click="setBaseURI"
                label="Set"
                color="primary"
                :disable="
                  !baseURI.trim().length ||
                  !validCid(baseURI) ||
                  baseURI === project.baseURI
                "
                :loading="isSettingBaseURI"
              />
            </template>
          </q-input> -->

          <!-- Rainbow Period -->
          <!-- <q-input
            type="number"
            v-model="rainbowDuration"
            :label="'Rainbow Period Duration (hours)'"
            :rules="[(a) => a >= 0]"
            :min="0"
            item-aligned
          >
            <template v-slot:append v-if="isRainbowPeriod">
              <RelativeTime :value="rainbowExpiration" />
            </template>
            <template v-slot:after>
              <q-btn
                @click="setRainbowDuration"
                label="Set"
                color="primary"
                :disable="
                  (!rainbowDuration && rainbowDuration !== 0) ||
                  rainbowDuration < 0
                "
                :loading="isSettingRainbowDuration"
              />
            </template>
          </q-input> -->

          <template v-if="mintable > minted">
            <!-- Courtesy Mint -->
            <template v-if="isRainbowPeriod">
              <q-item-label header>
                {{ $t("Courtesy Mint") }}
                <div class="text-caption">
                  <RelativeTime
                    before="Rainbow period ends"
                    :value="rainbowExpiration"
                    text-only
                  />
                </div>
              </q-item-label>

              <q-item>
                <q-item-section>
                  <AddrInput
                    v-model="courtesyMintAddress"
                    label="Recipient Address"
                    hide-bottom-space
                  />
                </q-item-section>
                <q-item-section side>
                  <q-item-label>
                    <q-input
                      v-model="courtesyMintAmount"
                      :label="'Qty'"
                      :rules="[Boolean]"
                      type="number"
                      :min="1"
                      :max="Math.min(20, mintable - minted)"
                      hide-bottom-space
                    />
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn
                    @click="courtesyMint"
                    :label="$t('Mint')"
                    color="primary"
                    :disable="!isAddress(courtesyMintAddress)"
                    :loading="isMintingCourtesy"
                  />
                </q-item-section>
              </q-item>
            </template>
          </template>

          <!-- Zero Mint -->
          <q-item-label header>Zero Mint</q-item-label>
          <TokenCarousel
            v-if="hasZeroMinted"
            :baseURI="project.baseURI"
            :tokenIds="['0']"
          />
          <AddrInput
            v-else
            v-model="zeroMintAddress"
            label="Recipient Address"
            item-aligned
          >
            <template v-slot:after>
              <q-btn
                @click="zeroMint"
                :label="$t('Mint')"
                color="primary"
                :loading="isMintingZero"
                :disable="!isAddress(zeroMintAddress)"
              />
            </template>
          </AddrInput>
        </q-list>
      </div>
    </div>
  </q-page>
  <q-page class="flex flex-center text-center pre-line non-selectable" v-else>
    <q-inner-loading
      :showing="isPending"
      :label="$t('Project has pending changes')"
    />
  </q-page>
</template>

<script>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import { Loading, useQuasar } from "quasar";

import { TX_WAIT } from "../util/constants";
import { CID_FORMAT } from "../util/formatting";
import {
  notifyError,
  notifySuccess,
  notifyTx,
  listenPending,
} from "../util/notify";
import LogInDialog from "../components/LogInDialog";
import AddrInput from "../components/AddrInput";
import ProjectInfo from "../components/ProjectInfo";
import RelativeTime from "../components/RelativeTime";
import TokenCarousel from "../components/TokenCarousel";

import Moralis from "moralis";
import ChangeDaoNFT from "../../contracts/deployments/rinkeby/ChangeDaoNFT.json";
import SharedFunding from "../../contracts/deployments/rinkeby/SharedFunding.json";

export default {
  name: "PageProjectAdmin",

  components: {
    LogInDialog,
    AddrInput,
    ProjectInfo,
    RelativeTime,
    TokenCarousel,
  },

  props: ["projectID"],

  setup(props) {
    const store = useStore();
    const $q = useQuasar();

    const doubleColumn = computed(() => $q.screen.width > 584);

    const ethers = Moralis.web3Library;

    const project = computed(() => store.state.projects[props.projectID]);

    let sharedFundingClone;
    let changeDaoNFTClone;

    const userAddress = computed(() => store.state.web3.userAddress);
    watch(userAddress, () => {
      if (!isLoading.value) {
        init();
      }
    });

    const isOwner = computed(
      () =>
        project.value &&
        userAddress.value === project.value.createdByWalletAddress
    );

    const baseURI = ref("");
    const isSettingBaseURI = ref(false);
    const validCid = (a) => CID_FORMAT.test(a);
    const setBaseURI = async () => {
      try {
        isSettingBaseURI.value = true;
        const tx = await Moralis.executeFunction({
          contractAddress: changeDaoNFTClone.address,
          abi: ChangeDaoNFT.abi,
          functionName: "setBaseURI",
          params: { _newBaseURI: `ipfs://${baseURI.value}/` },
        });
        let dismiss = notifyTx(tx.hash);
        const response = await tx.wait(TX_WAIT);
        notifySuccess("TxComplete");
        dismiss();
      } catch (error) {
        console.error(error);
        notifyError(error.error || error);
      } finally {
        isSettingBaseURI.value = false;
      }
    };

    const rainbowDuration = ref(null);
    const isSettingRainbowDuration = ref(false);
    const mintedOn = ref(null);
    const setRainbowDuration = async () => {
      try {
        isSettingRainbowDuration.value = true;
        const tx = await Moralis.executeFunction({
          contractAddress: sharedFundingClone.address,
          abi: SharedFunding.abi,
          functionName: "setRainbowDuration",
          params: {
            _rainbowDuration: ethers.BigNumber.from(
              (rainbowDuration.value * 3600).toString()
            ),
          },
        });
        let dismiss = notifyTx(tx.hash);
        const response = await tx.wait(TX_WAIT);
        notifySuccess("TxComplete");
        dismiss();
      } catch (error) {
        console.error(error);
        notifyError(error.error || error);
      } finally {
        isSettingRainbowDuration.value = false;
      }
    };

    const zeroMintAddress = ref(userAddress.value);
    const isAddress = Moralis.web3Library.utils.isAddress;
    const isMintingZero = ref(false);
    const zeroMint = async () => {
      try {
        isMintingZero.value = true;
        const tx = await Moralis.executeFunction({
          contractAddress: sharedFundingClone.address,
          abi: SharedFunding.abi,
          functionName: "zeroMint",
          params: { _recipient: zeroMintAddress.value },
        });
        let dismiss = notifyTx(tx.hash);

        // Call Cloud Function
        await Moralis.Cloud.run("zeroMint", {
          projectId: props.projectID,
          recipientAddress: zeroMintAddress.value,
          transactionHash: tx.hash,
        });

        const response = await tx.wait(TX_WAIT);
        hasZeroMinted.value = true;
        notifySuccess("TxComplete");
        dismiss();
        getMinted();
      } catch (error) {
        console.error(error);
        notifyError(error.error || error);
      } finally {
        isMintingZero.value = false;
      }
    };

    const courtesyMintAddress = ref("");
    const courtesyMintAmount = ref(1);
    const isMintingCourtesy = ref(false);
    const courtesyMint = async () => {
      try {
        isMintingCourtesy.value = true;
        const tx = await Moralis.executeFunction({
          contractAddress: sharedFundingClone.address,
          abi: SharedFunding.abi,
          functionName: "courtesyMint",
          params: {
            _recipient: courtesyMintAddress.value,
            _mintAmount: courtesyMintAmount.value,
          },
        });
        let dismiss = notifyTx(tx.hash);

        // Call Cloud Function
        await Moralis.Cloud.run("courtesyMint", {
          projectId: props.projectID,
          recipientAddress: courtesyMintAddress.value,
          numMints: parseInt(courtesyMintAmount.value, 10),
          transactionHash: tx.hash,
        });

        const response = await tx.wait(TX_WAIT);
        notifySuccess("TxComplete");
        dismiss();
        getMinted();
      } catch (error) {
        console.error(error);
        notifyError(error.error || error);
      } finally {
        isMintingCourtesy.value = false;
      }
    };

    const isPausing = ref(false);
    const togglePause = async () => {
      try {
        isPausing.value = true;
        const tx = await Moralis.executeFunction({
          contractAddress: sharedFundingClone.address,
          abi: SharedFunding.abi,
          functionName: isPaused.value ? "unPause" : "pause",
        });
        let dismiss = notifyTx(tx.hash);
        const response = await tx.wait(TX_WAIT);
        isPaused.value = !isPaused.value;
        notifySuccess("TxComplete");
        dismiss();
      } catch (error) {
        console.error(error);
        notifyError(error.error || error);
      } finally {
        isPausing.value = false;
      }
    };

    const isLoading = ref(true);
    watch(isLoading, (isLoading) => {
      if (isLoading) {
        Loading.show();
      } else {
        Loading.hide();
      }
    });
    Loading.show();

    const hasZeroMinted = ref(false);
    const isRainbowPeriod = ref(false);
    const rainbowExpiration = ref(null);
    const isPaused = ref(false);
    const minted = ref(null);
    const mintable = ref(null);

    const getMinted = async () => {
      return (minted.value = (
        await sharedFundingClone.callStatic.getMintedTokens()
      ).toNumber());
    };

    const isPending = ref(false);
    let subscription = null;
    let pendingChanges = {};

    const init = async () => {
      const provider = ethers.getDefaultProvider(process.env.chain);
      try {
        await store.dispatch("getProject", props.projectID);
      } catch (error) {
        console.error(error);
        notifyError(error.error || error);
      }

      // Abort if project not loaded
      if (!project.value || !isOwner.value) {
        isLoading.value = false;
        return project.value || notifyError("loadingProject");
      }

      mintedOn.value = project.value.deployTimeInMS;
      mintable.value = project.value.numMints;

      // Rainbow Period
      const now = new Date().getTime();
      rainbowExpiration.value = new Date(
        mintedOn.value + project.value.rainbowDurationInMS
      );
      isRainbowPeriod.value = rainbowExpiration.value > now;
      rainbowDuration.value = Math.round(
        project.value.rainbowDurationInMS / 36e5
      );
      if (isRainbowPeriod.value) {
        setTimeout(() => {
          isRainbowPeriod.value = false;
        }, rainbowExpiration.value - now);
      }

      // Shared Funding Clone
      if (project.value.sharedFundingCloneAddress) {
        sharedFundingClone = new ethers.Contract(
          project.value.sharedFundingCloneAddress,
          SharedFunding.abi,
          provider
        );
        await getMinted();

        hasZeroMinted.value = project.value.isZeroMintMinted;
        if (!hasZeroMinted.value) {
          hasZeroMinted.value =
            await sharedFundingClone.callStatic.hasZeroMinted();
        }

        isPaused.value = project.value.isPaused;
        isPaused.value = await sharedFundingClone.callStatic.paused();
      }

      // ChangeDAO NFT
      if (project.value.sharedFundingCloneAddress) {
        changeDaoNFTClone = new ethers.Contract(
          project.value.ethAddress,
          ChangeDaoNFT.abi,
          provider
        );
      }

      isPending.value = project.value.creationStatus === "pending";
      if (isPending.value) {
        let result = await listenPending({
          params: {
            entityType: "Project",
            entityId: props.projectID,
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
              init();
            }
          },
        });
        subscription = result.subscription;
        pendingChanges = result.initialPendingChanges;
        console.info("Initial pending changes", pendingChanges);
      }

      isLoading.value = false;
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

    return {
      doubleColumn,
      project,
      isLoading,
      userAddress,
      baseURI,
      validCid,
      setBaseURI,
      isSettingBaseURI,
      rainbowDuration,
      rainbowExpiration,
      isSettingRainbowDuration,
      setRainbowDuration,
      hasZeroMinted,
      zeroMintAddress,
      isAddress,
      zeroMint,
      minted,
      mintable,
      isMintingZero,
      courtesyMintAddress,
      courtesyMintAmount,
      isRainbowPeriod,
      courtesyMint,
      isPending,
      isMintingCourtesy,
      isOwner,
      isPaused,
      isPausing,
      togglePause,
    };
  },
};
</script>
