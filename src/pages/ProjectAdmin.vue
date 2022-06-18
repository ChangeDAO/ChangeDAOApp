<template>
  <q-page v-if="!isPending" class="page-project-admin">
    <div
      v-if="
        userAddress && project && userAddress === project.createdByWalletAddress
      "
      class="q-layout-padding page-col col"
    >
      <!-- Title -->
      <div class="text-h4 q-ma-md">
        {{ $t("Project Administration") }}
      </div>
      <div class="text-h5 q-ma-md">
        <template v-if="project">
          <router-link :to="{ name: 'project-view' }">
            {{ project.name }}
          </router-link>
        </template>
        <q-skeleton v-else type="text" width="15em" />
        <p v-if="!isPending" class="text-caption">
          {{ $tc("n Mints Remaining", mintable - minted) }}
        </p>
      </div>

      <q-list v-if="!isPending">
        <!-- Base URI -->
        <!-- <q-input v-model="baseURI" label="Base URI" item-aligned>
          <template v-slot:after>
            <q-btn
              @click="setBaseURI"
              label="Set"
              color="primary"
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

        <!-- Zero Mint -->
        <q-item-label header>Zero Mint</q-item-label>
        <q-item v-if="hasZeroMinted">
          <q-item-section>
            <q-item-label> Zero Mint has already been made </q-item-label>
          </q-item-section>
        </q-item>
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

        <template v-if="mintable > minted">
          <!-- Courtesy Mint -->
          <q-item-label header>
            {{ $t("Courtesy Mint") }}
            <div v-if="isRainbowPeriod" class="text-caption">
              <RelativeTime
                before="Rainbow period ends"
                :value="rainbowExpiration"
                text-only
              />
            </div>
          </q-item-label>
          <q-item v-if="!isRainbowPeriod">
            <q-item-section>
              <q-item-label>{{ $t("Rainbow period ended") }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-else>
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
                :loading="isMintingCourtesy"
              />
            </q-item-section>
          </q-item>

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
        </template>
      </q-list>
    </div>
  </q-page>
  <q-page class="flex flex-center text-center pre-line" v-else>
    <q-inner-loading
      :showing="isPending"
      :label="$t('Project has pending changes')"
    />
  </q-page>
</template>

<script>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import { Loading } from "quasar";

import { TX_WAIT } from "../util/constants";
import {
  notifyError,
  notifySuccess,
  notifyTx,
  listenPending,
} from "../util/notify";
import AddrInput from "../components/AddrInput";
import RelativeTime from "../components/RelativeTime";

import Moralis from "moralis";
import ChangeDaoNFT from "../../contracts/deployments/rinkeby/ChangeDaoNFT.json";
import SharedFunding from "../../contracts/deployments/rinkeby/SharedFunding.json";

export default {
  name: "PageProjectAdmin",

  components: { AddrInput, RelativeTime },

  props: ["projectID"],

  setup(props) {
    const store = useStore();

    const ethers = Moralis.web3Library;

    const project = ref(null);

    let sharedFundingClone;
    let changeDaoNFTClone;

    const userAddress = computed(() => store.state.web3.userAddress);

    const baseURI = ref("");
    const isSettingBaseURI = ref(false);
    const setBaseURI = async () => {
      try {
        isSettingBaseURI.value = true;
        const tx = await Moralis.executeFunction({
          contractAddress: changeDaoNFTClone.address,
          abi: ChangeDaoNFT.abi,
          functionName: "setBaseURI",
          params: { _newBaseURI: baseURI.value },
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
        const response = await Moralis.Cloud.run("getProject", {
          projectId: props.projectID,
        });

        project.value = response.project;
      } catch (error) {
        console.error(error);
        notifyError(error.error || error);
      }

      // Abort if project not loaded
      if (!project.value) {
        isLoading.value = false;
        return notifyError("loadingProject");
      }

      baseURI.value = project.value.baseURI;
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

        // hasZeroMinted.value = project.value.isZeroMintMinted;
        hasZeroMinted.value =
          await sharedFundingClone.callStatic.hasZeroMinted();

        isPaused.value = await sharedFundingClone.callStatic.paused();
      } else {
        isPending.value = true;
      }

      // ChangeDAO NFT
      if (project.value.sharedFundingCloneAddress) {
        changeDaoNFTClone = new ethers.Contract(
          project.value.ethAddress,
          ChangeDaoNFT.abi,
          provider
        );
      } else {
        isPending.value = true;
      }

      if (isPending.value) {
        let result = await listenPending({
          params: {
            entityType: "Project",
            entityId: props.projectID,
          },
          onDeletion(change) {
            console.log("Deleted", change);
            delete pendingChanges[change.entityId];
            if (Object.keys(pendingChanges).length === 0) {
              console.log("Finished");
              init();
            } else {
              console.log(pendingChanges, Object.keys(pendingChanges).length);
            }
          },
        });
        subscription = result.subscription;
        pendingChanges = result.initialPendingChanges;
        console.log("Initial Pending Changes", pendingChanges);
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
      project,
      isLoading,
      userAddress,
      baseURI,
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
      isPaused,
      isPausing,
      togglePause,
    };
  },
};
</script>
