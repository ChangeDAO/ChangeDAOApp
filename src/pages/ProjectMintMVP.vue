<template>
  <q-page class="page-project-mint">
    <div v-if="!isLoading && userAddress" class="q-layout-padding page-col col">
      <div class="q-gutter-lg">
        <!-- Title -->
        <div class="text-h4 q-my-md">
          {{ isRainbowPeriod ? "Rainbow Mint" : $t("Mint NFT") }}
          <div v-if="isRainbowPeriod" class="text-caption">
            <RelativeTime before="ends" :value="rainbowExpiration" text-only />
          </div>
        </div>
        <div class="text-h5 q-my-md">
          <template v-if="project">
            {{ project.name }}
            <q-btn
              v-if="project.createdByWalletAddress === userAddress"
              :to="{ name: 'project-admin' }"
              color="primary"
              icon="admin"
              round
              flat
            />
          </template>
          <q-skeleton v-else type="text" width="15em" />
        </div>

        <div v-if="mintable <= minted">
          {{ $t("Minting Ended") }}
        </div>
        <template v-else-if="!isPending">
          <!-- Cost per Mint -->
          <div class="row">
            <span class="text-subtitle col-grow">{{
              $t("Cost per Mint")
            }}</span>
            <span>{{ $n(cost, "USD") }} USD</span>
          </div>

          <!-- Number of Mints -->
          <div class="row">
            <div class="q-mb-sm col-grow">
              <div class="text-subtitle">
                {{ $t("Number of Mints") }}
              </div>
              <p class="text-caption">
                {{ $tc("n Mints Remaining", mintable - minted) }}
              </p>
            </div>
            <q-input
              v-model.number="quantity"
              type="number"
              :min="1"
              :max="maxQuantity"
              :rules="[(q) => q > 0 && q <= maxQuantity]"
              :readonly="maxQuantity === 1"
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
                class="q-mt-sm"
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
            <p v-if="currencyHint" class="text-caption">
              {{ $t(currencyHint) }}
            </p>
            <p
              v-if="disabledCurrencies.length"
              class="text-caption text-italic"
            >
              {{ $t("Not enough X", { X: disabledCurrencies.join(", ") }) }}
            </p>
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
              {{
                $t(
                  isPurchasing ? "This will take time" : "This will open wallet"
                )
              }}
            </div>
          </div>
        </template>
        <div v-else>
          {{ $t("Project has pending changes") }}
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { Loading } from "quasar";

import { TX_WAIT } from "../util/constants";
import { createLeafRainbow, createMerkleProofRainbow } from "../util/merkle";
import { notifyError, notifySuccess, notifyTx } from "../util/notify";
import RelativeTime from "../components/RelativeTime";
import SmoothReflow from "../components/SmoothReflow";

import Moralis from "moralis";
import SharedFunding from "../../contracts/deployments/rinkeby/SharedFunding.json";

import {
  ETH_ADDRESS,
  DAI_ADDRESS,
  USDC_ADDRESS,
  ERC20_ABI,
} from "../util/constants";

const ETH_BUFFER = 0.01;

