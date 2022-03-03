<template>
  <q-page padding>
    <h3>Deployed contracts</h3>

    <q-list separator bordered>
      <q-item>
        <q-item-section>
          <q-item-label class="ellipsis" caption>
            ChangeDaoNFTFactory.sol:
          </q-item-label>
          <q-item-label class="ellipsis">
            {{ ChangeDaoNFTFactory.address }}
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <q-item-label class="ellipsis" caption>
            ChangeDaoNFT:
          </q-item-label>
          <q-item-label class="ellipsis">
            {{ changeDaoNFTFactoryAddress }}
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn
            @click="setFactoryAddress"
            label="Set"
            color="primary"
            :loading="setFactoryAddressLoading"
          />
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <q-item-label class="ellipsis" caption>
            ChangeDaoNFT.sol:
          </q-item-label>
          <q-item-label class="ellipsis">
            {{ ChangeDaoNFT.address }}
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <q-item-label class="ellipsis" caption>
            ChangeDaoNFTFactory:
          </q-item-label>
          <q-item-label class="ellipsis">
            {{ changeDaoNFTImplementationAddress }}
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn
            @click="setImplementationAddress"
            label="Set"
            color="primary"
            :loading="setImplementationAddressLoading"
          />
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script>
import { defineComponent, computed, onMounted, ref } from "vue";
import { useQuasar } from "quasar";

import { formatError } from "../util/formatting";

import ChangeDaoNFTFactory from "../../../changedao_production/deployments/localhost/ChangeDaoNFTFactory.json";
import ChangeDaoNFT from "../../../changedao_production/deployments/localhost/ChangeDaoNFT.json";
import SharedFunding from "../../../changedao_production/deployments/localhost/SharedFunding.json";
import PaymentSplitter from "../../../changedao_production/deployments/localhost/PaymentSplitter.json";
import FundingAllocations from "../../../changedao_production/deployments/localhost/FundingAllocations.json";
import PaymentSplitterFactory from "../../../changedao_production/deployments/localhost/PaymentSplitterFactory.json";

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
    const changeDaoNFTFactoryAddress = ref("");
    const getFactoryAddress = async () => {
      return (changeDaoNFTFactoryAddress.value = await Moralis.executeFunction({
        contractAddress: ChangeDaoNFT.address,
        abi: ChangeDaoNFT.abi,
        functionName: "changeDaoNFTFactory"
      }));
    };

    // Set factory address
    const setFactoryAddressLoading = ref(false);
    const setFactoryAddress = async () => {
      setFactoryAddressLoading.value = true;
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
        await getFactoryAddress();
      } catch (error) {
        notifyError(error);
      } finally {
        setFactoryAddressLoading.value = false;
      }
    };

    // Get implementation address
    const changeDaoNFTImplementationAddress = ref("");
    const getImplementationAddress = async () => {
      return (changeDaoNFTImplementationAddress.value = await Moralis.executeFunction(
        {
          contractAddress: ChangeDaoNFTFactory.address,
          abi: ChangeDaoNFTFactory.abi,
          functionName: "changeDaoNFTImplementation"
        }
      ));
    };

    // Set implementation address
    const setImplementationAddressLoading = ref(false);
    const setImplementationAddress = async () => {
      setImplementationAddressLoading.value = true;
      try {
        const request = await Moralis.executeFunction({
          contractAddress: ChangeDaoNFTFactory.address,
          abi: ChangeDaoNFTFactory.abi,
          functionName: "setImplementation",
          params: {
            _newChangeDaoNFTImplementation: ChangeDaoNFT.address
          }
        });
        console.log("request:", request);
        const response = await request.wait();
        console.log("response:", response);
        await getImplementationAddress();
      } catch (error) {
        notifyError(error);
      } finally {
        setImplementationAddressLoading.value = false;
      }
    };

    // Call getters
    const init = async () => {
      try {
        getFactoryAddress();
        getImplementationAddress();
      } catch (error) {
        notifyError(error);
      }
    };
    onMounted(init);

    return {
      ChangeDaoNFTFactory,
      ChangeDaoNFT,
      changeDaoNFTFactoryAddress,
      changeDaoNFTImplementationAddress,
      setFactoryAddressLoading,
      setFactoryAddress,
      setImplementationAddressLoading,
      setImplementationAddress
    };
  }
});
</script>
