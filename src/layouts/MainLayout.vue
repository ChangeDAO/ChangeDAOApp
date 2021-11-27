<template>
  <q-layout view="hHh LpR fff">
    <q-header>
      <q-toolbar class="q-pa-md">
        <q-toolbar-title>
          <img
            class="block"
            alt="ChangeDAO logo"
            src="~assets/ChangeDAO-white-horizontal-logo-asset-only.svg"
            style="width: 200px; max-width: 100%"
          />
        </q-toolbar-title>

        <div class="q-gutter-md">
          <q-btn
            color="primary"
            :label="$q.screen.gt.xs ? 'Get Email Updates' : ''"
            :icon="$q.screen.gt.xs ? undefined : 'mdi-email'"
            :dense="!$q.screen.gt.xs"
          />
          <q-btn icon="mdi-discord" size="sm" padding="sm" outline dense />
          <q-btn icon="mdi-twitter" size="sm" padding="sm" outline dense />
        </div>
      </q-toolbar>
    </q-header>

    <q-footer class="q-px-xl q-pt-lg q-pb-md">
      <div class="row">
        <div class="column q-mb-md q-mr-md">
          <img
            class="block q-mb-md"
            alt="ChangeDAO logo"
            src="~assets/ChangeDAO-white-horizontal-logo-asset-only.svg"
            style="width: 200px; max-width: 100%"
          />
          <q-btn :to="{ name: 'about' }" label="About us" outline />
        </div>

        <div class="col-grow text-right">
          <q-btn class="q-mb-md" color="primary" label="Get Email Updates" />
          <q-btn
            class="q-ml-md q-mb-md"
            icon="mdi-discord"
            label="Discord"
            size="sm"
            padding="sm"
            outline
          />
          <q-btn
            class="q-ml-md q-mb-md"
            icon="mdi-twitter"
            label="Twitter"
            size="sm"
            padding="sm"
            outline
          />
        </div>
      </div>

      <q-separator class="q-mb-lg q-mt-sm" />

      <div class="text-caption row items-center justify-end">
        <div class="col-grow q-mb-sm">
          © Copyright 2021 Mount Change LLC. All rights reserved.
        </div>

        <div class="row">
          <router-link class="q-mb-sm q-ml-md" :to="{ name: 'privacy' }"
            >Privacy</router-link
          >
          <router-link class="q-mb-sm q-ml-md" :to="{ name: 'terms' }"
            >Terms</router-link
          >
        </div>
      </div>
    </q-footer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "MainLayout",

  setup() {
    const $q = useQuasar();
    $q.dark.set(true);

    return {};
  }
});
</script>