export default {
  name: "PageProjectMint",

  components: { RelativeTime, SmoothReflow },

  props: ["projectID"],

  setup(props) {
    const { t } = useI18n();
    const router = useRouter();
    const store = useStore();

    // Form
    const quantity = ref(1);
    const subtotal = computed(() => cost.value * quantity.value);
    const tips = computed(() => [
      { value: 0, label: t("No Tip") },
      ...(cost.value > 0
        ? [
            { value: 10, label: "10%" },
            { value: 20, label: "20%" },
            { value: 30, label: "30%" },
          ]
        : []),
      { value: "custom", label: t("Custom") },
    ]);
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
          disable: disabledCurrencies.value.includes("ETH"),
        },
        {
          value: DAI_ADDRESS,
          label: "DAI",
          disable: disabledCurrencies.value.includes("DAI"),
        },
        {
          value: USDC_ADDRESS,
          label: "USDC",
          disable: disabledCurrencies.value.includes("USDC"),
        },
      ];
    });
    const currency = ref(ETH_ADDRESS);

    const currencyHint = computed(() =>
      currency.value === ETH_ADDRESS
        ? "hint.ethBuffer"
        : [DAI_ADDRESS, USDC_ADDRESS].includes(currency.value)
        ? "hint.stablecoinApproval"
        : ""
    );

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
    const project = ref(null);
    let sharedFundingClone;

    const getDAIBalance = async () => {
      return Moralis.executeFunction({
        contractAddress: DAI_ADDRESS,
        abi: ERC20_ABI,
        functionName: "balanceOf",
        params: {
          _owner: userAddress.value,
        },
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
          _value: Moralis.Units.ETH(total.value.toString()),
        },
      });
      notifyTx(tx.hash);
      const response = await tx.wait(TX_WAIT).then(() => {
        isDAIApproved.value = true;
        notifySuccess("TxComplete");
      });
    };

    const isUSDCApproved = ref(false);
    const approveUSDC = async () => {
      const tx = await Moralis.executeFunction({
        contractAddress: USDC_ADDRESS,
        abi: ERC20_ABI,
        functionName: "approve",
        params: {
          _spender: sharedFundingClone.address,
          _value: Moralis.Units.ETH(total.value.toString()),
        },
      });
      notifyTx(tx.hash);
      const response = await tx.wait().then(() => {
        isUSDCApproved.value = true;
        notifySuccess("TxComplete");
      });
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

        const paymentType = currencies.value
          .find((c) => c.value === currency.value)
          .label.toLowerCase();

        let tx;
        if (isRainbowPeriod.value) {
          // Rainbow Mint
          tx = await Moralis.executeFunction({
            contractAddress: sharedFundingClone.address,
            abi: SharedFunding.abi,
            functionName: "fundRainbow",
            params: {
              _token: currency.value,
              _tipInUsd: ethers.utils.parseEther(tipTotal.value.toString()),
              _mintAmount: ethers.BigNumber.from(quantity.value),
              _proof: createMerkleProofRainbow(
                project.value.rainbowAddresses,
                createLeafRainbow(userAddress.value.toLowerCase())
              ),
            },
            msgValue,
          });

          // Call Cloud Function
          await Moralis.Cloud.run("rainbowMint", {
            projectId: props.projectID,
            numMints: quantity.value,
            paymentType,
            tipAmountInUsd: tipTotal.value,
            transactionHash: tx.hash,
          });
        } else {
          // Public Mint
          tx = await Moralis.executeFunction({
            contractAddress: sharedFundingClone.address,
            abi: SharedFunding.abi,
            functionName: "fundPublic",
            params: {
              _token: currency.value,
              _tipInUsd: ethers.utils.parseEther(tipTotal.value.toString()),
              _mintAmount: ethers.BigNumber.from(quantity.value),
            },
            msgValue,
          });

          // Call Cloud Function
          await Moralis.Cloud.run("publicMint", {
            projectId: props.projectID,
            numMints: quantity.value,
            paymentType,
            tipAmountInUsd: tipTotal.value,
            transactionHash: tx.hash,
          });
        }
        notifyTx(tx.hash);
        const response = await tx.wait(TX_WAIT);
        getMinted();

        notifySuccess("TxComplete");

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

    const isLoading = ref(true);
    watch(isLoading, (isLoading) => {
      if (isLoading) {
        Loading.show();
      } else {
        Loading.hide();
      }
    });
    Loading.show();

    const cost = ref(0);
    const minted = ref(null);
    const mintable = ref(null);
    const mintedOn = ref(null);
    const isRainbowPeriod = ref(false);
    const rainbowExpiration = ref(null);
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
      () =>
        quantity.value > 0 &&
        quantity.value <= maxQuantity.value &&
        currency.value
    );

    const isPending = computed(() =>
      Boolean(
        project.value &&
          project.value.pendingChanges &&
          (project.value.pendingChanges.paymentSplitters.length ||
            project.value.pendingChanges.project.length)
      )
    );

    const getMinted = async () => {
      minted.value = sharedFundingClone
        ? (await sharedFundingClone.callStatic.getMintedTokens()).toNumber()
        : null;
    };

    // Initialize
    onMounted(async () => {
      const provider = ethers.getDefaultProvider(process.env.chain);
      try {
        // project.value = await store.dispatch("getProject", props.projectID);
        const response = await Moralis.Cloud.run("getProject", {
          projectId: props.projectID,
        });

        project.value = response.project;
      } catch (error) {
        console.error(error);
        notifyError(error.error || error);
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

      cost.value = project.value.mintPriceInUsd;
      minted.value = project.value.numMintsBought;
      mintable.value = project.value.numMints;
      mintedOn.value = project.value.deployTimeInMS;
      maxMintAmountRainbow.value = project.value.numMintsRainbowCanBuy;
      maxMintAmountPublic.value = project.value.numMintsPublicCanBuy;

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
      isLoading.value = false;
    });

    return {
      project,
      isPending,
      isLoading,
      userAddress,
      cost,
      minted,
      mintable,
      isRainbowPeriod,
      rainbowExpiration,
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
      currencyHint,
      disabledCurrencies,
      isPurchasing,
      purchase,
      isValid,
    };
  },
};
</script>
