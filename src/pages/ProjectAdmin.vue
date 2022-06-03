<template>
  <q-page class="page-project-admin">
    <div v-if="userAddress" class="q-layout-padding page-col col">
      <!-- Title -->
      <div class="text-h4 q-ma-md">
        {{ $t("Project Administration") }}
      </div>

      <q-list>
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
            <q-input
              v-model="courtesyMintAmount"
              :label="'Qty'"
              :rules="[Boolean]"
              type="number"
              :min="1"
              :max="20"
              hide-bottom-space
            />
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
        <q-item-label header>Pause/Unpause Minting</q-item-label>
        <q-item>
          <q-btn
            @click="togglePause"
            :label="isPaused ? 'Unpause' : 'Pause'"
            :loading="isLoading || isPausing"
            color="primary"
          />
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
import { LocalStorage } from "quasar";

import { notifyError, notifySuccess } from "../util/notify";
import LogIn from "../components/LogIn";
import AddrInput from "../components/AddrInput";

import { pickBy } from "lodash";

import Moralis from "moralis";
import ChangeDaoNFT from "../../contracts/deployments/rinkeby/ChangeDaoNFT.json";
import SharedFunding from "../../contracts/deployments/rinkeby/SharedFunding.json";

export default {
  name: "PageProjectAdmin",

  components: { LogIn, AddrInput },

  props: ["projectID"],

  setup(props) {
    const { t } = useI18n({ useScope: "global" });
    const router = useRouter();
    const store = useStore();

    const ethers = Moralis.web3Library;
    window.ethers = ethers;
    const provider = ethers.getDefaultProvider(process.env.chain);

    // Shared Funding Clone
    const sharedFundingClone = new ethers.Contract(
      props.projectID,
      SharedFunding.abi,
      provider
    );

    // ChangeDAO NFT
    const data2 = LocalStorage.getItem("projectPart2");
    const changeDaoNFTClone = new ethers.Contract(
      data2._changeDaoNFTClone,
      ChangeDaoNFT.abi,
      provider
    );

    const userAddress = computed(() => store.state.web3.userAddress);

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
      hasZeroMinted.value = await sharedFundingClone.callStatic.hasZeroMinted();

      const rainbowExpiration = await sharedFundingClone.callStatic.getRainbowExpiration();
      isRainbowPeriod.value =
        parseInt(rainbowExpiration.toString(), 10) > new Date() / 1000;

      isPaused.value = await sharedFundingClone.callStatic.paused();
      isLoading.value = false;
    });

    return {
      isLoading,
      userAddress,
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
