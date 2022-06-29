<template>
  <q-list v-if="data">
    <!-- Cover Image -->
    <q-item-label header>{{ $t("Project Image") }}</q-item-label>
    <ImageInput v-model="data.coverImage" :disable="disable" square />

    <!-- Name -->
    <q-input
      v-model="data._projectName"
      :label="$t('Project Name')"
      :rules="[required]"
      :disable="disable"
      item-aligned
    />

    <!-- Description -->
    <q-input
      v-model="data.description"
      :label="$t('Description')"
      :rules="[required]"
      :disable="disable"
      item-aligned
      autogrow
    />

    <!-- Movement -->
    <q-input
      v-model="data._movementName"
      :label="$t('Movement')"
      :rules="[required]"
      :disable="disable"
      item-aligned
    />

    <!-- Area of Change -->
    <q-select
      v-model="data.areaOfChange"
      :label="$t('Area of Change')"
      :options="areasOfChange"
      :rules="[Boolean]"
      :disable="disable"
      emit-value
      :display-value="
        data.areaOfChange ? $t('areasOfChange.' + data.areaOfChange) : ''
      "
      item-aligned
    />

    <!-- Base URI -->
    <q-input
      v-model="data._baseURI"
      :label="$t('Content Identifier')"
      :disable="disable"
      prefix="ipfs://"
      suffix="/"
      placeholder="bafybeig3cvnu57c5tvnz6wrdd72d6hcin3fhjaghznb3qdvnglhd53vvqe"
      :rules="[validCid]"
      hide-bottom-space
      item-aligned
    />

    <q-separator spaced />

    <!-- Creator Addresses -->
    <AddrInputs
      :addresses="data._creators"
      :label="$t('Wallet Address')"
      :limit="maxPayees"
      :disable="disable"
    >
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
      :limit="maxPayees"
      :payees="data._fundingPayees"
      :shares="data._fundingShares"
      :total-shares="fundingShares"
      :disable="disable"
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
            <q-item-label> ChangeDAO </q-item-label>
          </q-item-section>
          <q-item-section side> {{ changeDaoFunding / 100 }}% </q-item-section>
        </q-item>
      </template>
    </PaymentSplitInput>

    <q-separator spaced />

    <!-- Royalties Splitting -->
    <PaymentSplitInput
      ref="royaltiesSplitter"
      :limit="maxPayees"
      :payees="data._royaltiesPayees"
      :shares="data._royaltiesShares"
      :total-shares="royaltiesShares"
      :disable="disable"
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
            <q-item-label> ChangeDAO </q-item-label>
          </q-item-section>
          <q-item-section side>
            {{ changeDaoRoyalties / 100 }}%
          </q-item-section>
        </q-item>
      </template>
    </PaymentSplitInput>
  </q-list>
</template>

<script>
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
import { LocalStorage } from "quasar";
import { cloneDeep, debounce, isEqual } from "lodash";
import FundingAllocations from "../../contracts/deployments/mainnet/FundingAllocations.json";
import Moralis from "moralis";

import { AREAS_OF_CHANGE } from "../util/constants";
import { CID_FORMAT } from "../util/formatting";
import AddrInputs from "../components/AddrInputs";
import ImageInput from "../components/ImageInput";
import PaymentSplitInput from "../components/PaymentSplitInput";

import { LOCALSTORAGE_KEY1, REQUEST1 } from "./ProjectCreate";

export default {
  name: "PageProjectPart1",

  components: { AddrInputs, ImageInput, PaymentSplitInput },

  props: {
    modelValue: Object,
    disable: Boolean,
  },

  setup(props, { emit }) {
    const { t } = useI18n({ useScope: "global" });
    const store = useStore();

    const maxPayees = 35;

    const address = computed(() => store.state.web3.userAddress);

    const data = computed({
      get() {
        return props.modelValue;
      },
      set(value) {
        emit("update:modelValue", value);
      },
    });

    const coverImage = ref(null);

    const required = (a) => a.trim().length > 0;

    const validCid = (a) => required(a) && CID_FORMAT.test(a);

    const isValid = computed(
      () =>
        address.value &&
        required(data.value._projectName) &&
        required(data.value._movementName) &&
        required(data.value.description) &&
        data.value.areaOfChange &&
        data.value._creators.length &&
        data.value._royaltiesPayees.length &&
        data.value._royaltiesPayees.length ==
          data.value._royaltiesShares.length &&
        data.value._royaltiesShares.length &&
        data.value._royaltiesShares.length ==
          data.value._royaltiesShares.length &&
        validCid(data.value._baseURI)
    );

    const areasOfChange = computed(() =>
      AREAS_OF_CHANGE.map((value) => ({
        value,
        label: t("areasOfChange." + value),
      }))
    );

    // Reset
    const defaultModel = computed(() => {
      const data = cloneDeep(REQUEST1);
      if (address.value) {
        data._creators[0] = address.value;
        data._fundingPayees[0] = address.value;
        data._royaltiesPayees[0] = address.value;
        data._fundingShares[0] = fundingShares.value;
        data._royaltiesShares[0] = royaltiesShares.value;
      }
      return data;
    });

    const reset = (clear = false, complete = false) => {
      if (props.disable) {
        return false;
      }
      if (complete) {
        return LocalStorage.remove(LOCALSTORAGE_KEY1);
      } else if (clear) {
        data.value = cloneDeep(defaultModel.value);
      } else {
        data.value =
          LocalStorage.getItem(LOCALSTORAGE_KEY1) ||
          cloneDeep(defaultModel.value);
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
          functionName: "changeDaoFunding",
        }).then((result) => {
          changeDaoFunding.value = result;
        });
        Moralis.executeFunction({
          contractAddress: FundingAllocations.address,
          abi: FundingAllocations.abi,
          functionName: "changeDaoRoyalties",
        }).then((result) => {
          changeDaoRoyalties.value = result;
        });
      }
      reset();
    });

    // Backup unsaved form data
    watch(
      data,
      debounce((value, oldValue) => {
        if (isEqual(value, defaultModel.value)) {
          // Remove if default
          LocalStorage.remove(LOCALSTORAGE_KEY1);
        } else {
          LocalStorage.set(LOCALSTORAGE_KEY1, {
            ...value,
          });
        }
      }, 1000),
      { deep: true }
    );

    // Reset on user address change
    watch(address, () => reset());

    return {
      address,
      data,
      coverImage,
      reset,
      required,
      isValid,
      validCid,
      areasOfChange,
      changeDaoFunding,
      changeDaoRoyalties,
      fundingShares,
      royaltiesShares,
      maxPayees,
    };
  },
};
</script>
