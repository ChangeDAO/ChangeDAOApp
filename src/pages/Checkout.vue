<template>
  <q-page v-if="project" class="page-checkout" :class="{ doubleColumn }" padding>
    <!-- Page Title -->
    <div class="text-h3 q-mb-lg">{{ $t("Checkout") }}</div>

    <div class="row q-col-gutter-xl">

      <!-- Left column -->

      <div class="page-col col q-col-3">

        <div class="sticky header-top">
          <!-- Image -->
          <div class="square q-mb-lg" :style="{ backgroundImage }" />

          <!-- Project Name -->
          <p class="text-h3">{{ project.name }}</p>

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
              class="text-h4"
                :to="{ name: 'user', params: { id: project.creator.id } }"
              >
              <q-avatar size="sm" color="grey-5" class="q-my-sm q-mr-sm" />{{
                project.creator.name
              }}
            </router-link>
          </p>
        </div>
      </div>

      <div class="page-col col q-col-9 q-gutter-lg">
        <!-- Cost per Mint -->
        <div>
          <p class="text-subtitle">{{ $t("Cost per Mint") }}</p>
          <q-banner class="bg-secondary">
            {{ $n(250, "compactUSD") }} USD
          </q-banner>
        </div>

        <!-- Number of Mints -->
        <div>
          <p class="text-subtitle">{{ $t("Number of Mints") }}</p>
          <q-input type="number" :min="1" outlined />
        </div>

        <!-- Subtotal -->
        <div>
          <p class="text-subtitle">{{ $t("Subtotal") }}</p>
          <q-banner class="bg-secondary">
            {{ $n(250, "compactUSD") }} USD
          </q-banner>
        </div>
      </div>
    </div>
  </q-page>
</template>

<style lang="scss">
.page-checkout {
  &.doubleColumn {
    .q-col-3 {
      max-width: 350px;
    }
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
import { defineComponent, ref, computed, onMounted, nextTick } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "PageCheckout",

  props: ["id"],

  components: {},

  setup(props, context) {
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
