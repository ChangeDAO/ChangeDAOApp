<template>
  <q-page class="page-project-edit">
    <div v-if="address" class="q-layout-padding page-col col">
      <!-- Title -->
      <div class="text-h4 q-ma-md">
        {{ $t(isNew ? "New Project" : "Edit Project") }}
      </div>

      <q-list>
        <!-- Name -->
        <q-input
          v-model="data._projectName"
          :label="$t('Project Name')"
          :rules="[Boolean]"
          item-aligned
        />

        <!-- Description -->
        <q-input
          v-model="data.description"
          :label="$t('Description')"
          :rules="[Boolean]"
          item-aligned
          autogrow
        />

        <!-- Movement -->
        <q-input
          v-model="data._movementName"
          :label="$t('Movement')"
          :rules="[Boolean]"
          item-aligned
        />

        <!-- Area of Change -->
        <q-select
          v-model="data.areaOfChange"
          :label="$t('Area of Change')"
          :options="areasOfChange"
          :rules="[Boolean]"
          emit-value
          :display-value="
            data.areaOfChange ? $t('areasOfChange.' + data.areaOfChange) : ''
          "
          item-aligned
        />

        <!-- Base URI -->
        <q-input
          v-model="data._baseURI"
          :label="$t('Base URI')"
          :rules="[Boolean]"
          item-aligned
        />

        <q-separator spaced />

        <!-- Creator Addresses -->
        <AddrInputs :addresses="data._creators" :label="$t('Wallet Address')">
          <template v-slot:before>
            <q-item-label class="q-pb-xs" header>
              {{ $tc("Creator", data._creators.length) }}
            </q-item-label>
          </template>
        </AddrInputs>

        <q-separator spaced />

        <!-- Funding Splitting -->
        <PaymentSplitInput
          ref="fundingSplitter"
          :payees="data._fundingPayees"
          :shares="data._fundingShares"
          :total-shares="fundingShares"
        >
          <template v-slot:before>
            <q-item-label class="q-pb-xs" header>
              {{ $tc("Funding Split") }}
            </q-item-label>

            <!-- ChangeDAO Funding -->
            <q-item>
              <q-item-section side>
                <q-avatar color="primary" size="sm" />
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  ChangeDAO
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                {{ changeDaoFunding / 100 }}%
              </q-item-section>
            </q-item>
          </template>
        </PaymentSplitInput>

        <q-separator spaced />

        <!-- Royalties Splitting -->
        <PaymentSplitInput
          ref="royaltiesSplitter"
          :payees="data._royaltiesPayees"
          :shares="data._royaltiesShares"
          :total-shares="royaltiesShares"
        >
          <template v-slot:before>
            <q-item-label class="q-pb-xs" header>
              {{ $tc("Royalties Split") }}
            </q-item-label>

            <!-- ChangeDAO Royalties -->
            <q-item>
              <q-item-section side>
                <q-avatar color="primary" size="sm" />
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  ChangeDAO
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                {{ changeDaoRoyalties / 100 }}%
              </q-item-section>
            </q-item>
          </template>
        </PaymentSplitInput>
      </q-list>

      <q-separator spaced />

      <q-item class="q-my-xl">
        <q-item-section>
          <q-item-label>
            <div class="row q-gutter-md flex-center">
              <!-- Reset -->
              <q-btn
                @click="reset(true)"
                :label="$t('Reset')"
                color="secondary"
              />

              <!-- Submit -->
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
    <div v-else class="q-layout-padding">
      <LogIn />
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
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { LocalStorage } from "quasar";
import { cloneDeep, isEqual, pick } from "lodash";
import Controller from "../../../changedao_production/deployments/rinkeby/Controller.json";
import FundingAllocations from "../../../changedao_production/deployments/rinkeby/FundingAllocations.json";
import Moralis from "moralis";

import { notifyError, notifySuccess } from "../util/notify";
import { AREAS_OF_CHANGE } from "../util/constants";
import AddrInputs from "../components/AddrInputs";
import PaymentSplitInput from "../components/PaymentSplitInput";
import LogIn from "../components/LogIn";

const PARAMS = {
  _movementName: "",
  _projectName: "",
  _creators: [],
  _baseURI: "",
  _royaltiesPayees: [],
  _royaltiesShares: [],
  _fundingPayees: [],
  _fundingShares: []
};

const REQUEST = {
  ...PARAMS,
  description: "",
  areaOfChange: ""
};

const LOCALSTORAGE_KEY = "projectEdit";

export default {
  name: "PageProjectEdit",

  components: { AddrInputs, PaymentSplitInput, LogIn },

  setup() {
    const { t } = useI18n({ useScope: "global" });
    const router = useRouter();
    const store = useStore();

    const address = computed(() => store.state.web3.userAddress);

    const data = ref(null);

    const isNew = computed(
      () => router.currentRoute.value.name === "project-new"
    );

    const isValid = computed(
      () =>
        address.value &&
        data.value._projectName &&
        data.value._movementName &&
        data.value.areaOfChange &&
        data.value._creators.length &&
        data.value._royaltiesPayees.length &&
        data.value._royaltiesPayees.length ==
          data.value._royaltiesShares.length &&
        data.value._royaltiesShares.length &&
        data.value._royaltiesShares.length ==
          data.value._royaltiesShares.length &&
        data.value._baseURI
    );

    const areasOfChange = computed(() =>
      AREAS_OF_CHANGE.map(value => ({
        value,
        label: t("areasOfChange." + value)
      }))
    );

    // Reset
    const defaultModel = computed(() => {
      const data = cloneDeep(REQUEST);
      if (address.value) {
        data._creators[0] = address.value;
        data._fundingPayees[0] = address.value;
        data._royaltiesPayees[0] = address.value;
        data._fundingShares[0] = fundingShares.value;
        data._royaltiesShares[0] = royaltiesShares.value;
      }
      return data;
    });

    const reset = (clear = false) => {
      if (clear) {
        data.value = cloneDeep(defaultModel.value);
      } else {
        data.value =
          LocalStorage.getItem(LOCALSTORAGE_KEY) || cloneDeep(REQUEST);
      }
    };
    reset();

    // Submit
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

    // Get ChangeDAO shares
    const changeDaoFunding = ref(200);
    const changeDaoRoyalties = ref(2000);
    const fundingShares = computed(() => 1e4 - changeDaoFunding.value);
    const royaltiesShares = computed(() => 1e4 - changeDaoRoyalties.value);
    onMounted(() => {
      if (address.value) {
        Moralis.executeFunction({
          contractAddress: FundingAllocations.address,
          abi: FundingAllocations.abi,
          functionName: "changeDaoFunding"
        }).then(result => {
          changeDaoFunding.value = result;
        });
        Moralis.executeFunction({
          contractAddress: FundingAllocations.address,
          abi: FundingAllocations.abi,
          functionName: "changeDaoRoyalties"
        }).then(result => {
          changeDaoRoyalties.value = result;
        });

        reset();
      }
    });

    // Backup unsaved form data
    watch(
      data,
      (value, oldValue) => {
        if (isEqual(value, defaultModel.value)) {
          // Remove if default
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

    // Reset on user address change
    watch(address, () => reset());

    return {
      address,
      data,
      submit,
      reset,
      isSubmitting,
      isNew,
      isValid,
      areasOfChange,
      changeDaoFunding,
      changeDaoRoyalties,
      fundingShares,
      royaltiesShares
    };
  }
};
</script>
