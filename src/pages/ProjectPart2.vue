<template>
  <q-list v-if="data">
    <!-- Mint Price -->
    <q-item>
      <q-item-section>
        <q-input
          v-model.number="data._mintPrice"
          :label="'Mint Price (USD)'"
          :rules="[(a) => a >= 0]"
          :min="0"
          prefix="$"
        />
      </q-item-section>
    </q-item>

    <!-- Total Mints -->
    <q-item>
      <q-item-section>
        <q-input
          v-model.number="data._totalMints"
          :label="'Total Mints'"
          :rules="[Boolean]"
          type="number"
          :min="1"
        />
      </q-item-section>
    </q-item>

    <!-- Max Mint Amount Public -->
    <q-item>
      <q-item-section>
        <q-input
          v-model.number="data._maxMintAmountPublic"
          :label="'Max Mints per Transaction'"
          :rules="[(a) => a > 0 && a <= 20 && a <= data._totalMints]"
          type="number"
          :min="1"
          :max="Math.min(20, data._totalMints)"
          :hint="$tc('hint.max', Math.min(20, data._totalMints || 20))"
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
        <q-item>
          <q-item-section>
            <q-input
              v-model.number="data._maxMintAmountRainbow"
              :label="'Max Mints per Transaction for Rainbow List'"
              :rules="[(a) => a > 0 && a <= 20 && a <= data._totalMints]"
              type="number"
              :min="1"
              :max="Math.min(20, data._totalMints)"
              :hint="$tc('hint.max', Math.min(20, data._totalMints || 20))"
            />
          </q-item-section>
        </q-item>

        <!-- Rainbow Duration -->
        <q-item>
          <q-item-section>
            <q-input
              type="number"
              v-model.number="data._rainbowDuration"
              :label="'Rainbow Period Duration (hours)'"
              :rules="[(a) => a >= 0]"
              :min="0"
            />
          </q-item-section>
        </q-item>

        <!-- Rainbow Addresses -->
        <q-item>
          <q-item-section>
            <q-input
              type="textarea"
              v-model="rainbowAddresses"
              :label="'Rainbow List Addresses'"
              :rules="[Boolean, () => rainbowAddrValid]"
              :hint="$t('hint.rainbowAddresses')"
            />
          </q-item-section>
        </q-item>
      </div>
      <div v-else>
        <!-- Courtesy Mint Duration -->
        <q-item>
          <q-item-section>
            <q-input
              type="number"
              v-model.number="data._rainbowDuration"
              :label="'Courtesy Mint Duration (hours)'"
              :rules="[(a) => a >= 0]"
              :min="0"
            />
          </q-item-section>
        </q-item>
      </div>
    </SmoothReflow>
  </q-list>
</template>

<script>
import { computed, onMounted, ref, watch } from "vue";
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
  rainbowAddresses: [],
  transactionHash: "",
  hasRainbow: false,
};

import { LOCALSTORAGE_KEY2 } from "./ProjectEdit";

export default {
  name: "PageProjectPart2",

  components: { SmoothReflow },

  props: ["modelValue"],
  setup(props, { emit }) {
    const store = useStore();

    const address = computed(() => store.state.web3.userAddress);

    const data = computed({
      get() {
        return props.modelValue;
      },
      set(value) {
        emit("update:modelValue", value);
      },
    });

    const rainbowAddresses = ref("");
    const rainbowAddrValid = ref(false);

    watch(rainbowAddresses, (addresses) => {
      if (data.value && addresses) {
        addresses = addresses.trim().split(/[\s,]+/);
        rainbowAddrValid.value = addresses.every((addr) =>
          Moralis.web3Library.utils.isAddress(addr)
        );
        addresses = addresses.map((a) => a.toLowerCase());
        data.value.rainbowAddresses = addresses;
      }
    });

    const isValid = computed(
      () =>
        Boolean(address.value) &&
        Boolean(data.value._changeDaoNFTClone) &&
        Boolean(data.value._fundingPSClone) &&
        data.value._mintPrice >= 0 &&
        Boolean(data.value._totalMints) &&
        data.value._maxMintAmountPublic > 0 &&
        data.value._maxMintAmountPublic <= 20 &&
        data.value._maxMintAmountPublic <= data.value._totalMints &&
        data.value._rainbowDuration >= 0 &&
        (!data.value.hasRainbow ||
          (data.value._maxMintAmountRainbow > 0 &&
            data.value._maxMintAmountRainbow <= 20 &&
            data.value._maxMintAmountRainbow <= data.value._totalMints &&
            data.value.rainbowAddresses.length &&
            rainbowAddrValid.value))
    );

    // Reset
    const defaultModel = ref(cloneDeep(REQUEST));

    const reset = (clear = false, complete = false) => {
      let newData;
      if (complete) {
        return LocalStorage.remove(LOCALSTORAGE_KEY2);
      } else if (clear) {
        newData = cloneDeep(defaultModel.value);
      } else {
        newData = LocalStorage.getItem(LOCALSTORAGE_KEY2);
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
      if (newData) {
        rainbowAddresses.value = newData.rainbowAddresses.join("\n") || "";
        rainbowAddrValid.value = newData.rainbowAddresses.every((addr) =>
          Moralis.web3Library.utils.isAddress(addr)
        );
      }
      data.value = newData;
    };

    onMounted(() => {
      reset();
    });

    // Backup unsaved form data
    watch(
      data,
      (newData) => {
        if (isEqual(newData, REQUEST)) {
          // Remove if default
          LocalStorage.remove(LOCALSTORAGE_KEY2);
        } else {
          LocalStorage.set(LOCALSTORAGE_KEY2, {
            ...newData,
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
      rainbowAddrValid,
      reset,
      isValid,
    };
  },
};
</script>
