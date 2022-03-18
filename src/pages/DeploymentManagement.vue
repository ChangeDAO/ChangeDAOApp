<template>
  <q-page padding>
    <div class="text-h4 q-mb-md">Deployed contracts</div>

    <q-list separator bordered>
      <!-- Addresses -->
      <q-expansion-item label="Contract Addresses">
        <q-item v-for="(contract, name) in contracts" :key="name">
          <q-item-section>
            <q-item-label class="ellipsis" caption>{{ name }}:</q-item-label>
            <q-item-label class="ellipsis">
              {{ contract.address }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-expansion-item>

      <!-- Configuration -->
      <q-expansion-item label="Contract Configuration">
        <q-list>
          <q-expansion-item label="ChangeDaoNFT" expand-separator>
            <!-- ChangeDaoNFT.changeDaoNFTFactory Address -->
            <q-item>
              <q-item-section>
                <q-item-label class="ellipsis" caption>
                  ChangeDaoNFT.changeDaoNFTFactory:
                </q-item-label>
                <q-item-label
                  class="ellipsis"
                  :class="{
                    'text-negative':
                      ChangeDaoNFTFactoryAddress !==
                      contracts.ChangeDaoNFTFactory.address,
                    'text-positive':
                      ChangeDaoNFTFactoryAddress ===
                      contracts.ChangeDaoNFTFactory.address
                  }"
                >
                  {{ ChangeDaoNFTFactoryAddress }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn
                  @click="setChangeDaoNFTFactoryAddress"
                  label="Set"
                  color="primary"
                  :loading="setChangeDaoNFTFactoryAddressLoading"
                />
              </q-item-section>
            </q-item>

            <!-- ChangeDaoNFT.controller Address -->
            <q-item>
              <q-item-section>
                <q-item-label class="ellipsis" caption>
                  ChangeDaoNFT.controller:
                </q-item-label>
                <q-item-label
                  class="ellipsis"
                  :class="{
                    'text-negative':
                      controllerAddress !== contracts.Controller.address,
                    'text-positive':
                      controllerAddress === contracts.Controller.address
                  }"
                >
                  {{ controllerAddress }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn
                  @click="setControllerAddress"
                  label="Set"
                  color="primary"
                  :loading="setControllerAddressLoading"
                />
              </q-item-section>
            </q-item>

            <!-- ChangeDaoNFT.feeNumerator Value -->
            <q-item>
              <q-item-section>
                <q-item-label class="ellipsis" caption>
                  ChangeDaoNFT.feeNumerator:
                </q-item-label>
                <q-item-label>
                  ChangeDaoNFT stores a fee numerator, which can be re-set. The
                  value should not exceed 10,000. The fee determines the amount
                  of a royalty from a secondary market sale. When the contract
                  is first deployed, set the value to 1000, which is a 10%
                  royalty for any sale.
                </q-item-label>
                <q-input
                  type="number"
                  v-model="feeNumerator"
                  min="0"
                  max="10000"
                />
              </q-item-section>
              <q-item-section side>
                <q-btn
                  @click="setFeeNumerator"
                  label="Set"
                  color="primary"
                  :loading="setFeeNumeratorLoading"
                />
              </q-item-section>
            </q-item>
          </q-expansion-item>

          <q-expansion-item label="ChangeDaoNFTFactory" expand-separator>
          </q-expansion-item>

          <q-expansion-item
            label="PaymentSplitterFactory"
            expand-separator
          ></q-expansion-item>

          <q-expansion-item
            label="SharedFundingFactory"
            expand-separator
          ></q-expansion-item>

          <q-expansion-item label="FundingAllocations" expand-separator>
            <q-input
              v-model="changeDaoWallet"
              label="Address"
              :rules="[isValidAddress]"
              item-aligned
            />
          </q-expansion-item>
        </q-list>
      </q-expansion-item>
    </q-list>
  </q-page>
</template>

<script>
import { defineComponent, computed, onMounted, ref } from "vue";
import { useQuasar } from "quasar";

import { formatError } from "../util/formatting";

import ChangeDaoNFT from "../../../changedao_production/deployments/localhost/ChangeDaoNFT.json";
import ChangeDaoNFTFactory from "../../../changedao_production/deployments/localhost/ChangeDaoNFTFactory.json";
import ChangeMakers from "../../../changedao_production/deployments/localhost/ChangeMakers.json";
import Controller from "../../../changedao_production/deployments/localhost/Controller.json";
import FundingAllocations from "../../../changedao_production/deployments/localhost/FundingAllocations.json";
import PaymentSplitter from "../../../changedao_production/deployments/localhost/PaymentSplitter.json";
import PaymentSplitterFactory from "../../../changedao_production/deployments/localhost/PaymentSplitterFactory.json";
import SharedFunding from "../../../changedao_production/deployments/localhost/SharedFunding.json";
import SharedFundingFactory from "../../../changedao_production/deployments/localhost/SharedFundingFactory.json";

export default defineComponent({
  name: "PageDeploymentManagement",

  setup() {
    const $q = useQuasar();

    const notifyError = error => {
      console.error(error);
      if (!error.code || error.code !== 4001) {
        $q.notify({
          message: formatError(error),
          type: "negative",
          icon: "error",
          position: "top-right"
        });
      }
    };

    // Get factory address
    const ChangeDaoNFTFactoryAddress = ref("");
    const getChangeDaoNFTFactoryAddress = async () => {
      return (ChangeDaoNFTFactoryAddress.value = await Moralis.executeFunction({
        contractAddress: ChangeDaoNFT.address,
        abi: ChangeDaoNFT.abi,
        functionName: "changeDaoNFTFactory"
      }));
    };

    // Set ChangeDaoNFTFactory address
    const setChangeDaoNFTFactoryAddressLoading = ref(false);
    const setChangeDaoNFTFactoryAddress = async () => {
      setChangeDaoNFTFactoryAddressLoading.value = true;
      try {
        const request = await Moralis.executeFunction({
          contractAddress: ChangeDaoNFT.address,
          abi: ChangeDaoNFT.abi,
          functionName: "setChangeDaoNFTFactory",
          params: {
            _changeDaoNFTFactory: ChangeDaoNFTFactory.address
          }
        });
        console.log("request:", request);
        const response = await request.wait();
        console.log("response:", response);
        await getChangeDaoNFTFactoryAddress();
      } catch (error) {
        notifyError(error);
      } finally {
        setChangeDaoNFTFactoryAddressLoading.value = false;
      }
    };

    // Get controller address
    const controllerAddress = ref("");
    const getControllerAddress = async () => {
      return (controllerAddress.value = await Moralis.executeFunction({
        contractAddress: ChangeDaoNFT.address,
        abi: ChangeDaoNFT.abi,
        functionName: "controller"
      }));
    };

    // Set controller address
    const setControllerAddressLoading = ref(false);
    const setControllerAddress = async () => {
      setControllerAddressLoading.value = true;
      try {
        const request = await Moralis.executeFunction({
          contractAddress: ChangeDaoNFT.address,
          abi: ChangeDaoNFT.abi,
          functionName: "setController",
          params: {
            _controller: Controller.address
          }
        });
        console.log("request:", request);
        const response = await request.wait();
        console.log("response:", response);
        await getControllerAddress();
      } catch (error) {
        notifyError(error);
      } finally {
        setControllerAddressLoading.value = false;
      }
    };

    // Get fee numerator
    const feeNumerator = ref("");
    const getFeeNumerator = async () => {
      return (feeNumerator.value = await Moralis.executeFunction({
        contractAddress: ChangeDaoNFT.address,
        abi: ChangeDaoNFT.abi,
        functionName: "feeNumerator"
      }));
    };

    // Set fee numerator
    const setFeeNumeratorLoading = ref(false);
    const setFeeNumerator = async () => {
      setFeeNumeratorLoading.value = true;
      try {
        const request = await Moralis.executeFunction({
          contractAddress: ChangeDaoNFT.address,
          abi: ChangeDaoNFT.abi,
          functionName: "setFeeNumerator",
          params: {
            _feeNumerator: Moralis.web3Library.BigNumber.from(
              feeNumerator.value
            )
          }
        });
        console.log("request:", request);
        const response = await request.wait();
        console.log("response:", response);
        await getControllerAddress();
      } catch (error) {
        notifyError(error);
      } finally {
        setFeeNumeratorLoading.value = false;
      }
    };

    // ChangeDAO Wallet Address
    const changeDaoWallet = ref("");

    // Call getters
    const init = async () => {
      try {
        getChangeDaoNFTFactoryAddress();
        getControllerAddress();
        getFeeNumerator();
      } catch (error) {
        notifyError(error);
      }
    };
    onMounted(init);

    // Validation rules
    const isValidAddress = address =>
      Moralis.web3Library.utils.isAddress(address);

    return {
      isValidAddress,
      contracts: {
        ChangeDaoNFT,
        ChangeDaoNFTFactory,
        ChangeMakers,
        Controller,
        FundingAllocations,
        PaymentSplitter,
        PaymentSplitterFactory,
        SharedFunding,
        SharedFundingFactory
      },
      ChangeDaoNFTFactoryAddress,
      setChangeDaoNFTFactoryAddress,
      setChangeDaoNFTFactoryAddressLoading,
      controllerAddress,
      setControllerAddress,
      setControllerAddressLoading,
      feeNumerator,
      setFeeNumerator,
      setFeeNumeratorLoading,
      changeDaoWallet
    };
  }
});
</script>
