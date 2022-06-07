<template>
  <q-card>
    <img
      src="~assets/ChangeDAO-sample-cover.png"
      style="width: 100%;"
      class="shadow-4"
    />
    <div class="absolute-bottom q-pa-md caption">
      <div class="row items-center">
        <q-avatar size="sm" color="grey-9" class="q-my-sm q-mr-sm" square />
        <div class="text-subtitle2 text-weight-bold ellipsis">
          @changemakerhandle
        </div>
      </div>
      <div class="text-caption text-weight-bold ellipsis">
        Title of the drop
      </div>
      <div class="row justify-between">
        <div class="text-caption text-uppercase q-mr-sm ellipsis">
          Movement Name
        </div>
        <div class="text-caption text-grey-6 text-right">
          ## of #### minted
        </div>
      </div>
    </div>
  </q-card>
</template>

<script>
import { shortAddr } from "../util/formatting";

export default {
  name: "ProjectCard",
  props: {
    project: Object,
    minimal: Boolean
  },
  methods: {
    shortAddr
  }
};
</script>
