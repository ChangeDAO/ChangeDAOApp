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
        <UserMenu />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer
      :class="{
        'q-px-xl q-pt-lg q-pb-md': $q.screen.gt.xs,
        'q-px-md q-pt-md q-pb-sm': !$q.screen.gt.xs
      }"
    >
      <div class="row q-col-gutter-md justify-center">
        <div class="col-sm-4 q-mb-md">
          <img
            class="block q-mb-md"
            alt="ChangeDAO logo"
            src="~assets/ChangeDAO-white-horizontal-logo-asset-only.svg"
            style="width: 200px; max-width: 100%"
          />
        </div>

        <!-- <q-btn
            href="https://docs.changedao.org/about-us/master"
            :label="$t('About Us')"
            style="width: 200px; max-width: 100%"
            outline
          /> -->

        <div
          class="col-sm-8 row items-start q-gutter-md q-mb-md"
          :class="{
            'justify-end text-right': $q.screen.gt.xs,
            'justify-center': !$q.screen.gt.xs
          }"
        >
          <div class="text-center q-gutter-md q-ma-none">
            <!-- <q-btn
              @click="discord"
              icon="discord"
              :label="$t('Discord')"
              size="sm"
              padding="sm"
              outline
            /> -->
            <q-btn
              @click="twitter"
              icon="twitter"
              color="white"
              text-color="dark-accent"
              size="md"
              padding="sm"
            />
            <q-btn
              @click="dialogEmail = true"
              color="white"
              text-color="dark-accent"
              icon="email"
              size="md"
              padding="sm"
            />
          </div>
        </div>
      </div>

      <div class="text-caption row items-center justify-end">
        <div class="col-grow q-mb-sm text-grey-6">
          {{ $t("Copyright") }}
        </div>

        <!-- <div class="row">
          <router-link class="q-mb-sm q-ml-xl" :to="{ name: 'privacy' }">
            {{ $t("Privacy") }}
          </router-link>
          <router-link class="q-mb-sm q-ml-xl" :to="{ name: 'terms' }">
            {{ $t("Terms") }}
          </router-link>
        </div> -->
      </div>
    </q-footer>
  </q-layout>
</template>

<script>
import { defineComponent, computed, ref } from "vue";
import { openURL } from "quasar";
import { notifyError } from "../util/notify";

import UserMenu from "../components/UserMenu";

export default defineComponent({
  name: "MainLayout",

  components: { UserMenu },

  setup() {
    const discord = () => {
      openURL("https://discord.gg/88KeENZnyQ");
    };
    const twitter = () => {
      openURL("https://twitter.com/ChangeDAO");
    };

    return {
      discord,
      twitter
    };
  }
});
</script>
