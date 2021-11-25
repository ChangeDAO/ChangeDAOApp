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
          <q-btn color="primary" label="Get Email Updates" />
          <q-btn icon="mdi-discord" size="sm" padding="sm" outline dense />
          <q-btn icon="mdi-twitter" size="sm" padding="sm" outline dense />
        </div>
      </q-toolbar>
    </q-header>

    <q-footer class="q-px-xl q-pb-lg q-gutter-lg">
      <div class="row q-gutter-md q-ma-none">
        <div class="column q-gutter-md">
          <img
            class="block"
            alt="ChangeDAO logo"
            src="~assets/ChangeDAO-white-horizontal-logo-asset-only.svg"
            style="width: 200px; max-width: 100%"
          />
          <q-btn :to="{ name: 'about' }" label="About us" outline />
        </div>

        <div class="q-gutter-md col-grow text-right">
          <q-btn color="primary" label="Get Email Updates" />
          <q-btn
            icon="mdi-discord"
            label="Discord"
            size="sm"
            padding="sm"
            outline
          />
          <q-btn
            icon="mdi-twitter"
            label="Twitter"
            size="sm"
            padding="sm"
            outline
          />
        </div>
      </div>

      <q-separator />

      <div class="text-caption row items-center justify-end">
        <div class="col-grow">
          © Copyright 2021 Mount Change LLC. All rights reserved.
        </div>

        <div class="row q-gutter-xl">
          <router-link :to="{ name: 'privacy' }">Privacy</router-link>
          <router-link :to="{ name: 'terms' }">Terms</router-link>
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
