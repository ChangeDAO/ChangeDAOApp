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
              <AddrAvatar
                @click="
                  $router.push({
                    name: 'project-mint',
                    params: { projectID: project.id },
                  })
                "
                :address="project.ethAddress"
              />
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
            <q-item-section
              v-if="ps.balances.eth || ps.balances.dai || ps.balances.usdc"
              side
            >
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
  </q-page>
</template>

<script>
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { Loading } from "quasar";

import { TX_WAIT } from "../util/constants";
import { notifyError, notifySuccess, notifyTx } from "../util/notify";
import { shortAddr } from "../util/formatting";
import AddrAvatar from "../components/AddrAvatar";
import RelativeTime from "../components/RelativeTime";

import Moralis from "moralis";
import PaymentSplitter from "../../contracts/deployments/rinkeby/PaymentSplitter.json";

export default {
  name: "PageClaims",

  components: { AddrAvatar, RelativeTime },

  setup() {
    const store = useStore();

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
            _account: userAddress.value,
          },
        });

        // Call Cloud Function
        await Moralis.Cloud.run("withdrawFunds", {
          paymentSplitterId,
          transactionHash: tx.hash,
        });
        let dismiss = notifyTx(tx.hash);

        const response = await tx.wait(TX_WAIT);
        getProjects();
        notifySuccess("TxComplete");
        dismiss();
      } catch (error) {
        console.error(error);
        notifyError(error.error || error);
      } finally {
        isClaiming.value[paymentSplitterId] = false;
      }
    };

    const projects = ref([]);
    const getProjects = async () => {
      if (userAddress.value) {
        try {
          Loading.show();
          projects.value = (await Moralis.Cloud.run("getUserBalances")).projects
            .map((project) => {
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
            })
            .sort(
              (a, b) =>
                b.paymentSplitters[0].createdAt -
                a.paymentSplitters[0].createdAt
            );
        } catch (error) {
          console.error(error);
          notifyError(error.error || error);
        } finally {
          Loading.hide();
        }
      }
    };

    onMounted(async () => {
      getProjects();
    });

    return {
      shortAddr,
      userAddress,
      projects,
      isClaiming,
      claim,
    };
  },
};
</script>
