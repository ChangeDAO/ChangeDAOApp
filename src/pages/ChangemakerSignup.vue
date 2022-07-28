<template>
  <q-page class="page-changemaker-signup">
    <div class="banner q-layout-padding"></div>
    <div class="q-layout-padding">
      <div class="avatar square"></div>
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
              <q-item-label class="non-selectable">
                {{ shortAddr(address) }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <!-- First Name -->
              <q-input
                v-model="data.firstName"
                :label="$t('First Name')"
                :rules="[required]"
                hide-bottom-space
              />
            </q-item-section>
            <q-item-section>
              <!-- Last Name -->
              <q-input
                v-model="data.lastName"
                :label="$t('Last Name')"
                :rules="[required]"
                hide-bottom-space
              />
            </q-item-section>
          </q-item>

          <!-- Username -->
          <q-input
            v-model="data.username"
            :label="$t('Username')"
            :rules="[required]"
            hide-bottom-space
            item-aligned
          />

          <!-- Display Name -->
          <q-input
            v-model="data.displayName"
            :label="$t('Display Name')"
            :rules="[required]"
            hide-bottom-space
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

          <!-- Email Address -->
          <q-item>
            <q-item-section>
              <q-input
                v-model="data.email"
                :label="$t('Email Address')"
                :rules="[isEmailValid]"
                :hint="$t('hint.emailForContactOnly')"
              />
            </q-item-section>
          </q-item>
        </q-list>

        <!-- Second Column -->
        <q-list class="page-col col">
          <!-- Twitter -->
          <q-input
            v-model="data.twitter"
            :label="$t('Twitter')"
            :prefix="SOCIAL_URLS.TWITTER"
            placeholder="YourUsername"
            item-aligned
          >
            <template v-slot:prepend>
              <q-icon name="twitter" />
            </template>
          </q-input>

          <!-- Discord -->
          <q-input
            v-model="data.discord"
            :label="$t('Discord')"
            :prefix="SOCIAL_URLS.DISCORD"
            placeholder="InviteCode"
            item-aligned
          >
            <template v-slot:prepend>
              <q-icon name="discord" />
            </template>
          </q-input>

          <!-- Instagram -->
          <q-input
            v-model="data.instagram"
            :label="$t('Instagram')"
            :prefix="SOCIAL_URLS.INSTAGRAM"
            placeholder="YourUsername"
            item-aligned
          >
            <template v-slot:prepend>
              <q-icon name="instagram" />
            </template>
          </q-input>

          <!-- YouTube -->
          <q-input
            v-model="data.youtube"
            :label="$t('YouTube')"
            :prefix="SOCIAL_URLS.YOUTUBE"
            placeholder="YourChannel"
            item-aligned
          >
            <template v-slot:prepend>
              <q-icon name="youtube" />
            </template>
          </q-input>

          <!-- Website URL -->
          <q-input
            v-model="data.website"
            :label="$t('Website URL')"
            prefix="https://"
            item-aligned
          >
            <template v-slot:prepend>
              <q-icon name="website" />
            </template>
          </q-input>
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
    background-color: $img-bg;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    height: 288px;
  }

  .avatar {
    background-color: $grey-9;
    width: 350px;
    max-width: 100%;
    margin-top: -190px;
  }
}
</style>

<script>
import { computed, ref, watch } from "vue";
import { useStore } from "vuex";
import { LocalStorage } from "quasar";
import { debounce, isEqual } from "lodash";
import Moralis from "moralis";

import { SOCIAL_URLS } from "../util/constants";
import { notifyError, notifySuccess } from "../util/notify";
import { EMAIL_FORMAT, shortAddr } from "../util/formatting";
import AddrAvatar from "../components/AddrAvatar";

const LOCALSTORAGE_KEY = "changemakerSignup";

const REQUEST = {
  firstName: "",
  lastName: "",
  username: "",
  displayName: "",
  shortBio: "",
  longBio: "",
  email: "",
  twitter: "",
  discord: "",
  instagram: "",
  youtube: "",
  website: "",
};

export default {
  name: "PageChangemakerSignup",

  components: { AddrAvatar },

  setup() {
    const store = useStore();

    const address = computed(() => store.state.web3.userAddress);

    const data = ref(LocalStorage.getItem(LOCALSTORAGE_KEY) || { ...REQUEST });

    const required = (a) => Boolean(a && a.trim());

    const isEmailValid = (email) => EMAIL_FORMAT.test(email);

    const isValid = computed(
      () =>
        address.value &&
        data.value.firstName &&
        data.value.lastName &&
        data.value.username &&
        data.value.displayName &&
        isEmailValid(data.value.email)
    );

    watch(
      data,
      debounce((value) => {
        if (isEqual(value, REQUEST)) {
          LocalStorage.remove(LOCALSTORAGE_KEY);
        } else {
          LocalStorage.set(LOCALSTORAGE_KEY, {
            ...value,
            address: address.value,
          });
        }
      }, 1000),
      { deep: true }
    );

    const isSubmitting = ref(false);
    const submit = async () => {
      try {
        isSubmitting.value = true;
        await Moralis.Cloud.run("createChangemakerRequest", data.value);
        notifySuccess("Success");
        // clear();
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
      required,
      isSubmitting,
      isEmailValid,
      isValid,
      SOCIAL_URLS,
    };
  },
};
</script>
