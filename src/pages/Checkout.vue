<template>
  <LargeDialog v-if="project" v-bind="$attrs" :max-width="$q.screen.sizes.md">
    <template v-slot:header>
      <DialogHeader :title="$t('Checkout')" />
    </template>

    <q-page class="page-checkout" :class="{ doubleColumn }" padding>
      <!-- Page Title -->

      <div class="row q-col-gutter-xl">
        <!-- Info column -->
        <div class="info-column page-col col q-col-3">
          <div class="sticky header-top">
            <!-- Image -->
            <div class="square q-mb-lg" :style="{ backgroundImage }" />

            <!-- Project Name -->
            <p class="text-h4">{{ project.name }}</p>

            <p>
              <!-- Collection -->
              {{ $t("Part of") }}
              <span class="text-accent">
                {{ project.collection.name }}
              </span>
              <!-- <router-link
                :to="{ name: 'collection', params: { id: project.collection.id } }"
                >
                {{ project.collection.name }}
              </router-link> -->

              <br />

              <!-- Creator -->
              <span class="text-accent text-h5">
                <q-avatar size="sm" color="grey-5" class="q-my-sm q-mr-sm" />{{
                  project.creator.name
                }}
              </span>
              <!-- <router-link
                class="text-h4"
                :to="{ name: 'user', params: { id: project.creator.id } }"
              >
                <q-avatar size="sm" color="grey-5" class="q-my-sm q-mr-sm" />{{
                  project.creator.name
                }}
              </router-link> -->
            </p>
          </div>
        </div>

        <!-- Form column -->
        <div class="form-column page-col col q-col-9 q-gutter-lg">
          <!-- Cost per Mint -->
          <div class="row">
            <span class="text-subtitle col-grow">{{
              $t("Cost per Mint")
            }}</span>
            <span>{{ $n(cost, "USD") }} USD</span>
          </div>

          <!-- Number of Mints -->
          <div>
            <div class="text-subtitle q-mb-sm">{{ $t("Number of Mints") }}</div>
            <q-select v-model="quantity" :options="quantities" dense outlined />
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
                v-model="customTip"
                type="number"
                :min="1"
                suffix="%"
                outlined
                dense
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
            <q-btn class="col-grow" :label="$t('Purchase')" color="primary" />
            <div class="col-grow text-caption q-mt-sm q-mr-sm">
              {{ $t("This will open wallet") }}
            </div>
          </div>
        </div>
      </div>
    </q-page>
  </LargeDialog>
</template>

<style lang="scss">
.page-checkout {
  &.doubleColumn > .row > .info-column {
    max-width: 350px;
  }

  .square {
    background-color: $grey-9;
    background-image: url(~assets/chest.png);
    background-size: contain;

    &:after {
      content: "";
      display: block;
      padding-bottom: 100%;
    }
  }
}
</style>

<script>
import { defineComponent, ref, computed, onMounted, nextTick } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
import { useQuasar } from "quasar";

import DialogHeader from "../components/DialogHeader.vue";
import LargeDialog from "../components/LargeDialog.vue";
import SmoothReflow from "../components/SmoothReflow.vue";

export default defineComponent({
  name: "DialogCheckout",

  props: ["project"],

  components: { DialogHeader, LargeDialog, SmoothReflow },

  setup(props, context) {
    const { t } = useI18n();
    const store = useStore();
    const $q = useQuasar();

    const doubleColumn = computed(() => $q.screen.width > 584);
    const project = computed(() => props.project);
    const backgroundImage = computed(() => {
      return project.value && project.value.img
        ? `url(${project.value.img})`
        : null;
    });

    // Form
    const cost = computed(() =>
      project.value && project.value ? project.value.tokenPriceUSD : null
    );
    const quantities = [1, 2, 3];
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
    const tipTotal = computed(() => subtotal.value * tipMultiplier.value);
    const total = computed(() => subtotal.value * (1 + tipMultiplier.value));
    const currencies = computed(() => {
      return ["ETH", "USDC", "DAI"].map(value => ({
        value,
        label: value,
        disable: disabledCurrencies.value.includes(value)
      }));
    });
    const currency = ref("ETH");
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
    const user = computed(() => store.state.web3.user);
    const balances = computed(() => store.state.web3.userBalances);
    const balanceETH = computed(() => balances.value.ETH);
    const balanceUSDC = computed(() => balances.value.USDC);
    const balanceDAI = computed(() => balances.value.DAI);

    return {
      doubleColumn,
      backgroundImage,
      user,
      cost,
      quantities,
      quantity,
      subtotal,
      tips,
      tip,
      customTip,
      tipTotal,
      total,
      currencies,
      currency,
      disabledCurrencies
    };
  }
});
</script>
