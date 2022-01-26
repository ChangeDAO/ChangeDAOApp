<template>
  <q-page v-if="project" class="page-mint-tx" :class="{ doubleColumn }" padding>
    <!-- Page Title -->
    <p class="text-h3">{{ $t("Processing Transaction") }}</p>

    <!-- Progress (Single Column) -->
    <div v-if="!doubleColumn">
      <q-linear-progress indeterminate />
    </div>

    <div class="row q-col-gutter-xl">
      <!-- Info column -->
      <div class="image-column page-col col q-col-3">
        <div>
          <!-- Image -->
          <div class="square q-mb-lg" :style="{ backgroundImage }" />
        </div>
      </div>

      <!-- Info column -->
      <div class="info-column page-col col q-col-9 q-gutter-lg">
        <!-- Progress (Double Column) -->
        <div v-if="doubleColumn">
          <q-linear-progress indeterminate />
        </div>

        <!-- Project Info -->
        <ProjectInfo :project="project" />

        <q-separator />

        <!-- Transaction Details -->
      </div>
    </div>
  </q-page>
</template>

<style lang="scss">
.page-mint-tx {
  &.doubleColumn > .row > .image-column {
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
import { defineComponent, computed } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import { useQuasar } from "quasar";

import ProjectInfo from "../components/ProjectInfo";

export default defineComponent({
  name: "PageMintTx",

  components: { ProjectInfo },

  props: ["projectID", "txID"],

  setup(props, context) {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const $q = useQuasar();

    const doubleColumn = computed(() => $q.screen.width > 584);
    const project = computed(() => store.state.projects[props.projectID]);
    const backgroundImage = computed(() => {
      return project.value && project.value.img
        ? `url(${project.value.img})`
        : null;
    });

    // Fetch the project
    store.dispatch("getProject", props.projectID).catch(message => {
      $q.notify({
        message,
        type: "negative",
        icon: "alert",
        position: "top"
      });
    });

    // Web3
    const user = computed(() => store.state.web3.user);

    return {
      doubleColumn,
      project,
      backgroundImage,
      user
    };
  }
});
</script>
