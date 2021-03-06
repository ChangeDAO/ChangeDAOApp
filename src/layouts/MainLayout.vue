<template>
  <q-layout view="hHh LpR fff">
    <q-header>
      <q-toolbar class="q-py-sm">
        <q-toolbar-title>
          <q-btn :to="{ name: 'home' }" flat dense>
            <img
              class="block non-selectable"
              alt="ChangeDAO logo"
              src="~assets/ChangeDAO-white-horizontal-logo-asset-only.svg"
              style="width: 200px; max-width: 100%"
            />
          </q-btn>
        </q-toolbar-title>

        <UserMenu />
      </q-toolbar>
      <SmoothReflow>
        <q-banner
          v-if="isLoggedIn && incorrectChain"
          class="bg-negative text-white text-center"
        >
          <span class="text-subtitle1 text-bold">
            {{ $t("error.incorrectChain", { correctChain }) }}
          </span>
        </q-banner>
      </SmoothReflow>
    </q-header>

    <q-page-container>
      <router-view v-if="isInitialized && !showLogIn" />
      <LogInDialog
        :model-value="showLogIn"
        :subtitle="
          $route.meta.requiresAdmin && isLoggedIn ? $t('error.notAdmin') : ''
        "
      />
    </q-page-container>

    <q-footer class="non-selectable">
      <div
        :class="{
          'q-px-lg q-pt-lg q-pb-md': $q.screen.gt.xs,
          'q-pa-xl': !$q.screen.gt.xs,
        }"
        :style="{ maxWidth: $q.screen.sizes.md + 'px', margin: '0 auto' }"
      >
        <div
          class="justify-between"
          :class="{
            row: $q.screen.gt.xs,
            column: !$q.screen.gt.xs,
          }"
        >
          <!-- Logo -->
          <div class="col-sm-3 q-mb-md">
            <router-link :to="{ name: 'home' }">
              <img
                class="block q-mb-md"
                alt="ChangeDAO logo"
                src="~assets/ChangeDAO-white-horizontal-logo-asset-only.svg"
                style="width: 200px; max-width: 100%"
              />
            </router-link>
          </div>

          <div
            class="col-sm-7 row items-start q-mb-md"
            :class="{
              'justify-start text-right': $q.screen.gt.xs,
              'justify-start': !$q.screen.gt.xs,
            }"
          >
            <!-- Nav Links -->
            <div
              class="q-col-gutter-md"
              :class="{
                'row q-pt-xs q-px-lg justify-between full-width':
                  $q.screen.gt.xs,
                'column q-gutter-y-md': !$q.screen.gt.xs,
              }"
            >
              <template v-for="(link, i) in nav">
                <a
                  v-if="'href' in link"
                  :href="link.href"
                  :key="'a-' + i"
                  v-bind="link.attrs || {}"
                >
                  {{ $t(link.label) }}
                </a>
                <router-link
                  v-else
                  :to="link.route"
                  :key="'route-' + i"
                  v-bind="link.attrs || {}"
                >
                  {{ $t(link.label) }}
                </router-link>
              </template>
            </div>
          </div>

          <!-- Social Links -->
          <div
            class="col-sm-2 row q-gutter-lg q-pt-xs q-mb-lg"
            :class="{
              'justify-end self-start': $q.screen.gt.xs,
              'q-pt-lg': !$q.screen.gt.xs,
            }"
          >
            <q-btn
              @click="twitter"
              icon="twitter"
              color="white"
              text-color="dark-accent"
              size="md"
              padding="sm"
            />
            <q-btn
              @click="contact"
              color="white"
              text-color="dark-accent"
              icon="email"
              size="md"
              padding="sm"
            />
          </div>
        </div>

        <div class="text-caption text-grey-6 q-mb-sm">
          {{ $t("Copyright") }}
        </div>
      </div>
    </q-footer>
  </q-layout>
</template>

<script>
import { defineComponent, computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import { LocalStorage, Notify, openURL } from "quasar";
import { URLS } from "../util/constants";

import LogInDialog from "../components/LogInDialog";
import UserMenu from "../components/UserMenu";
import SmoothReflow from "../components/SmoothReflow";

const CHAIN_ID = parseInt(process.env.chainID, 10);

export default defineComponent({
  name: "MainLayout",

  components: { LogInDialog, UserMenu, SmoothReflow },

  setup() {
    const router = useRouter();
    const store = useStore();
    const { t } = useI18n({ useScope: "global" });

    const discord = () => {
      openURL(URLS.DISCORD);
    };
    const twitter = () => {
      openURL(URLS.TWITTER);
    };
    const contact = () => {
      openURL(URLS.CONTACT);
    };

    const isInitialized = ref(false);

    const isLoggedIn = computed(() => Boolean(store.state.web3.user));

    const showLogIn = computed(() =>
      Boolean(
        (router.currentRoute.value.meta.requiresWeb3 && !isLoggedIn.value) ||
          (router.currentRoute.value.meta.requiresAdmin &&
            !store.state.web3.isAdmin)
      )
    );

    const incorrectChain = computed(() => store.state.web3.chain !== CHAIN_ID);

    const correctChain = computed(() => t("networks." + CHAIN_ID));

    router.beforeEach(async (to) => {
      if (
        to.meta.requiresWeb3 &&
        isLoggedIn.value &&
        !store.state.web3.initialized &&
        !store.state.web3.initializing
      ) {
        await store.dispatch("enableWeb3");
      }
      return true;
    });

    const nav = [
      {
        label: "About Us",
        href: URLS.ABOUT_US,
        attrs: { target: "_blank" },
      },
      {
        label: "Podcast",
        href: URLS.PODCAST,
        attrs: { target: "_blank" },
      },
      {
        label: "Blog",
        href: URLS.BLOG,
        attrs: { target: "_blank" },
      },
      {
        label: "Events",
        href: URLS.EVENTS,
        attrs: { target: "_blank" },
      },
      {
        label: "Contact",
        href: URLS.CONTACT,
        attrs: { target: "_blank" },
      },
      {
        label: "Privacy",
        route: { name: "privacy" },
        attrs: {
          class: "text-grey-7",
        },
      },
      {
        label: "Terms",
        route: { name: "terms" },
        attrs: {
          class: "text-grey-7",
        },
      },
    ];

    if (
      router.currentRoute.value.meta.requiresWeb3 &&
      isLoggedIn.value &&
      !store.state.web3.initialized &&
      !store.state.web3.initializing
    ) {
      store.dispatch("enableWeb3").then(() => {
        isInitialized.value = true;
      });
    } else {
      isInitialized.value = true;
    }

    onMounted(() => {
      if (!LocalStorage.has("privacy")) {
        Notify.create({
          message: t("warning.cookies"),
          timeout: 0,
          position: "bottom",
          multiLine: true,
          actions: [
            {
              label: t("Privacy"),
              color: "accent",
              noDismiss: true,
              handler() {
                router.push({ name: "privacy" });
              },
            },
            {
              label: t("Terms"),
              color: "accent",
              noDismiss: true,
              handler() {
                router.push({ name: "terms" });
              },
            },
            { label: t("Accept"), color: "primary" },
          ],
          onDismiss: () => {
            LocalStorage.set("privacy", "accepted");
          },
        });
      }
    });

    return {
      discord,
      twitter,
      contact,
      isInitialized,
      isLoggedIn,
      incorrectChain,
      correctChain,
      showLogIn,
      nav,
    };
  },
});
</script>
