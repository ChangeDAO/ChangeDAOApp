<template>
  <q-page class="page-project-admin">
    <div v-if="userAddress" class="q-layout-padding page-col col">
      <!-- Title -->
      <div class="text-h4 q-ma-md">
        {{ $t("Project Administration") }}
      </div>
      <div class="text-h5 q-ma-md">
        <template v-if="project">
          {{ project.name }}
        </template>
        <q-skeleton v-else type="text" width="15em" />
      </div>

      <q-list>
        <!-- Base URI -->
        <q-input v-model="baseURI" label="Base URI" item-aligned>
          <template v-slot:after>
            <q-btn
              @click="setBaseURI"
              label="Set"
              color="primary"
              :loading="isSettingBaseURI"
            />
          </template>
        </q-input>

        <!-- Rainbow Period -->
        <q-input
          type="number"
          v-model="rainbowDuration"
          :label="'Rainbow Period Duration (hours)'"
          :rules="[a => a >= 0]"
          :min="0"
          item-aligned
        >
          <template v-slot:append v-if="remaingRainbow">
            <RelativeTime :value="remaingRainbow" />
          </template>
          <template v-slot:after>
            <q-btn
              @click="setRainbowDuration"
              label="Set"
              color="primary"
              :disable="
                isLoading ||
                  (!rainbowDuration && rainbowDuration !== 0) ||
                  rainbowDuration < 0
              "
              :loading="isSettingRainbowDuration"
            />
          </template>
        </q-input>

        <!-- Zero Mint -->
        <q-item-label header>Zero Mint</q-item-label>
        <q-item v-if="hasZeroMinted">
          <q-item-section>
            <q-item-label>
              Zero Mint has already been made
            </q-item-label>
          </q-item-section>
        </q-item>
        <AddrInput
          v-else
          v-model="zeroMintAddress"
          label="Recipient Address"
          :disable="isLoading"
          item-aligned
        >
          <template v-slot:after>
            <q-btn
              @click="zeroMint"
              :label="$t('Mint')"
              color="primary"
              :loading="isMintingZero"
              :disable="isLoading"
            />
          </template>
        </AddrInput>

        <!-- Courtesy Mint -->
        <q-item-label header>Courtesy Mint</q-item-label>
        <q-item v-if="!isRainbowPeriod">
          <q-item-section>
            <q-skeleton type="text" v-if="isLoading" width="15em" />
            <q-item-label v-else>
              The Rainbow Period has ended
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-else>
          <q-item-section>
            <AddrInput
              v-model="courtesyMintAddress"
              label="Recipient Address"
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
                :max="20"
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
              :loading="isLoading || isPausing"
              color="primary"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    <div v-else class="q-layout-padding">
      <LogIn />
    </div>
  </q-page>
</template>

<script>
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

import { notifyError, notifySuccess } from "../util/notify";
import LogIn from "../components/LogIn";
import AddrInput from "../components/AddrInput";
import RelativeTime from "../components/RelativeTime";

import { pickBy } from "lodash";

import Moralis from "moralis";
import ChangeDaoNFT from "../../contracts/deployments/rinkeby/ChangeDaoNFT.json";
import SharedFunding from "../../contracts/deployments/rinkeby/SharedFunding.json";

export default {
  name: "PageProjectAdmin",

  components: { LogIn, AddrInput, RelativeTime },

  props: ["projectID"],

  setup(props) {
    const { t } = useI18n({ useScope: "global" });
    const router = useRouter();
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
          params: { _newBaseURI: baseURI.value }
        });
        const response = await tx.wait();
        notifySuccess("Success");
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
    const remaingRainbow = computed(() => {
      return rainbowDuration.value
        ? new Date(mintedOn.value + rainbowDuration.value * 36e5)
        : null;
    });
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
            )
          }
        });
        const response = await tx.wait();
        notifySuccess("Success");
      } catch (error) {
        console.error(error);
        notifyError(error.error || error);
      } finally {
        isSettingRainbowDuration.value = false;
      }
    };

    const zeroMintAddress = ref(userAddress.value);
    const isMintingZero = ref(false);
    const zeroMint = async () => {
      try {
        isMintingZero.value = true;
        const tx = await Moralis.executeFunction({
          contractAddress: sharedFundingClone.address,
          abi: SharedFunding.abi,
          functionName: "zeroMint",
          params: { _recipient: zeroMintAddress.value }
        });

        // Call Cloud Function
        await Moralis.Cloud.run("zeroMint", {
          projectId: props.projectID,
          recipientAddress: zeroMintAddress.value,
          transactionHash: tx.hash
        });

        const response = await tx.wait();
        hasZeroMinted.value = true;
        notifySuccess("Success");
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
            _mintAmount: courtesyMintAmount.value
          }
        });

        // Call Cloud Function
        await Moralis.Cloud.run("courtesyMint", {
          projectId: props.projectID,
          recipientAddress: courtesyMintAddress.value,
          numMints: courtesyMintAmount.value,
          transactionHash: tx.hash
        });

        const response = await tx.wait();
        notifySuccess("Success");
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
          functionName: isPaused.value ? "unPause" : "pause"
        });
        const response = await tx.wait();
        isPaused.value = !isPaused.value;
        notifySuccess("Success");
      } catch (error) {
        console.error(error);
        notifyError(error.error || error);
      } finally {
        isPausing.value = false;
      }
    };

    const hasZeroMinted = ref(false);
    const isRainbowPeriod = ref(false);
    const isLoading = ref(true);
    const isPaused = ref(false);

    onMounted(async () => {
      const provider = ethers.getDefaultProvider(process.env.chain);
      try {
        const response = await Moralis.Cloud.run("getProject", {
          projectId: props.projectID
        });

        project.value = response.project;
      } catch (error) {
        console.error(error);
        notifyError(error.error || error);
      }

      // Shared Funding Clone
      sharedFundingClone = new ethers.Contract(
        project.value.sharedFundingCloneAddress,
        SharedFunding.abi,
        provider
      );

      // ChangeDAO NFT
      changeDaoNFTClone = new ethers.Contract(
        project.value.ethAddress,
        ChangeDaoNFT.abi,
        provider
      );

      baseURI.value = project.value.baseURI;

      mintedOn.value = project.value.deployTimeInMS;

      rainbowDuration.value = Math.round(
        project.value.rainbowDurationInMS / 36e5
      );

      hasZeroMinted.value = project.value.isZeroMintMinted;

      const rainbowExpiration =
        mintedOn.value + project.value.rainbowDurationInMS;
      isRainbowPeriod.value = rainbowExpiration > new Date().getTime();

      isPaused.value = await sharedFundingClone.callStatic.paused();
      isLoading.value = false;
    });

    return {
      project,
      isLoading,
      userAddress,
      baseURI,
      setBaseURI,
      isSettingBaseURI,
      rainbowDuration,
      remaingRainbow,
      isSettingRainbowDuration,
      setRainbowDuration,
      hasZeroMinted,
      zeroMintAddress,
      zeroMint,
      isMintingZero,
      courtesyMintAddress,
      courtesyMintAmount,
      isRainbowPeriod,
      courtesyMint,
      isMintingCourtesy,
      isPaused,
      isPausing,
      togglePause
    };
  }
};
</script>
