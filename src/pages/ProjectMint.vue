<template>
  <q-page v-if="project" class="page-project-mint" padding>
    <div class="row q-col-gutter-xl reverse">
      <!-- Project Image -->

      <div class="page-col col q-col-6">
        <div class="sticky header-top">
          <!-- Connect Wallet -->
          <q-btn
            v-if="!user"
            @click="connectWallet"
            class="full-width q-mb-lg"
            :label="$t('Connect Wallet')"
            color="primary"
          />

          <!-- Mint NFT -->
          <q-btn
            v-if="user"
            @click="dialogCheckout = true"
            :label="$t('Mint NFT')"
            class="full-width q-mb-lg"
            color="primary"
          />

          <!-- Image -->
          <div class="square" :style="{ backgroundImage }" />
        </div>
      </div>

      <div class="page-col col q-col-6">
        <!-- Project Name -->
        <p class="text-h3">{{ project.name }}</p>

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
          <span
            class="text-h4 text-accent"
          >
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

        <!-- Areas of Change -->
        <p class="q-gutter-md">
          <q-chip
            v-for="area in project.areasOfChange"
            :key="area"
            :label="$t('areasOfChange.' + area)"
            class="text-subtitle1"
            :clickable="false"
            :ripple="false"
            color="primary"
          />
        </p>

        <q-separator class="q-my-lg" />

        <!-- Qualitative Details -->

        <p class="text-subtitle">
          {{ $t("Artwork Description") }}
        </p>
        <p>{{ project.description }}</p>
        <br />

        <p class="text-subtitle">
          {{ $t("Making Change By") }}
        </p>
        <p>{{ project.how }}</p>

        <q-separator class="q-my-lg" />

        <!-- Quantitative Details -->

        <div class="row">
          <!-- Minted -->
          <div class="col-6 q-mb-lg">
            <p class="text-subtitle">
              {{ $t("Total Minted") }}
            </p>
            <p>{{ project.minted }} {{ $t("of") }} {{ project.mintable }}</p>
          </div>

          <!-- Goal -->
          <div class="col-6 q-mb-lg">
            <p class="text-subtitle">
              {{ $t("Fundraising Goal") }}
            </p>
            <p>{{ $n(project.goalUSD, "compactUSD") }} USD</p>
          </div>
        </div>

        <!-- Price -->
        <div class="q-mb-lg">
          <p class="text-subtitle">
            {{ $t("Price per Token") }}
          </p>
          <p>
            {{ $n(project.tokenPriceUSD, "compactUSD") }} USD
            {{ $t("via [PaymentMethods]") }}
          </p>
        </div>

        <q-separator class="q-mb-lg" />

        <!-- Mint -->
        <div class="text-h4">
          <div class="col-grow q-mb-lg">
            {{ $t("Ready to support?") }}
          </div>

          <!-- Connect Wallet -->
          <q-btn
            v-if="user"
            @click="dialogCheckout = true"
            :label="$t('Mint NFT')"
            color="primary"
          />
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
        <p class="text-subtitle">
          {{ $t("Project Split") }}
        </p>
        <p>{{ $t("Primary Split Caption") }}</p>
        <ProjectSplit :project="project" />
      </div>

      <!-- Secondary Split -->
      <div class="page-col col q-col-6">
        <p class="text-subtitle">
          {{ $t("Secondary Split") }}
        </p>
        <p>{{ $t("Secondary Split Caption") }}</p>
        <SecondarySplit :project="project" />
      </div>
    </div>

    <Checkout
      :id="id"
      v-if="user"
      v-model="dialogCheckout"
      go-back
    />
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
import { useStore } from "vuex";
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from "quasar";

import Checkout from "./Checkout";
import ProjectSplit from "../components/ProjectSplit";
import SecondarySplit from "../components/SecondarySplit";

export default defineComponent({
  name: "PageProjectMint",

  props: ["id"],

  components: {
    Checkout,
    ProjectSplit,
    SecondarySplit
  },

  setup(props, context) {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
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
        icon: "alert",
        position: "top"
      });
    });

    // Web3
    const user = computed(() => store.state.web3.user);

    const connectWallet = () => {
      store.dispatch("logIn");
    };

    // Dialogs
    const dialogCheckout = computed({
      get: () => route.params.dialog === "checkout",
      set: (value) => {
        if (value && route.params.dialog !== "checkout") {
          router.push({params: {dialog: "checkout"}});
        } else if (!value && route.params.dialog === "checkout") {
          router.back();
        }
      }
    });

    return {
      dialogCheckout,
      doubleColumn,
      project,
      backgroundImage,
      connectWallet,
      user
    };
  }
});
</script>
