<template>
  <q-page padding>
    <h3>Deployed contracts</h3>

    <q-list separator bordered>
      <q-item>
        <q-item-section>
          <q-item-label caption>ChangeDaoERC721Factory.sol:</q-item-label>
          <q-item-label>{{ ChangeDaoERC721Factory.address }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label caption>ChangeDaoERC721:</q-item-label>
          <q-item-label>{{ ChangeDaoERC721FactoryAddress }}</q-item-label>
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
    </q-list>
  </q-page>
</template>

<script>
import { defineComponent, computed, ref } from "vue";
import { useQuasar } from "quasar";

import { formatError } from "../util/formatting";

import ChangeDaoERC721Factory from "../../../changedao_production/deployments/localhost/ChangeDaoERC721Factory.json";
import ChangeDaoERC721 from "../../../changedao_production/deployments/localhost/ChangeDaoERC721.json";
import SharedFunding from "../../../changedao_production/deployments/localhost/SharedFunding.json";
import PaymentSplitter from "../../../changedao_production/deployments/localhost/PaymentSplitter.json";
import FundingAllocations from "../../../changedao_production/deployments/localhost/FundingAllocations.json";
import FundingFactory from "../../../changedao_production/deployments/localhost/FundingFactory.json";
import PaymentSplitterFactory from "../../../changedao_production/deployments/localhost/PaymentSplitterFactory.json";

export default defineComponent({
  name: "PageDeploymentManagement",

  setup() {
    const $q = useQuasar();

    const notifyError = error => {
      $q.notify({
        message: formatError(error),
        type: "negative",
        icon: "alert",
        position: "top"
      });
    };

    // Get factory address
    const ChangeDaoERC721FactoryAddress = ref("");
    const getFactoryAddress = async () => {
      return (ChangeDaoERC721FactoryAddress.value = await Moralis.executeFunction(
        {
          contractAddress: ChangeDaoERC721.address,
          abi: ChangeDaoERC721.abi,
          functionName: "changeDaoERC721Factory"
        }
      ));
    };

    // Set factory address
    const setFactoryAddressLoading = ref(false);
    const setFactoryAddress = async () => {
      setFactoryAddressLoading.value = true;
      try {
        await Moralis.executeFunction({
          contractAddress: ChangeDaoERC721.address,
          abi: ChangeDaoERC721.abi,
          functionName: "setFactory",
          params: {
            _changeDaoERC721Factory: ChangeDaoERC721Factory.address
          }
        });
        return getFactoryAddress();
      } catch (error) {
        notifyError(error);
      } finally {
        setFactoryAddressLoading.value = false;
      }
    };

    // Call getters
    const init = async () => {
      try {
        getFactoryAddress();
      } catch (error) {
        notifyError(error);
      }
    };
    init();

    return {
      ChangeDaoERC721Factory,
      ChangeDaoERC721FactoryAddress,
      setFactoryAddressLoading,
      setFactoryAddress
    };
  }
});
</script>
