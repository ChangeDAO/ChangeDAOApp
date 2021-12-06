<template>
  <q-page v-if="project" class="page-project-mint" padding>
    <div class="row q-col-gutter-xl reverse">
      <!-- Project Image -->

      <div class="page-col col q-col-6">
        <div class="sticky header-top">
          <!-- Connect Wallet -->
          <q-btn
            v-if="!account"
            @click="connectWallet"
            class="full-width q-mb-md"
            :label="$t('Connect Wallet')"
            color="primary"
          />

          <!-- Image -->
          <div class="square" :style="{ backgroundImage }" />

          <!-- Mint NFT -->
          <q-btn
            v-if="account"
            class="full-width q-mt-md"
            :label="$t('Mint NFT')"
            color="primary"
          />
          {{ account }}
        </div>
      </div>

      <div class="page-col col q-col-6">
        <!-- Project Name -->
        <p class="text-h6">{{ project.name }}</p>

        <p>
          <!-- Collection -->
          {{ $t("Part of") }}
          <router-link
            :to="{ name: 'collection', params: { id: project.collection.id } }"
          >
            {{ project.collection.name }}
          </router-link>

          <br />

          <!-- Creator -->
          <router-link
            :to="{ name: 'user', params: { id: project.creator.id } }"
          >
            <q-avatar size="xs" color="grey-5" class="q-mr-sm" />{{
              project.creator.name
            }}
          </router-link>
        </p>

        <!-- Areas of Impact -->
        <p>
          <q-chip
            v-for="area in project.impacts"
            :key="area.id"
            :label="area.name"
            class="border-primary text-subtitle1"
            :clickable="false"
            :ripple="false"
            outline
          />
        </p>

        <q-separator class="q-my-lg" />

        <!-- Qualitative Details -->

        <div class="text-subtitle2 text-secondary">
          {{ $t("Artwork Description") }}
        </div>
        <p>{{ project.description }}</p>

        <div class="text-subtitle2 text-secondary">
          {{ $t("Making Change By") }}
        </div>
        <p>{{ project.how }}</p>

        <q-separator class="q-my-lg" />

        <!-- Quantitative Details -->

        <div class="row">
          <!-- Minted -->
          <div class="col-6">
            <div class="text-subtitle2 text-secondary">
              {{ $t("Total Minted") }}
            </div>
            <p>{{ project.minted }} {{ $t("of") }} {{ project.mintable }}</p>
          </div>

          <!-- Goal -->
          <div class="col-6">
            <div class="text-subtitle2 text-secondary">
              {{ $t("Fundraising Goal") }}
            </div>
            <p>{{ $n(project.goalUSD, "compactUSD") }} USD</p>
          </div>
        </div>

        <!-- Price -->
        <div class="text-subtitle2 text-secondary">
          {{ $t("Price per Token") }}
        </div>
        <p>
          {{ $n(project.tokenPriceUSD, "compactUSD") }} USD
          {{ $t("via [PaymentMethods]") }}
        </p>

        <q-separator class="q-my-lg" />

        <!-- Mint -->
        <div class="text-subtitle1">
          <div class="col-grow q-mb-sm">
            {{ $t("Ready to support?") }}
          </div>

          <!-- Connect Wallet -->
          <q-btn v-if="account" :label="$t('Mint NFT')" color="primary" />
          <q-btn
            v-else
            @click="connectWallet"
            :label="$t('Connect Wallet')"
            color="primary"
          />
        </div>
      </div>
    </div>

    <q-separator class="q-my-lg" />

    <!-- Split -->

    <div class="row q-col-gutter-xl">
      <!-- Project Split -->
      <div class="page-col col q-col-6">
        <div class="text-subtitle2 text-secondary">
          {{ $t("Project Split") }}
        </div>
        <p>{{ $t("Primary Split Caption") }}</p>
        <ProjectSplit :project="project" />
      </div>

      <!-- Secondary Split -->
      <div class="page-col col q-col-6">
        <div class="text-subtitle2 text-secondary">
          {{ $t("Secondary Split") }}
        </div>
        <p>{{ $t("Secondary Split Caption") }}</p>
        <SecondarySplit :project="project" />
      </div>
    </div>
  </q-page>
</template>

<style lang="scss">
.page-project-mint {
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

import ProjectSplit from "../components/ProjectSplit";
import SecondarySplit from "../components/SecondarySplit";

export default defineComponent({
  name: "PageProjectMint",

  props: ["id"],

  components: {
    ProjectSplit,
    SecondarySplit
  },

  setup(props, context) {
    const { t } = useI18n({ useScope: "global" });
    const store = useStore();
    const $q = useQuasar();

    const doubleColumn = computed(() => $q.screen.width > 584);
    const project = computed(() => store.state.projects[props.id]);
    const backgroundImage = computed(() => {
      return project.value && project.value.img
        ? `url(${project.value.img})`
        : null;
    });

    // Fetch the project
    store.dispatch("getProject", props.id).catch(message => {
      $q.notify({
        message,
        type: "negative",
        icon: "mdi-alert-circle",
        position: "top"
      });
    });

    // Web3
    const ethereum = window.ethereum;
    const account = ref(ethereum.selectedAddress || "");

    const connectWallet = async () => {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts"
      });
      if (accounts && accounts.length) {
        account.value = accounts[0];
      }
    };

    ethereum.on("accountsChanged", accounts => {
      account.value = accounts[0] || "";
    });

    return {
      doubleColumn,
      project,
      backgroundImage,
      connectWallet,
      account
    };
  }
});
</script>
