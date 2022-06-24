<template>
  <div>
    <!-- Project Name -->
    <p class="text-h3 text-selectable">
      {{ project.name }}

      <br />

      <!-- Address -->
      <span class="text-caption">
        <AddrAvatar :address="project.ethAddress" class="q-mr-sm" />{{
          shortAddr(project.ethAddress)
        }} </span
      ><br />

      <!-- Changemaker Name -->
      <span class="text-accent text-h4">
        <AddrAvatar
          :address="project.createdByWalletAddress"
          class="q-mr-sm"
        />{{ project.changemaker.displayName }}
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

    <p>
      <!-- Movement -->
      <span>{{ $t("Movement") }}</span>
      <br />
      <span class="text-accent text-selectable">
        {{ project.movement.name }}
      </span>

      <br />
    </p>

    <template v-if="!minimal && project.nonprofits.length">
      <!-- Supported Nonprofits -->
      <p>
        <span>{{ $t("Supported Nonprofits") }}</span>
        <template v-for="(nonprofit, i) in project.nonprofits" :key="i">
          <br />
          <span class="text-accent">
            <q-avatar
              size="sm"
              color="grey-5"
              class="q-my-sm q-mr-sm"
              square
            />{{ nonprofit }}
          </span>
        </template>
      </p>

      <!-- Area of Change -->
      <p>{{ $t("Area of Change") }}</p>
      <div class="q-gutter-md">
        <q-chip
          :label="$t('areasOfChange.' + project.areaOfChange)"
          class="text-subtitle1"
          :clickable="false"
          :ripple="false"
          color="primary"
        />
      </div>
    </template>
  </div>
</template>

<script>
import AddrAvatar from "./AddrAvatar.vue";
import { shortAddr } from "../util/formatting";

export default {
  name: "ProjectInfo",
  components: { AddrAvatar },
  props: {
    project: Object,
    minimal: Boolean,
  },
  computed: {
    userAddress() {
      return this.$store.state.web3.userAddress;
    },
  },
  methods: { shortAddr },
};
</script>
