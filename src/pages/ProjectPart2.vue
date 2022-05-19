<template>
  <q-list v-if="data">
    <!-- Mint Price -->
    <q-input
      v-model="data._mintPrice"
      :label="'Mint Price'"
      :rules="[Boolean]"
      item-aligned
    />

    <!-- Total Mints -->
    <q-input
      v-model="data._totalMints"
      :label="'Total Mints'"
      :rules="[Boolean]"
      item-aligned
    />

    <!-- Max Mint Amount Rainbow -->
    <q-input
      v-model="data._maxMintAmountRainbow"
      :label="'Max Mint Amount Rainbow'"
      :rules="[Boolean]"
      item-aligned
    />

    <!-- Max Mint Amount Public -->
    <q-input
      v-model="data._maxMintAmountPublic"
      :label="'Max Mint Amount Public'"
      :rules="[Boolean]"
      item-aligned
    />

    <!-- Rainbow Duration -->
    <q-input
      v-model="data._rainbowDuration"
      :label="'Rainbow Duration'"
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

    <!-- Rainbow CID -->
    <q-input
      v-model="data._rainbowCID"
      :label="'Rainbow CID'"
      :rules="[Boolean]"
      item-aligned
    />
  </q-list>
</template>

<script>
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
import { LocalStorage } from "quasar";
import { cloneDeep, isEqual } from "lodash";
import Moralis from "moralis";

const REQUEST = {
  _changeDaoNFTClone: "", // From Part 1 event
  _fundingPSClone: "", // From Part 1 event
  _mintPrice: null, // Dollars
  _totalMints: null, // 1-Infinity
  _maxMintAmountRainbow: null, // 1-20
  _maxMintAmountPublic: null, // 1-20
  _rainbowDuration: null, // Seconds
  _rainbowMerkleRoot: "",
  _rainbowCID: "",
  projectId: "",
  transactionHash: ""
};

const LOCALSTORAGE_KEY = "projectPart2";

export default {
  name: "PageProjectPart2",

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
        data.value._maxMintAmountRainbow &&
        data.value._maxMintAmountPublic &&
        data.value._rainbowDuration &&
        data.value._rainbowMerkleRoot &&
        data.value._rainbowCID
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
