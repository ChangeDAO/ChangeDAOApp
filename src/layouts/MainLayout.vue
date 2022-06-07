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
        <SearchBar v-if="$q.screen.gt.xs" />
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

    <q-dialog v-model="dialogEmail">
      <q-card>
        <q-card-section class="text-h4">
          {{ $t("Get Email Updates") }}
        </q-card-section>

        <q-separator />

        <q-form @submit="submitEmail" @reset="email = ''">
          <q-card-section>
            <q-input
              v-model="email"
              :label="$t('Email Address')"
              :hint="$t('emailPrivacy')"
              type="email"
              name="email"
            />
          </q-card-section>

          <q-card-actions align="right">
            <q-btn type="reset" :label="$t('Cancel')" flat v-close-popup />
            <q-btn
              :label="$t('Submit')"
              type="submit"
              color="primary"
              :flat="!isEmailValid"
              :disabled="!isEmailValid"
              :loading="isSubmitting"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script>
import { defineComponent, computed, ref } from "vue";
import { openURL } from "quasar";
import { notifyError } from "../util/notify";

import UserMenu from "../components/UserMenu";
import SearchBar from "../components/SearchBar";

export const EMAIL_FORMAT = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default defineComponent({
  name: "MainLayout",

  components: { UserMenu, SearchBar },

  setup() {
    const dialogEmail = ref(false);
    const email = ref("");
    const isEmailValid = computed(() => EMAIL_FORMAT.test(email.value));

    const isSubmitting = ref(false);
    const submitEmail = async () => {
      try {
        isSubmitting.value = true;
        await fetch(
          "https://getform.io/f/664280cb-7478-486f-8945-4cc9d819e88a",
          {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            body: JSON.stringify({})
          }
        );
        dialogEmail.value = false;
        email.value = "";
      } catch (error) {
        console.error(error);
        notifyError(error);
      } finally {
        isSubmitting.value = false;
      }
    };

    const discord = () => {
      openURL("https://discord.gg/88KeENZnyQ");
    };
    const twitter = () => {
      openURL("https://twitter.com/ChangeDAO");
    };

    return {
      dialogEmail,
      email,
      isEmailValid,
      isSubmitting,
      submitEmail,
      discord,
      twitter
    };
  }
});
</script>
