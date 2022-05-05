<template>
  <q-page class="page-project-edit">
    <div class="q-layout-padding">
      <!-- Title -->
      <div class="text-h4 q-ma-md">
        {{ $t(isNew ? "New Project" : "Edit Project") }}
      </div>

      <div class="row q-my-xl">
        <q-list class="page-col col">
          <!-- Wallet Address -->
          <q-item v-if="address">
            <q-item-section side>
              <AddrAvatar :value="address" />
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

          <!-- Name -->
          <q-input
            v-model="data._projectName"
            :label="$t('Project Name')"
            item-aligned
          />

          <!-- Description -->
          <q-input
            v-model="data.description"
            :label="$t('Description')"
            item-aligned
            autogrow
          />

          <!-- Movement -->
          <q-input
            v-model="data._movementName"
            :label="$t('Movement')"
            item-aligned
          />

          <!-- Creator Addresses -->
          <AddrInputs v-model="data._creators" :label="$t('Wallet Address')">
            <template v-slot:before>
              <q-item-label class="q-pb-xs" header>
                {{ $tc("Creator", data._creators.length) }}
              </q-item-label>
            </template>
          </AddrInputs>
        </q-list>

        <!-- Second Column -->
        <q-list class="page-col col">
          <!-- Project Hero -->
        </q-list>
      </div>

      <!-- Payment Splitting -->

      <!-- Gallery -->

      <div class="row q-my-xl">
        <q-list class="page-col col">
          <!-- Images -->

          <!-- Video URL -->
          <q-input v-model="data.video" :label="$t('Video URL')" item-aligned />
        </q-list>

        <!-- Second Column -->
        <q-list class="page-col col">
          <!-- Gallery Preview -->
        </q-list>
      </div>

      <!-- Submit -->
      <q-item class="q-my-xl">
        <q-item-section>
          <q-item-label>
            <div class="row q-gutter-md flex-center">
              <q-btn
                @click="submit"
                :label="$t('Submit')"
                :loading="isSubmitting"
                :disable="!isValid"
                color="primary"
              />
              <q-btn @click="clear" :label="$t('Reset')" color="secondary" />
            </div>
          </q-item-label>
        </q-item-section>
      </q-item>
    </div>
  </q-page>
</template>

<style lang="scss">
.page-project-edit {
  .banner {
    background-color: $separator-dark-color;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    height: 288px;
  }
}
</style>

<script>
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { LocalStorage } from "quasar";
import { isEqual, pick } from "lodash";
import Controller from "../../../changedao_production/deployments/rinkeby/Controller.json";
import Moralis from "moralis";

import { notifyError, notifySuccess } from "../util/notify";
import { shortAddr } from "../util/formatting";
import AddrAvatar from "../components/AddrAvatar";
import AddrInputs from "../components/AddrInputs";
import LogIn from "../components/LogIn";

const PARAMS = {
  _movementName: "",
  _projectName: "",
  _creators: [""],
  _baseURI: "",
  _royaltiesPayees: "",
  _royaltiesShares: "",
  _fundingPayees: "",
  _fundingShares: ""
};

const REQUEST = {
  ...PARAMS,
  description: ""
};

const LOCALSTORAGE_KEY = "projectEdit";

export default {
  name: "PageChangemakerSignup",

  components: { AddrAvatar, AddrInputs, LogIn },

  setup() {
    const router = useRouter();

    const store = useStore();

    const address = computed(() => store.state.web3.userAddress);

    const data = ref(LocalStorage.getItem(LOCALSTORAGE_KEY) || { ...REQUEST });

    const isNew = computed(
      () => router.currentRoute.value.name === "project-new"
    );

    const isValid = computed(() => address.value && data.value._projectName);

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
        const tx = await Moralis.executeFunction({
          contractAddress: Controller.address,
          abi: Controller.abi,
          functionName: "createNFTAndPSClones",
          params: pick(data.value, Object.keys(PARAMS))
        });
        // await Moralis.Cloud.run("createNFTAndPSClones", data.value);
        const response = await tx.wait();
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
      isNew,
      isValid
    };
  }
};
</script>
