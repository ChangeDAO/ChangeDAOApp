<template>
  <q-card>
    <img
      src="~assets/ChangeDAO-sample-cover.png"
      style="width: 100%"
      class="shadow-4"
    />
    <div class="absolute-bottom q-pa-md caption">
      <div class="row items-center">
        <AddrAvatar :address="project.createdByWalletAddress" class="q-mr-sm" />
        <div class="text-subtitle2 text-weight-bold ellipsis">
          {{ shortAddr(project.createdByWalletAddress) }}
        </div>
      </div>
      <div class="text-caption text-weight-bold ellipsis">
        {{ project.name }}
      </div>
      <div class="row justify-between">
        <div class="text-caption text-uppercase q-mr-sm ellipsis">
          {{ project.movement.name }}
        </div>
        <div class="text-caption text-grey-6 text-right">
          {{ project.numMintsBought }} of {{ project.numMints }} minted
        </div>
      </div>
    </div>
  </q-card>
</template>

<style lang="scss">
.caption {
  background: rgba(0, 0, 0, 0.47);
}
</style>

<script>
import { shortAddr } from "../util/formatting";

import AddrAvatar from "./AddrAvatar";

export default {
  name: "ProjectCard",

  components: { AddrAvatar },

  props: {
    project: Object,
    minimal: Boolean,
  },

  methods: {
    shortAddr,
  },
};
</script>
