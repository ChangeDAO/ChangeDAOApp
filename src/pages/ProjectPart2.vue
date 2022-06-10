<template>
  <q-list v-if="data">
    <!-- Mint Price -->
    <q-input
      v-model="data._mintPrice"
      :label="'Mint Price (USD)'"
      :rules="[Boolean]"
      :min="0"
      prefix="$"
      item-aligned
    />

    <!-- Total Mints -->
    <q-input
      v-model="data._totalMints"
      :label="'Total Mints'"
      :rules="[Boolean]"
      type="number"
      :min="1"
      item-aligned
    />

    <!-- Max Mint Amount Public -->
    <q-item>
      <q-item-section>
        <q-input
          v-model="data._maxMintAmountPublic"
          :label="'Max Mints per Transaction'"
          :rules="[a => a > 0 && a <= 20]"
          type="number"
          :min="1"
          :max="20"
          hint="Max 20"
        />
      </q-item-section>
    </q-item>

    <!-- Use Rainbow List? -->
    <q-item tag="label" clickable v-ripple>
      <q-item-section>
        <q-item-label>Use Rainbow List?</q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-toggle v-model="data.hasRainbow" />
      </q-item-section>
    </q-item>

    <SmoothReflow>
      <div v-if="data.hasRainbow">
        <!-- Max Mint Amount Rainbow -->
        <q-input
          v-model="data._maxMintAmountRainbow"
          :label="'Max Mints per Transaction for Rainbow List'"
          :rules="[a => a > 0 && a <= 20]"
          type="number"
          :min="1"
          :max="20"
          item-aligned
        />

        <!-- Rainbow Duration -->
        <q-input
          type="number"
          v-model="data._rainbowDuration"
          :label="'Rainbow Period Duration (hours)'"
          :rules="[a => a >= 0]"
          :min="0"
          item-aligned
        />

        <!-- Rainbow Merkle Root -->
        <q-item>
          <q-item-section>
            <q-input
              type="textarea"
              v-model="rainbowAddresses"
              :label="'Rainbow List Addresses'"
              :rules="[Boolean]"
              hint="One address per line"
            />
          </q-item-section>
        </q-item>
      </div>
      <div v-else>
        <!-- Courtesy Mint Duration -->
        <q-input
          type="number"
          v-model="data._rainbowDuration"
          :label="'Courtesy Mint Duration (hours)'"
          :rules="[a => a >= 0]"
          :min="0"
          item-aligned
        />
      </div>
    </SmoothReflow>
  </q-list>
</template>

<script>
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
import { LocalStorage } from "quasar";
import { cloneDeep, isEqual } from "lodash";
import Moralis from "moralis";

import SmoothReflow from "../components/SmoothReflow";

import { createMerkleRootRainbow } from "../util/merkle";

const REQUEST = {
  _changeDaoNFTClone: "", // From Part 1 event
  _fundingPSClone: "", // From Part 1 event
  _mintPrice: null, // Dollars
  _totalMints: null, // 1-Infinity
  _maxMintAmountRainbow: null, // 1-20
  _maxMintAmountPublic: null, // 1-20
  _rainbowDuration: null, // Seconds
  _rainbowMerkleRoot: "",
  projectId: "",
  transactionHash: "",
  hasRainbow: false
};

const LOCALSTORAGE_KEY = "projectPart2";

export default {
  name: "PageProjectPart2",

  components: { SmoothReflow },

  props: ["modelValue"],
  setup(props, { emit }) {
    const { t } = useI18n({ useScope: "global" });
    const store = useStore();

    const address = computed(() => store.state.web3.userAddress);

    const data = computed({
      get() {
        return props.modelValue;
      },
      set(value) {
        emit("update:modelValue", value);
      }
    });

    const rainbowAddresses = ref("");

    watch(rainbowAddresses, addresses => {
      if (addresses) {
        addresses = addresses.trim().split(/\s+/);
        data.value._rainbowMerkleRoot = createMerkleRootRainbow(addresses);
      }
    });

    const isValid = computed(
      () =>
        address.value &&
        data.value._changeDaoNFTClone &&
        data.value._fundingPSClone &&
        data.value._mintPrice &&
        data.value._totalMints &&
        data.value._maxMintAmountPublic &&
        data.value._rainbowDuration >= 0 &&
        (!data.value.hasRainbow ||
          (data.value._maxMintAmountRainbow && data.value._rainbowMerkleRoot))
    );

    // Reset
    const defaultModel = ref(cloneDeep(REQUEST));

    const reset = (clear = false) => {
      let newData;
      if (clear) {
        newData = cloneDeep(defaultModel.value);
      } else {
        newData = LocalStorage.getItem(LOCALSTORAGE_KEY);
        if (newData) {
          // Preserve data from Part 1
          if (newData.projectId) {
            defaultModel.value.projectId = newData.projectId;
          }
          if (newData._changeDaoNFTClone) {
            defaultModel.value._changeDaoNFTClone = newData._changeDaoNFTClone;
          }
          if (newData._fundingPSClone) {
            defaultModel.value._fundingPSClone = newData._fundingPSClone;
          }
        } else {
          // Restore data from Part 1
          newData = cloneDeep(REQUEST);
          newData.projectId = defaultModel.value.projectId;
          newData._changeDaoNFTClone = defaultModel.value._changeDaoNFTClone;
          newData._fundingPSClone = defaultModel.value._fundingPSClone;
        }
      }
      data.value = newData;
    };

    onMounted(() => {
      reset();
    });

    // Backup unsaved form data
    watch(
      data,
      newData => {
        if (isEqual(newData, REQUEST)) {
          // Remove if default
          LocalStorage.remove(LOCALSTORAGE_KEY);
        } else {
          LocalStorage.set(LOCALSTORAGE_KEY, {
            ...newData
          });

          // Preserve data from Part 1
          if (newData.projectId) {
            defaultModel.value.projectId = newData.projectId;
          }
          if (newData._changeDaoNFTClone) {
            defaultModel.value._changeDaoNFTClone = newData._changeDaoNFTClone;
          }
          if (newData._fundingPSClone) {
            defaultModel.value._fundingPSClone = newData._fundingPSClone;
          }
        }
      },
      { deep: true }
    );

    // Reset on user address change
    watch(address, () => reset());

    return {
      address,
      data,
      rainbowAddresses,
      reset,
      isValid
    };
  }
};
</script>
