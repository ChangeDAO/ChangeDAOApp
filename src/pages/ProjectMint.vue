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
            clickable
            outline
          />
        </p>

        <!-- View Updates -->
        <q-btn
          @click="viewUpdates"
          class="full-width"
          :label="$tc('View n Updates', updates.length)"
          outline
        />

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
          <div class="row">
            <div class="col-grow">
              {{ $t("Ready to support?") }}
            </div>
            <router-link :to="{ name: 'help' }">
              {{ $t("Need help?") }}
            </router-link>
          </div>

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
          <q-btn
            class="full-width"
            :label="$t('Connect Wallet')"
            color="primary"
          />

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

    <q-separator class="q-my-lg" />

    <!-- Project Updates -->

    <div class="row q-col-gutter-xl">
      <div class="page-col col q-col-6">
        <p id="ProjectUpdates" class="text-h6 text-secondary q-pt-md">
          {{ $t("Project Updates") }}
        </p>

        <!-- Filter -->
        <p>
          <q-option-group
            v-model="updatesFilter"
            :options="updatesFilterOptions"
            type="checkbox"
          />
        </p>
      </div>

      <!-- Updates -->
      <div class="page-col col q-col-6">
        <q-list separator>
          <q-item
            v-for="(post, i) in updates.slice(0, 5)"
            :key="i"
            class="q-px-none q-py-lg"
          >
            <q-item-section>
              <q-item-label class="row justify-between q-mb-sm">
                <!-- User -->
                <router-link
                  :to="{ name: 'user', params: { id: post.user.id } }"
                >
                  <q-avatar size="xs" color="grey-5" class="q-mr-sm" />{{
                    post.user.name
                  }}
                </router-link>
                <!-- Time -->
                <span class="text-caption text-secondary">
                  {{ $d(post.timestamp, "short") }}
                </span>
              </q-item-label>
              <!-- Message -->
              <q-item-label>
                {{ post.message }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useQuasar, scroll } from "quasar";
const { getScrollTarget, setVerticalScrollPosition } = scroll;

import ProjectSplit from "../components/ProjectSplit";
import SecondarySplit from "../components/SecondarySplit";

function scrollToElement(el) {
  const target = getScrollTarget(el);
  const offset = el.offsetTop;
  const duration = 400;
  setVerticalScrollPosition(target, offset, duration);
}

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
        collaborator1: 30,
        collaborator2: 8,
        changeDaoCommunityTreasury: 1,
        changeDaoOperationsTreasury: 1
      },
      secondarySplit: {
        creator: 55,
        collaborator1: 30,
        collaborator2: 8,
        changeDaoCommunityTreasury: 1,
        changeDaoOperationsTreasury: 1
      }
    };

    const updates = [];
    for (let i = 0; i < 212; i++) {
      updates[i] = {
        user: { id: "sampleuser", name: "Usernamehere" },
        timestamp: new Date(),
        message:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
      };
    }

    const viewUpdates = () => {
      scrollToElement(window.ProjectUpdates);
    };

    const updatesFilter = ref([
      "creator",
      "collaborators",
      "sponsors",
      "changedao"
    ]);

    const updatesFilterOptions = [
      { value: "creator", label: t("From Creator") },
      { value: "collaborators", label: t("From Collaborators") },
      { value: "sponsors", label: t("From Sponsors") },
      { value: "changedao", label: t("From ChangeDAO") }
    ];

    return {
      doubleColumn,
      project,
      updates,
      updatesFilter,
      updatesFilterOptions,
      viewUpdates
    };
  }
});
</script>
