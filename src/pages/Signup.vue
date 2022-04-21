<template>
  <q-page padding>
    <!-- Wallet Address -->
    {{ address }}

    <!-- First Name -->
    <q-input v-model="data.firstName" :label="$t('First Name')" />

    <!-- Last Name -->
    <q-input v-model="data.lastName" :label="$t('Last Name')" />

    <!-- Username -->
    <q-input v-model="data.username" :label="$t('Username')" />

    <!-- Short Bio -->
    <q-input v-model="data.shortBio" :label="$t('Short Bio')" />

    <!-- Long Bio -->
    <q-input v-model="data.longBio" :label="$t('Long Bio')" />

    <!-- Creating Change By -->
    <q-input
      v-model="data.creatingChangeBy"
      :label="$t('Creating Change By')"
    />

    <!-- Twitter -->
    <q-input v-model="data.twitter" :label="$t('Twitter')" />

    <!-- Discord -->
    <q-input v-model="data.discord" :label="$t('Discord')" />

    <!-- Instagram -->
    <q-input v-model="data.instagram" :label="$t('Instagram')" />

    <!-- TikTok -->
    <q-input v-model="data.tiktok" :label="$t('TikTok')" />

    <!-- YouTube -->
    <q-input v-model="data.youtube" :label="$t('YouTube')" />

    <!-- Portfolio URL -->
    <q-input v-model="data.website" :label="$t('Portfolio URL')" />

    <!-- Submit -->
    <q-btn @click="submit" :label="$t('Submit')" color="primary" />
  </q-page>
</template>

<script>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import Moralis from "moralis";

export default {
  name: "PageSignup",
  setup() {
    const store = useStore();

    const address = computed(() => store.state.web3.userAddress);

    const data = ref({
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
    });

    const submit = () => {
      Moralis.cloud.run("createChangemakerRequest", data.value);
    };

    return {
      address,
      data,
      submit
    };
  }
};
</script>
