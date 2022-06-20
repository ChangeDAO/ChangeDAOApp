<template>
  <q-img
    :src="imageURL"
    class="project-cover non-selectable shadow-4"
    :class="{ 'no-image': !imageURL }"
    fit="cover"
    :ratio="1"
    v-bind="$attrs"
  >
    <div class="absolute-bottom">
      <slot>
        <div class="row items-center">
          <AddrAvatar
            :address="project.createdByWalletAddress"
            class="q-mr-sm"
          />
          <div class="text-subtitle2 text-weight-bold ellipsis">
            {{ project.changemaker.displayName }}
          </div>
        </div>
        <div class="text-caption text-weight-bold ellipsis">
          {{ project.name }}
        </div>
        <div class="row justify-between">
          <div class="text-caption text-uppercase q-mr-xs ellipsis">
            {{ project.movement.name }}
          </div>
          <div class="text-caption text-right">
            {{
              $t("n of m minted", {
                n: $n(project.numMintsBought || 0, "n8"),
                m: $n(project.numMints || 0, "n8"),
              })
            }}
          </div>
        </div>
      </slot>
    </div>

    <q-menu v-if="$slots.menu">
      <slot name="menu" />
    </q-menu>
  </q-img>
</template>

<script>
import AddrAvatar from "./AddrAvatar";

export default {
  name: "ProjectCard",

  components: { AddrAvatar },

  props: {
    project: Object,
    minimal: Boolean,
  },

  computed: {
    imageURL() {
      return this.project.coverImageUrl;
    },
  },
};
</script>
