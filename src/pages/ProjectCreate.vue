<template>
  <q-page class="page-project-edit">
    <div v-if="address" class="q-layout-padding page-col col">
      <!-- Title -->
      <div class="text-h4 q-ma-md">
        {{ $t(isNew ? "New Project" : "Edit Project") }}
      </div>

      <q-stepper
        v-model="step"
        header-class="text-h5"
        :vertical="$q.screen.gt.xs"
        flat
        animated
      >
        <q-step :name="1" :title="$t('project.step1')" :done="isPart1Complete">
          <ProjectPart1 ref="part1" v-model="data1" />
        </q-step>
        <q-step :name="2" :title="$t('project.step2')">
          <ProjectPart2 ref="part2" v-model="data2" />
        </q-step>
      </q-stepper>

      <q-item class="q-mb-xl">
        <q-item-section>
          <q-item-label>
            <div class="row q-gutter-md justify-end">
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
  </q-page>
</template>

<script>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { LocalStorage } from "quasar";
import { cloneDeep, pickBy } from "lodash";
import Controller from "../../contracts/deployments/rinkeby/Controller.json";
import ChangeDaoNFTFactory from "../../contracts/deployments/rinkeby/ChangeDaoNFTFactory.json";
import PaymentSplitterFactory from "../../contracts/deployments/rinkeby/PaymentSplitterFactory.json";
import SharedFundingFactory from "../../contracts/deployments/rinkeby/SharedFundingFactory.json";
import Moralis from "moralis";

import ProjectPart1 from "./ProjectPart1";
import ProjectPart2 from "./ProjectPart2";

import { TX_WAIT } from "../util/constants";
import { notifyError, notifySuccess, notifyTx } from "../util/notify";
import { createMerkleRootRainbow } from "../util/merkle";

export const LOCALSTORAGE_KEY1 = "projectPart1";
export const LOCALSTORAGE_KEY2 = "projectPart2";

export const REQUEST1 = {
  _movementName: "",
  _projectName: "",
  _creators: [],
  _baseURI: "",
  _royaltiesPayees: [],
  _royaltiesShares: [],
  _fundingPayees: [],
  _fundingShares: [],
  transactionHash: "",
  description: "",
  areaOfChange: "",
};

