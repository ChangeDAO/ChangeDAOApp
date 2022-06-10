<template>
  <q-page class="page-changemaker-signup">
    <div class="banner q-layout-padding"></div>
    <div class="q-layout-padding">
      <div class="avatar"></div>
      <div class="row q-my-xl">
        <q-list class="page-col col">
          <!-- Wallet Address -->
          <q-item v-if="address">
            <q-item-section side>
              <AddrAvatar :address="address" />
            </q-item-section>
            <q-item-section>
              <q-item-label caption>
                {{ $t("Wallet Address") }}
              </q-item-label>
              <q-item-label>
                {{ shortAddr(address) }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-else>
            <LogIn />
          </q-item>

          <q-item>
            <q-item-section>
              <!-- First Name -->
              <q-input v-model="data.firstName" :label="$t('First Name')" />
            </q-item-section>
            <q-item-section>
              <!-- Last Name -->
              <q-input v-model="data.lastName" :label="$t('Last Name')" />
            </q-item-section>
          </q-item>

          <!-- Username -->
          <q-input
            v-model="data.username"
            :label="$t('Username')"
            item-aligned
          />

          <!-- Display Name -->
          <q-input
            v-model="data.displayName"
            :label="$t('Display Name')"
            item-aligned
          />

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
        </q-list>

        <!-- Second Column -->
        <q-list class="page-col col">
          <!-- Twitter -->
          <q-input v-model="data.twitter" :label="$t('Twitter')" item-aligned />

          <!-- Discord -->
          <q-input v-model="data.discord" :label="$t('Discord')" item-aligned />

          <!-- Instagram -->
          <q-input
            v-model="data.instagram"
            :label="$t('Instagram')"
            item-aligned
          />

          <!-- TikTok -->
          <q-input v-model="data.tiktok" :label="$t('TikTok')" item-aligned />

          <!-- YouTube -->
          <q-input v-model="data.youtube" :label="$t('YouTube')" item-aligned />

          <!-- Website URL -->
          <q-input
            v-model="data.website"
            :label="$t('Website URL')"
            item-aligned
          />
        </q-list>
      </div>

      <!-- Submit -->
      <q-item class="q-my-xl">
        <q-item-section>
          <q-item-label>
            <div class="row q-gutter-md justify-end">
              <q-btn @click="clear" :label="$t('Reset')" color="secondary" />
              <q-btn
                @click="submit"
                :label="$t('Submit')"
                :loading="isSubmitting"
                :disable="!isValid"
                color="primary"
              />
            </div>
          </q-item-label>
        </q-item-section>
      </q-item>
    </div>
  </q-page>
</template>

<style lang="scss">
.page-changemaker-signup {
  .banner {
    background-color: $separator-dark-color;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    height: 288px;
  }

  .avatar {
    background-color: $dark;
    width: 350px;
    max-width: 100%;
    margin-top: -190px;

    &:after {
      content: "";
      display: block;
      padding-bottom: 100%;
    }
  }
}
</style>

<script>
import { computed, ref, watch } from "vue";
import { useStore } from "vuex";
import { LocalStorage } from "quasar";
import { isEqual } from "lodash";
import Moralis from "moralis";

import { notifyError, notifySuccess } from "../util/notify";
import { shortAddr } from "../util/formatting";
import AddrAvatar from "../components/AddrAvatar";
import LogIn from "../components/LogIn";

const LOCALSTORAGE_KEY = "changemakerSignup";

const REQUEST = {
  firstName: "",
  lastName: "",
  username: "",
  displayName: "",
  shortBio: "",
  longBio: "",
  creatingChangeBy: "",
  twitter: "",
  discord: "",
  instagram: "",
  tiktok: "",
  youtube: "",
  website: ""
};

export default {
  name: "PageChangemakerSignup",

  components: { AddrAvatar, LogIn },

  setup() {
    const store = useStore();

    const address = computed(() => store.state.web3.userAddress);

    const data = ref(LocalStorage.getItem(LOCALSTORAGE_KEY) || { ...REQUEST });

    const isValid = computed(
      () =>
        address.value &&
        data.value.firstName &&
        data.value.lastName &&
        data.value.username &&
        data.value.displayName
    );

    watch(
      data,
      value => {
        if (isEqual(value, REQUEST)) {
          LocalStorage.remove(LOCALSTORAGE_KEY);
        } else {
          LocalStorage.set(LOCALSTORAGE_KEY, {
            ...value,
            address: address.value
          });
        }
      },
      { deep: true }
    );

    const isSubmitting = ref(false);
    const submit = async () => {
      try {
        isSubmitting.value = true;
        await Moralis.Cloud.run("createChangemakerRequest", data.value);
        LocalStorage.remove(LOCALSTORAGE_KEY);
        notifySuccess("Success");
      } catch (error) {
        notifyError(error.error || error);
      } finally {
        isSubmitting.value = false;
      }
    };

    const clear = () => {
      data.value = { ...REQUEST };
    };

    return {
      shortAddr,
      address,
      data,
      submit,
      clear,
      isSubmitting,
      isValid
    };
  }
};
</script>
