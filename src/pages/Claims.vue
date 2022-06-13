<template>
  <q-page class="page-project-admin">
    <div v-if="userAddress" class="q-layout-padding page-col col">
      <!-- Title -->
      <div class="text-h4 q-ma-md">
        {{ $t("Claims") }}
      </div>

      <q-list>
        <!-- Projects -->
        <q-expansion-item
          v-for="project in projects"
          :key="project.id"
          expand-separator
        >
          <template v-slot:header>
            <q-item-section avatar>
              <AddrAvatar :address="project.ethAddress" />
            </q-item-section>
            <q-item-section>
              <q-item-label>
                {{ project.name }}
              </q-item-label>
              <q-item-label caption>
                <RelativeTime
                  :value="project.paymentSplitters[0].createdAt"
                  text-only
                />
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <div class="row q-gutter-md text-caption">
                <div>
                  <q-item-label caption>ETH</q-item-label>
                  <q-item-label
                    :class="{ 'text-positive': project.total.eth > 0 }"
                  >
                    {{ $n(project.total.eth, "n6") }}
                  </q-item-label>
                </div>
                <div>
                  <q-item-label caption>DAI</q-item-label>
                  <q-item-label
                    :class="{ 'text-positive': project.total.dai > 0 }"
                  >
                    {{ $n(project.total.dai, "USD") }}
                  </q-item-label>
                </div>
                <div>
                  <q-item-label caption>USDC</q-item-label>
                  <q-item-label
                    :class="{ 'text-positive': project.total.usdc > 0 }"
                  >
                    {{ $n(project.total.usdc, "USD") }}
                  </q-item-label>
                </div>
              </div>
            </q-item-section>
          </template>

          <!-- Payment Splitters -->
          <q-item v-for="ps in project.paymentSplitters" :key="ps.id">
            <q-item-section avatar>
              <AddrAvatar :address="ps.ethAddress" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ shortAddr(ps.ethAddress) }}</q-item-label>
              <q-item-label caption>{{
                $t("psTypes." + ps.type)
              }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <!-- Balances -->
              <div class="row q-gutter-md">
                <div>
                  <q-item-label caption>ETH</q-item-label>
                  <q-item-label
                    :class="{ 'text-positive': ps.balances.eth > 0 }"
                  >
                    {{ $n(ps.balances.eth, "n6") }}
                  </q-item-label>
                </div>
                <div>
                  <q-item-label caption>DAI</q-item-label>
                  <q-item-label
                    :class="{ 'text-positive': ps.balances.dai > 0 }"
                  >
                    {{ $n(ps.balances.dai, "USD") }}
                  </q-item-label>
                </div>
                <div>
                  <q-item-label caption>USDC</q-item-label>
                  <q-item-label
                    :class="{ 'text-positive': ps.balances.usdc > 0 }"
                  >
                    {{ $n(ps.balances.usdc, "USD") }}
                  </q-item-label>
                </div>
              </div>
            </q-item-section>
            <q-item-section side>
              <q-btn
                @click="claim(ps.id, ps.ethAddress)"
                :label="$t('Claim')"
                :loading="isClaiming[ps.id]"
                color="primary"
              />
            </q-item-section>
          </q-item>
        </q-expansion-item>
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
import { Loading, LocalStorage } from "quasar";

import { TX_WAIT, DAI_ADDRESS, USDC_ADDRESS } from "../util/constants";
import { notifyError, notifySuccess } from "../util/notify";
import { shortAddr } from "../util/formatting";
import AddrAvatar from "../components/AddrAvatar";
import RelativeTime from "../components/RelativeTime";
import LogIn from "../components/LogIn";

import { pickBy } from "lodash";

import Moralis from "moralis";
import ChangeDaoNFT from "../../contracts/deployments/rinkeby/ChangeDaoNFT.json";
import SharedFunding from "../../contracts/deployments/rinkeby/SharedFunding.json";
import PaymentSplitter from "../../contracts/deployments/rinkeby/PaymentSplitter.json";

export default {
  name: "PageClaims",

  components: { AddrAvatar, RelativeTime, LogIn },

  setup(props) {
    const { t } = useI18n({ useScope: "global" });
    const router = useRouter();
    const store = useStore();

    const ethers = Moralis.web3Library;

    const userAddress = computed(() => store.state.web3.userAddress);

    const isClaiming = ref({});
    const claim = async (paymentSplitterId, contractAddress) => {
      try {
        isClaiming.value[paymentSplitterId] = true;
        const tx = await Moralis.executeFunction({
          contractAddress,
          abi: PaymentSplitter.abi,
          functionName: "releaseAll",
          params: {
            _account: userAddress.value
          }
        });

        // Call Cloud Function
        await Moralis.Cloud.run("withdrawFunds", {
          paymentSplitterId,
          transactionHash: tx.hash
        });

        const response = await tx.wait(TX_WAIT);
        getAvailable();
        notifySuccess("Success");
      } catch (error) {
        console.error(error);
        notifyError(error.error || error);
      } finally {
        isClaiming.value[paymentSplitterId] = false;
      }
    };

    const projects = ref([]);
    const hasZeroMinted = ref(false);
    const isRainbowPeriod = ref(false);
    const isPaused = ref(false);
    const availableETH = ref(0);
    const availableDAI = ref(0);
    const availableUSDC = ref(0);

    onMounted(async () => {
      if (userAddress.value) {
        Loading.show();
        try {
          projects.value = (
            await Moralis.Cloud.run("getUserBalances")
          ).projects.map(project => {
            let total = project.paymentSplitters.reduce(
              (total, ps) => {
                total.eth += ps.balances.eth;
                total.dai += ps.balances.dai;
                total.usdc += ps.balances.usdc;
                return total;
              },
              { eth: 0, dai: 0, usdc: 0 }
            );
            return { ...project, total };
          });
        } catch (error) {
          console.error(error);
          notifyError(error.error || error);
        } finally {
          Loading.hide();
        }
      }
    });

    return {
      shortAddr,
      userAddress,
      projects,
      isClaiming,
      claim
    };
  }
};
</script>
