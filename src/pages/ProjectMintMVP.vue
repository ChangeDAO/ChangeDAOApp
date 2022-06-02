<template>
  <q-page class="page-project-mint">
    <div v-if="userAddress" class="q-layout-padding page-col col">
      <div class="q-gutter-lg">
        <!-- Title -->
        <div class="text-h4 q-my-md">
          {{ $t("Mint NFT") }}
        </div>

        <!-- Cost per Mint -->
        <div class="row">
          <span class="text-subtitle col-grow">{{ $t("Cost per Mint") }}</span>
          <span>{{ $n(cost, "USD") }} USD</span>
        </div>

        <!-- Number of Mints -->
        <div class="row">
          <div class="q-mb-sm col-grow">
            <div class="text-subtitle">
              {{ $t("Number of Mints") }}
            </div>
            <p class="text-caption">
              <q-skeleton v-if="isLoading" type="text" width="10em" />
              <template v-else>
                {{ $tc("n Mints Remaining", mintable - minted) }}
              </template>
            </p>
          </div>
          <q-input
            v-model.number="quantity"
            type="number"
            :min="1"
            :max="maxQuantity"
            :rules="[q => q > 0 && q <= maxQuantity]"
            dense
            outlined
          />
        </div>

        <!-- Subtotal -->
        <div class="row">
          <span class="text-subtitle col-grow">{{ $t("Subtotal") }}</span>
          <span>{{ $n(subtotal, "USD") }} USD</span>
        </div>

        <q-separator />

        <!-- Tip -->
        <div>
          <div class="text-subtitle">{{ $t("Add a Tip") }}</div>
          <div class="text-caption">{{ $t("Please and thankyou") }}</div>
          <q-option-group
            v-model="tip"
            :options="tips"
            color="primary"
            inline
          />
          <SmoothReflow>
            <q-input
              v-show="tip === 'custom'"
              v-model.number="customTip"
              type="number"
              :min="1"
              prefix="$"
              suffix="USD"
              dense
              outlined
            />
          </SmoothReflow>
        </div>
        <div class="row">
          <span class="text-subtitle col-grow">{{ $t("Tip") }}</span>
          <span>{{ $n(tipTotal, "USD") }} USD</span>
        </div>

        <q-separator />

        <!-- Total -->
        <div class="row">
          <span class="text-subtitle col-grow">{{ $t("Total") }}</span>
          <span class="text-bold">{{ $n(total, "USD") }} USD</span>
        </div>

        <q-separator />

        <!-- Currency -->
        <div>
          <div class="text-subtitle">{{ $t("Select Currency") }}</div>
          <q-option-group
            v-model="currency"
            :options="currencies"
            color="primary"
            inline
          />
          <div
            v-if="disabledCurrencies.length"
            class="text-caption text-italic"
          >
            {{ $t("Not enough X", { X: disabledCurrencies.join(", ") }) }}
          </div>
        </div>

        <q-separator />

        <!-- Purchase -->
        <div class="row reverse">
          <q-btn
            @click="purchase"
            :loading="isPurchasing"
            class="col-grow"
            :label="$t('Purchase')"
            :disable="!isValid"
            color="primary"
          />
          <div class="col-grow text-caption q-mt-sm q-mr-sm">
            {{ $t("This will open wallet") }}
          </div>
        </div>
      </div>
    </div>
    <div v-else class="q-layout-padding">
      <LogIn />
    </div>
  </q-page>
</template>

<script>
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

import { notifyError, notifySuccess } from "../util/notify";
import LogIn from "../components/LogIn";
import SmoothReflow from "../components/SmoothReflow";

import { pickBy } from "lodash";

import Moralis from "moralis";
import SharedFunding from "../../contracts/deployments/rinkeby/SharedFunding.json";

import {
  ETH_ADDRESS,
  DAI_ADDRESS,
  USDC_ADDRESS,
  ERC20_ABI
} from "../util/constants";

const ETH_BUFFER = 0.01;