export const REQUEST2 = {
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

export default {
  name: "PageProjectCreate",

  components: { ProjectPart1, ProjectPart2 },

  setup() {
    const router = useRouter();
    const store = useStore();

    const address = computed(() => store.state.web3.userAddress);

    // Form references
    const part1 = ref(null);
    const part2 = ref(null);

    // Form data
    const data1 = ref(
      LocalStorage.getItem(LOCALSTORAGE_KEY1) || cloneDeep(REQUEST1)
    );
    const data2 = ref(
      LocalStorage.getItem(LOCALSTORAGE_KEY2) || cloneDeep(REQUEST2)
    );
    const isNew = computed(
      () => router.currentRoute.value.name === "project-new"
    );

    const isPart1Complete = computed(() =>
      Boolean(data2.value && data2.value._changeDaoNFTClone)
    );

    const step = computed(() => (isPart1Complete.value ? 2 : 1));

    const isValid = computed(() =>
      isPart1Complete.value
        ? part2.value && part2.value.isValid
        : part1.value && part1.value.isValid
    );

    // Reset
    const reset = (clear = false) => {
      if (!isPart1Complete.value) {
        part1.value.reset(clear);
        part2.value.reset(true);
      } else {
        part2.value.reset(clear);
      }
    };

    // Submit
    const isSubmitting = ref(false);
    const submit = async () => {
      try {
        isSubmitting.value = true;

        const ethers = Moralis.web3Library;
        const provider = ethers.providers.getDefaultProvider(process.env.chain);

        if (!isPart1Complete.value) {
          // Part 1

          // Create Transaction
          const tx = await Moralis.executeFunction({
            contractAddress: Controller.address,
            abi: Controller.abi,
            functionName: "createNFTAndPSClones",
            params: pickBy(data1.value, (value, key) => key.startsWith("_")),
          });
          let dismiss = notifyTx(tx.hash);
          data1.value.transactionHash = tx.hash;

          // Call Cloud Function
          data1.value.projectId = (
            await Moralis.Cloud.run("createProjectPartOne", data1.value)
          ).id;

          // Transaction Complete
          const response = await tx.wait(TX_WAIT);
          notifySuccess("TxComplete");
          dismiss();

          // Get NFT Clone Address
          const changeDaoNFTFactory = new ethers.Contract(
            ChangeDaoNFTFactory.address,
            ChangeDaoNFTFactory.abi,
            provider
          );
          const _changeDaoNFTClone = (
            await changeDaoNFTFactory.queryFilter(
              changeDaoNFTFactory.filters.ChangeDaoNFTCloneCreated(),
              response.blockHash
            )
          )[0].args.changeDaoNFTClone;

          // Get Payment Splitter Address
          const paymentSplitterFactory = new ethers.Contract(
            PaymentSplitterFactory.address,
            PaymentSplitterFactory.abi,
            provider
          );
          const _fundingPSClone = (
            await paymentSplitterFactory.queryFilter(
              paymentSplitterFactory.filters.FundingPSCloneDeployed(),
              response.blockHash
            )
          )[0].args.fundingPSClone;

          // Set data for Part 2
          data2.value.projectId = data1.value.projectId;
          data2.value._changeDaoNFTClone = _changeDaoNFTClone;
          data2.value._fundingPSClone = _fundingPSClone;
          LocalStorage.set(LOCALSTORAGE_KEY2, data2.value);
        } else {
          // Part 2

          // Create Merkle Root
          data2.value._rainbowMerkleRoot = data2.value.hasRainbow
            ? createMerkleRootRainbow(data2.value.rainbowAddresses)
            : ethers.utils.formatBytes32String("0");

          // Create Transaction
          const tx = await Moralis.executeFunction({
            contractAddress: Controller.address,
            abi: Controller.abi,
            functionName: "callSharedFundingFactory",
            params: {
              projectId: data1.value.projectId,
              transactionHash: data2.value.transactionHash,
              rainbowAddresses: data2.value.rainbowAddresses,
              _changeDaoNFTClone: data2.value._changeDaoNFTClone,
              _fundingPSClone: data2.value._fundingPSClone,
              _mintPrice: ethers.utils.parseEther(
                data2.value._mintPrice.toString()
              ),
              _totalMints: ethers.BigNumber.from(
                data2.value._totalMints.toString()
              ),
              _maxMintAmountPublic: ethers.BigNumber.from(
                data2.value._maxMintAmountPublic.toString()
              ),
              _maxMintAmountRainbow: ethers.BigNumber.from(
                data2.value.hasRainbow
                  ? data2.value._maxMintAmountRainbow.toString()
                  : 1
              ),
              _rainbowDuration: ethers.BigNumber.from(
                data2.value._rainbowDuration * 3600
              ),
              _rainbowMerkleRoot: data2.value._rainbowMerkleRoot,
            },
          });
          let dismiss = notifyTx(tx.hash);
          data2.value.transactionHash = tx.hash;
          if (data2.value._maxMintAmountRainbow === null) {
            data2.value._maxMintAmountRainbow = 1;
          }
          if (!data2.value._rainbowDuration) {
            data2.value._rainbowDuration = 0;
          }

          // Call Cloud Function
          await Moralis.Cloud.run("createProjectPartTwo", data2.value);

          // Transaction Complete
          const response = await tx.wait(TX_WAIT);
          notifySuccess("TxComplete");
          dismiss();

          // Get Shared Funding Clone Address
          const sharedFundingFactory = new ethers.Contract(
            SharedFundingFactory.address,
            SharedFundingFactory.abi,
            provider
          );

          goToAdmin();
          LocalStorage.remove(LOCALSTORAGE_KEY1);
          LocalStorage.remove(LOCALSTORAGE_KEY2);
        }
      } catch (error) {
        console.error(error);
        notifyError(error.error || error);
      } finally {
        isSubmitting.value = false;
      }
    };

    const goToAdmin = () => {
      router.replace({
        name: "project-admin",
        params: { projectID: data1.value.projectId },
      });
    };

    return {
      part1,
      part2,
      step,
      isPart1Complete,
      address,
      data1,
      data2,
      submit,
      reset,
      isSubmitting,
      isNew,
      isValid,
    };
  },
};
</script>
