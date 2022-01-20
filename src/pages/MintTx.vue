<template>
  <q-page v-if="project" class="page-project-mint" padding>
    Processing Transaction
  </q-page>
</template>

<style lang="scss"></style>

<script>
import { defineComponent, ref, computed, onMounted, nextTick } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "PageMintTx",

  props: ["projectID", "txID"],

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