export default {
  name: "PageProjectMint",

  components: { LogIn, SmoothReflow },

  props: ["projectID"],

  setup(props) {
    const { t } = useI18n();
    const router = useRouter();
    const store = useStore();

    // Form
    const quantity = ref(1);
    const subtotal = computed(() => cost.value * quantity.value);
    const tips = [
      { value: 0, label: t("No Tip") },
      { value: 10, label: "10%" },
      { value: 20, label: "20%" },
      { value: 30, label: "30%" },
      { value: "custom", label: t("Custom") }
    ];
    const tip = ref(0);
    const customTip = ref(5);
    const tipMultiplier = computed(() => {
      if (tip.value === "custom") {
        return customTip.value / 100;
      }
      return tip.value / 100;
    });
    const tipTotal = computed(() =>
      tip.value === "custom"
        ? Math.round(customTip.value)
        : Math.ceil(subtotal.value * tipMultiplier.value)
    );
    const total = computed(() => subtotal.value + tipTotal.value);
    const currencies = computed(() => {
      return [
        {
          value: ETH_ADDRESS,
          label: "ETH",
          disable: disabledCurrencies.value.includes("ETH")
        },
        {
          value: DAI_ADDRESS,
          label: "DAI",
          disable: disabledCurrencies.value.includes("DAI")
        },
        {
          value: USDC_ADDRESS,
          label: "USDC",
          disable: disabledCurrencies.value.includes("USDC")
        }
      ];
    });
    const currency = ref(ETH_ADDRESS);

    const disabledCurrencies = computed(() => {
      const output = [];
      if (balanceETH.value <= 0) {
        output.push("ETH");
      }
      if (balanceUSDC.value <= 0) {
        output.push("USDC");
      }
      if (balanceDAI.value <= 0) {
        output.push("DAI");
      }
      return output;
    });

    // Web3
    const userAddress = computed(() => store.state.web3.userAddress);
    const balances = computed(() => store.state.web3.userBalances);
    const balanceETH = computed(() => balances.value.ETH);
    const balanceUSDC = computed(() => balances.value.USDC);
    const balanceDAI = computed(() => balances.value.DAI);

    const ethers = Moralis.web3Library;
    window.ethers = ethers;
    const provider = ethers.getDefaultProvider(process.env.chain);

    // Shared Funding Clone
    const sharedFundingClone = new ethers.Contract(
      props.projectID,
      SharedFunding.abi,
      provider
    );
    window.sharedFundingClone = sharedFundingClone;

    const getDAIBalance = async () => {
      return Moralis.executeFunction({
        contractAddress: DAI_ADDRESS,
        abi: ERC20_ABI,
        functionName: "balanceOf",
        params: {
          _owner: userAddress.value
        }
      });
    };

    const isDAIApproved = ref(false);
    const approveDAI = async () => {
      const tx = await Moralis.executeFunction({
        contractAddress: DAI_ADDRESS,
        abi: ERC20_ABI,
        functionName: "approve",
        params: {
          _spender: sharedFundingClone.address,
          _value: Moralis.Units.ETH(total.value.toString())
        }
      });
      const response = await tx.wait().then(() => (isDAIApproved.value = true));
    };

    const isUSDCApproved = ref(false);
    const approveUSDC = async () => {
      const tx = await Moralis.executeFunction({
        contractAddress: USDC_ADDRESS,
        abi: ERC20_ABI,
        functionName: "approve",
        params: {
          _spender: sharedFundingClone.address,
          _value: Moralis.Units.ETH(total.value.toString())
        }
      });
      const response = await tx
        .wait()
        .then(() => (isUSDCApproved.value = true));
    };

    const isPurchasing = ref(false);
    const purchase = async () => {
      try {
        isPurchasing.value = true;

        let msgValue;
        if (currency.value === DAI_ADDRESS) {
          await approveDAI();
        } else if (currency.value === USDC_ADDRESS) {
          await approveUSDC();
        } else if (currency.value === ETH_ADDRESS) {
          // Get ETH price
          msgValue = (
            await sharedFundingClone.functions.convertUsdAmountToEth(
              ethers.utils.parseEther(total.value.toString())
            )
          )[0]
            .add(ethers.utils.parseEther(ETH_BUFFER.toString()))
            .toString();
        }

        // Public Mint
        const tx = await Moralis.executeFunction({
          contractAddress: sharedFundingClone.address,
          abi: SharedFunding.abi,
          functionName: "fundPublic",
          params: {
            _token: currency.value,
            _tipInUsd: ethers.utils.parseEther(tipTotal.value.toString()),
            _mintAmount: ethers.BigNumber.from(quantity.value)
          },
          msgValue
        });
        const response = await tx.wait();

        // router.replace({
        //   name: "mintTx",
        //   params: { txID: tx.hash }
        // });
      } catch (error) {
        console.error(error);
        notifyError(error.error || error);
      } finally {
        isPurchasing.value = false;
      }
    };

    const cost = ref(0);
    const isLoading = ref(true);
    const minted = ref(null);
    const mintable = ref(null);
    const isRainbowPeriod = ref(false);
    const maxMintAmountPublic = ref(0);
    const maxMintAmountRainbow = ref(0);
    const maxQuantity = computed(() => {
      const remaining = mintable.value - minted.value;
      const allowed = isRainbowPeriod.value
        ? maxMintAmountRainbow.value
        : maxMintAmountPublic.value;
      return Math.min(remaining, allowed);
    });

    const isValid = computed(
      () => quantity.value > 0 && quantity.value <= maxQuantity.value
    );

    // Initialize
    onMounted(async () => {
      cost.value = parseInt(
        ethers.utils.formatEther(
          await sharedFundingClone.callStatic.mintPrice()
        )
      );
      minted.value = (
        await sharedFundingClone.callStatic.getMintedTokens()
      ).toNumber();
      mintable.value = (
        await sharedFundingClone.callStatic.totalMints()
      ).toNumber();
      const mintedOn = await sharedFundingClone.callStatic.deployTime();
      const rainbowDuration = await sharedFundingClone.callStatic.rainbowDuration();
      isRainbowPeriod.value = mintedOn + rainbowDuration < new Date() / 1000;
      if (isRainbowPeriod.value) {
        // Rainbow Mint
        maxMintAmountRainbow.value = await sharedFundingClone.callStatic.maxMintAmountRainbow();
      } else {
        // Public Mint
        maxMintAmountPublic.value = await sharedFundingClone.callStatic.maxMintAmountPublic();
      }
      isLoading.value = false;
    });

    return {
      isLoading,
      userAddress,
      cost,
      minted,
      mintable,
      isRainbowPeriod,
      maxQuantity,
      quantity,
      subtotal,
      tips,
      tip,
      customTip,
      tipTotal,
      total,
      currencies,
      currency,
      disabledCurrencies,
      isPurchasing,
      purchase,
      isValid
    };
  }
};
</script>
