<template>
  <q-page class="bg-gradient" padding>
    <div v-if="userAddress">
      <!-- Title -->
      <div class="q-my-md q-mx-auto text-center">
        <div class="text-h4">{{ $t("Claims") }}</div>

        <!-- Toggle all -->
        <q-toggle
          v-model="showAll"
          :label="$t('Show All')"
          color="accent"
          left-label
        />
      </div>

      <div class="projects row q-gutter-xl justify-center q-py-xl">
        <ProjectCard
          class="cursor-pointer"
          style="max-width: 300px"
          v-for="project in projects"
          :key="project.id"
          :project="project"
          @click="
            $router.push({
              name: 'project-view',
              params: { projectID: project.id },
            })
          "
        >
          <div @click.stop class="non-selectable">
            <!-- Project Info -->
            <q-item class="q-pa-none">
              <q-item-section side>
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
            </q-item>

            <!-- Total Balances -->
            <q-item class="q-pa-none">
              <q-item-section>
                <q-item-label caption>ETH</q-item-label>
                <q-item-label
                  :class="{ 'text-positive': project.total.eth > 0 }"
                >
                  {{ $n(project.total.eth, "n6") }}
                </q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label caption>DAI</q-item-label>
                <q-item-label
                  :class="{ 'text-positive': project.total.dai > 0 }"
                >
                  {{ $n(project.total.dai, "USD") }}
                </q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label caption>USDC</q-item-label>
                <q-item-label
                  :class="{ 'text-positive': project.total.usdc > 0 }"
                >
                  {{ $n(project.total.usdc, "USD") }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="arrow_drop_down" />
              </q-item-section>
            </q-item>
            <q-menu>
              <q-list>
                <q-item
                  v-for="ps in project.paymentSplitters"
                  :key="ps.id"
                  @click="claim(ps)"
                  :clickable="hasBalance(ps)"
                  v-ripple="hasBalance(ps)"
                  class="non-selectable"
                  :class="{ disabled: !hasBalance(ps) }"
                >
                  <q-item-section side>
                    <AddrAvatar :address="ps.ethAddress">
                      {{ $t("psTypes." + ps.type) }}<br />
                      {{ shortAddr(ps.ethAddress) }}
                    </AddrAvatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label caption>ETH</q-item-label>
                    <q-item-label
                      class="ellipsis"
                      :class="{ 'text-positive': ps.balances.eth > 0 }"
                      caption
                    >
                      {{ $n(ps.balances.eth, "n6") }}
                    </q-item-label>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label caption>DAI</q-item-label>
                    <q-item-label
                      class="ellipsis"
                      :class="{ 'text-positive': ps.balances.dai > 0 }"
                      caption
                    >
                      {{ $n(ps.balances.dai, "USD") }}
                    </q-item-label>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label caption>USDC</q-item-label>
                    <q-item-label
                      class="ellipsis"
                      :class="{ 'text-positive': ps.balances.usdc > 0 }"
                      caption
                    >
                      {{ $n(ps.balances.usdc, "USD") }}
                    </q-item-label>
                  </q-item-section>
                  <q-item-section v-if="hasBalance(ps)" side>
                    <q-spinner v-if="isClaiming[ps.id]" size="1.7em" />
                    <q-icon v-else name="claims">
                      <Tooltip>{{ $t("Claim") }}</Tooltip>
                    </q-icon>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </div>
        </ProjectCard>
      </div>
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
import ProjectCard from "../components/ProjectCard";
import AddrAvatar from "../components/AddrAvatar";
import RelativeTime from "../components/RelativeTime";
import Tooltip from "../components/Tooltip";

import Moralis from "moralis";
import PaymentSplitter from "../../contracts/deployments/mainnet/PaymentSplitter.json";

export default {
  name: "PageClaims",

  components: { ProjectCard, AddrAvatar, RelativeTime, Tooltip },

  setup() {
    const store = useStore();

    const userAddress = computed(() => store.state.web3.userAddress);

    const showAll = ref(false);

    const getAvailable = async (ps) => {
      const paymentSplitterClone = new ethers.Contract(
        ps.ethAddress,
        PaymentSplitter.abi,
        provider
      );

      if (!paymentSplitterClone) {
        return;
      }

      let eth = await paymentSplitterClone.functions.pendingETHPayment(
        userAddress.value
      );
      eth = ethers.utils.formatEther(eth[0]);

      let dai = await paymentSplitterClone.functions.pendingERC20Payment(
        DAI_ADDRESS,
        userAddress.value
      );
      dai = parseInt(ethers.utils.formatUnits(dai[0], 18), 10);

      let usdc = await paymentSplitterClone.functions.pendingERC20Payment(
        USDC_ADDRESS,
        userAddress.value
      );
      usdc = parseInt(ethers.utils.formatUnits(usdc[0], 6), 10);

      return { eth, dai, usdc, isEmpty: !(eth + dai + usdc) };
    };

    const isClaiming = ref({});
    const claim = async (ps) => {
      if (!hasBalance(ps) || isClaiming.value[ps.id]) {
        return;
      }
      const paymentSplitterId = ps.id;
      const contractAddress = ps.ethAddress;
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
        // getAvailable(ps);
        notifySuccess("TxComplete");
        dismiss();
      } catch (error) {
        console.error(error);
        notifyError(error.error || error);
      } finally {
        isClaiming.value[paymentSplitterId] = false;
      }
    };

    const hasBalance = (ps) =>
      Boolean(ps.balances.eth || ps.balances.dai || ps.balances.usdc);

    const allProjects = ref([]);
    const projects = computed(() =>
      showAll.value
        ? allProjects.value
        : allProjects.value.filter((p) => p.hasBalance)
    );
    const getProjects = async () => {
      if (userAddress.value) {
        try {
          Loading.show();
          allProjects.value = (
            await Moralis.Cloud.run("getUserBalances")
          ).projects
            .map((project) => {
              let hasBalance = false;
              let total = project.paymentSplitters.reduce(
                (total, ps) => {
                  total.eth += ps.balances.eth;
                  total.dai += ps.balances.dai;
                  total.usdc += ps.balances.usdc;
                  return total;
                },
                { eth: 0, dai: 0, usdc: 0 }
              );
              if (total.eth || total.dai || total.usdc) {
                hasBalance = true;
              }
              return { ...project, total, hasBalance };
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
      claim,
      shortAddr,
      hasBalance,
      userAddress,
      showAll,
      projects,
      isClaiming,
    };
  },
};
</script>
