<template>
  <q-page padding>
    <div class="row q-col-gutter-xl">
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
          <div class="col-grow">
            {{ $t("Ready to support?") }}
          </div>

          <!-- Connect Wallet -->
          <q-btn
            v-if="doubleColumn"
            class="q-mt-sm"
            :label="$t('Connect Wallet')"
            color="primary"
          />
        </div>
      </div>

      <!-- Project Image -->

      <div class="page-col col q-col-6">
        <div class="sticky header-top">
          <!-- Connect Wallet -->
          <q-btn
            class="full-width"
            :label="$t('Connect Wallet')"
            color="primary"
          />

          <!-- Image -->
          <div class="square bg-grey-5 q-mt-md" />
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

<script>
import { defineComponent, ref, computed } from "vue";
import { useI18n } from "vue-i18n";
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

  setup() {
    const { t } = useI18n({ useScope: "global" });
    const $q = useQuasar();

    const doubleColumn = computed(() => $q.screen.width > 584);

    const project = {
      name: "Mint Title Would Go Here",
      creator: {
        id: "sampleuser",
        name: "Usernamehere"
      },
      collaborators: [
        { id: "collaborator1", name: "Collaborator1usernamehere" },
        { id: "collaborator2", name: "Collaborator2usernamehere" }
      ],
      collection: {
        id: "samplecollection",
        name: "Collection Name Here"
      },
      impacts: [
        { id: "area1", name: "Area of Impact 1" },
        { id: "area2", name: "Area of Impact 2" },
        { id: "area3", name: "Area of Impact 3" }
      ],
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      how:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      minted: 808,
      mintable: 1e3,
      goalUSD: 1e5,
      tokenPriceUSD: 250,
      primarySplit: {
        creator: 55,
        collaborator1: 35,
        collaborator2: 8,
        changeDaoCommunityTreasury: 1,
        changeDaoOperationsTreasury: 1
      },
      secondarySplit: {
        creator: 55,
        collaborator1: 35,
        collaborator2: 8,
        changeDaoCommunityTreasury: 1,
        changeDaoOperationsTreasury: 1
      }
    };

    return {
      doubleColumn,
      project
    };
  }
});
</script>
