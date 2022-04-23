<template>
  <q-page padding>
    <q-list>
      <!-- Wallet Address -->
      <q-item>
        <q-item-section>
          <q-item-label caption>
            {{ $t("Wallet Address") }}
          </q-item-label>
          <q-item-label>
            {{ address }}
          </q-item-label>
        </q-item-section>
      </q-item>

      <!-- First Name -->
      <q-input
        v-model="data.firstName"
        :label="$t('First Name')"
        item-aligned
      />

      <!-- Last Name -->
      <q-input v-model="data.lastName" :label="$t('Last Name')" item-aligned />

      <!-- Username -->
      <q-input v-model="data.username" :label="$t('Username')" item-aligned />

      <!-- Short Bio -->
      <q-input
        v-model="data.shortBio"
        :label="$t('Short Bio')"
        autogrow
        item-aligned
      />

      <!-- Long Bio -->
      <q-input
        v-model="data.longBio"
        :label="$t('Long Bio')"
        autogrow
        item-aligned
      />

      <!-- Creating Change By -->
      <q-input
        v-model="data.creatingChangeBy"
        :label="$t('Creating Change By')"
        autogrow
        item-aligned
      />

      <!-- Twitter -->
      <q-input v-model="data.twitter" :label="$t('Twitter')" item-aligned />

      <!-- Discord -->
      <q-input v-model="data.discord" :label="$t('Discord')" item-aligned />

      <!-- Instagram -->
      <q-input v-model="data.instagram" :label="$t('Instagram')" item-aligned />

      <!-- TikTok -->
      <q-input v-model="data.tiktok" :label="$t('TikTok')" item-aligned />

      <!-- YouTube -->
      <q-input v-model="data.youtube" :label="$t('YouTube')" item-aligned />

      <!-- Portfolio URL -->
      <q-input
        v-model="data.website"
        :label="$t('Portfolio URL')"
        item-aligned
      />

      <!-- Submit -->
      <q-item>
        <q-item-section>
          <q-btn
            @click="submit"
            :label="$t('Submit')"
            :loading="isSubmitting"
            color="primary"
          />
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script>
import { computed, ref, watch } from "vue";
import { useStore } from "vuex";
import { LocalStorage, useQuasar } from "quasar";
import Moralis from "moralis";

import { notifyError } from "../util/notify";

const LOCALSTORAGE_KEY = "changemakerSignup";

export default {
  name: "PageSignup",
  setup() {
    const $q = useQuasar();

    const store = useStore();

    const address = computed(() => store.state.web3.userAddress);

    const data = ref(
      LocalStorage.getItem(LOCALSTORAGE_KEY) || {
        firstName: "",
        lastName: "",
        username: "",
        shortBio: "",
        longBio: "",
        creatingChangeBy: "",
        twitter: "",
        discord: "",
        instagram: "",
        tiktok: "",
        youtube: "",
        website: ""
      }
    );

    watch(
      data,
      value => {
        LocalStorage.set(LOCALSTORAGE_KEY, value);
      },
      { deep: true }
    );

    const isSubmitting = ref(false);
    const submit = async () => {
      try {
        isSubmitting.value = true;
        await Moralis.Cloud.run("createChangemakerRequest", data.value);
        LocalStorage.remove(LOCALSTORAGE_KEY);
      } catch (error) {
        notifyError(error);
      } finally {
        isSubmitting.value = false;
      }
    };

    return {
      address,
      data,
      submit,
      isSubmitting
    };
  }
};
</script>
