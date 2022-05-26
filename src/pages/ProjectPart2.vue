<template>
  <q-list v-if="data">
    <!-- Mint Price -->
    <q-input
      v-model="data._mintPrice"
      :label="'Mint Price (USD)'"
      :rules="[Boolean]"
      prefix="$"
      item-aligned
    />

    <!-- Total Mints -->
    <q-input
      v-model.number="data._totalMints"
      :label="'Total Mints'"
      :rules="[Boolean]"
      type="number"
      :min="1"
      item-aligned
    />

    <!-- Max Mint Amount Public -->
    <q-input
      v-model.number="data._maxMintAmountPublic"
      :label="'Max Mints per Transaction'"
      :rules="[Boolean]"
      type="number"
      :min="1"
      :max="20"
      item-aligned
    />

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
          v-model.number="data._maxMintAmountRainbow"
          :label="'Max Mints per Transaction for Rainbow List'"
          :rules="[Boolean]"
          type="number"
          :min="1"
          :max="20"
          item-aligned
        />

        <!-- Rainbow Duration -->
        <q-input
          v-model="data._rainbowDuration"
          :label="'Rainbow Period Duration (seconds)'"
          :rules="[Boolean]"
          item-aligned
        />

        <!-- Rainbow Merkle Root -->
        <q-input
          v-model="data._rainbowMerkleRoot"
          :label="'Rainbow Merkle Root'"
          :rules="[Boolean]"
          item-aligned
        />
      </div>
      <div v-else>
        <!-- Courtesy Mint Duration -->
        <q-input
          v-model="data._rainbowDuration"
          :label="'Courtesy Mint Duration (seconds)'"
          :rules="[Boolean]"
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

    const isValid = computed(
      () =>
        address.value &&
        data.value._changeDaoNFTClone &&
        data.value._fundingPSClone &&
        data.value._mintPrice &&
        data.value._totalMints &&
        data.value._maxMintAmountPublic &&
        data.value._rainbowDuration &&
        (!data.value.hasRainbow ||
          (data.value._maxMintAmountRainbow && data.value._rainbowMerkleRoot))
    );

    // Reset
    const defaultModel = ref(cloneDeep(REQUEST));

    const reset = (clear = false) => {
      if (clear) {
        data.value = cloneDeep(defaultModel.value);
      } else {
        data.value =
          LocalStorage.getItem(LOCALSTORAGE_KEY) ||
          cloneDeep(defaultModel.value);

        // Preserve contract addresses from Part 1
        if (data.value) {
          if (data.value._changeDaoNFTClone) {
            defaultModel.value._changeDaoNFTClone =
              data.value._changeDaoNFTClone;
          }
          if (data.value._fundingPSClone) {
            defaultModel.value._fundingPSClone = data.value._fundingPSClone;
          }
        }
      }
    };

    onMounted(() => {
      reset();
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
      reset,
      isValid
    };
  }
};
</script>
