<template>
  <q-page class="page-project-admin">
    <div v-if="userAddress" class="q-layout-padding page-col col">
      <!-- Title -->
      <div class="text-h4 q-ma-md">
        {{ $t("Project Claims") }}
      </div>

      <q-list>
        <!-- Claim -->
        <q-item-label header>Available</q-item-label>
        <q-item>
          <q-item-section>
            <q-item-label caption>ETH</q-item-label>
            <q-item-label>
              <q-skeleton v-if="isLoading" type="text" width="3em" />
              <template v-else>{{ availableETH }}</template>
            </q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label caption>DAI</q-item-label>
            <q-item-label>
              <q-skeleton v-if="isLoading" type="text" width="3em" />
              <template v-else>{{ $n(availableDAI, "USD") }}</template>
            </q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label caption>USDC</q-item-label>
            <q-item-label>
              <q-skeleton v-if="isLoading" type="text" width="3em" />
              <template v-else>{{ $n(availableUSDC, "USD") }}</template>
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn
              @click="claim"
              :label="$t('Claim')"
              :loading="isLoading || isClaiming"
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
import { LocalStorage } from "quasar";

import { notifyError, notifySuccess } from "../util/notify";
import LogIn from "../components/LogIn";

import { pickBy } from "lodash";

import Moralis from "moralis";
import ChangeDaoNFT from "../../contracts/deployments/rinkeby/ChangeDaoNFT.json";
import SharedFunding from "../../contracts/deployments/rinkeby/SharedFunding.json";
import PaymentSplitter from "../../contracts/deployments/rinkeby/PaymentSplitter.json";

import { DAI_ADDRESS, USDC_ADDRESS } from "../util/constants";

export default {
  name: "ProjectClaims",

  components: { LogIn },

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
    let paymentSplitterClone;

    const userAddress = computed(() => store.state.web3.userAddress);

    const isClaiming = ref(false);
    const claim = async () => {
      try {
        isClaiming.value = true;
        const tx = await Moralis.executeFunction({
          contractAddress: fundingPSCloneAddress,
          abi: PaymentSplitter.abi,
          functionName: "releaseAll",
          params: {
            _account: userAddress.value
          }
        });
        const response = await tx.wait();
        getAvailable();
        notifySuccess("Success");
      } catch (error) {
        console.error(error);
        notifyError(error.error || error);
      } finally {
        isClaiming.value = false;
      }
    };

    const hasZeroMinted = ref(false);
    const isRainbowPeriod = ref(false);
    const isLoading = ref(true);
    const isPaused = ref(false);
    const availableETH = ref(0);
    const availableDAI = ref(0);
    const availableUSDC = ref(0);
    let fundingPSCloneAddress = null;

    const getAvailable = async () => {
      let eth = await paymentSplitterClone.functions.pendingETHPayment(
        userAddress.value
      );
      eth = eth[0];
      availableETH.value = ethers.utils.formatEther(eth);

      let dai = await paymentSplitterClone.functions.pendingERC20Payment(
        DAI_ADDRESS,
        userAddress.value
      );
      dai = dai[0];
      availableDAI.value = parseInt(ethers.utils.formatUnits(dai, 18), 10);

      let usdc = await paymentSplitterClone.functions.pendingERC20Payment(
        USDC_ADDRESS,
        userAddress.value
      );
      usdc = usdc[0];
      availableUSDC.value = parseInt(ethers.utils.formatUnits(usdc, 6), 10);
    };

    onMounted(async () => {
      fundingPSCloneAddress = await sharedFundingClone.callStatic.fundingPSClone();

      // Payment Splitter Clone
      paymentSplitterClone = new ethers.Contract(
        fundingPSCloneAddress,
        PaymentSplitter.abi,
        provider
      );

      window.paymentSplitterClone = paymentSplitterClone;

      getAvailable();

      isLoading.value = false;
    });

    return {
      isLoading,
      userAddress,
      availableETH,
      availableDAI,
      availableUSDC,
      isClaiming,
      claim
    };
  }
};
</script>
