<template>
  <q-page padding>
    <h3>Deployed contracts</h3>

    <q-list separator bordered>
      <q-item>
        <q-item-section>
          <q-item-label class="ellipsis" caption>
            ChangeDaoERC721Factory.sol:
          </q-item-label>
          <q-item-label class="ellipsis">
            {{ ChangeDaoERC721Factory.address }}
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <q-item-label class="ellipsis" caption>
            ChangeDaoERC721:
          </q-item-label>
          <q-item-label class="ellipsis">
            {{ changeDaoERC721FactoryAddress }}
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
            ChangeDaoERC721.sol:
          </q-item-label>
          <q-item-label class="ellipsis">
            {{ ChangeDaoERC721.address }}
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <q-item-label class="ellipsis" caption>
            ChangeDaoERC721Factory:
          </q-item-label>
          <q-item-label class="ellipsis">
            {{ changeDaoERC721ImplementationAddress }}
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
      console.error(error);
      if (!error.code || error.code !== 4001) {
        $q.notify({
          message: formatError(error),
          type: "negative",
          icon: "alert",
          position: "top"
        });
      }
    };

    // Get factory address
    const changeDaoERC721FactoryAddress = ref("");
    const getFactoryAddress = async () => {
      return (changeDaoERC721FactoryAddress.value = await Moralis.executeFunction(
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
        const tx = await Moralis.executeFunction({
          contractAddress: ChangeDaoERC721.address,
          abi: ChangeDaoERC721.abi,
          functionName: "setFactory",
          params: {
            _changeDaoERC721Factory: ChangeDaoERC721Factory.address
          }
        });
        console.log("tx:", tx);
        const receipt = await tx.wait();
        console.log("receipt:", receipt);
        await getFactoryAddress();
      } catch (error) {
        notifyError(error);
      } finally {
        setFactoryAddressLoading.value = false;
      }
    };

    // Get implementation address
    const changeDaoERC721ImplementationAddress = ref("");
    const getImplementationAddress = async () => {
      return (changeDaoERC721ImplementationAddress.value = await Moralis.executeFunction(
        {
          contractAddress: ChangeDaoERC721Factory.address,
          abi: ChangeDaoERC721Factory.abi,
          functionName: "changeDaoERC721Implementation"
        }
      ));
    };

    // Set implementation address
    const setImplementationAddressLoading = ref(false);
    const setImplementationAddress = async () => {
      setImplementationAddressLoading.value = true;
      try {
        const tx = await Moralis.executeFunction({
          contractAddress: ChangeDaoERC721Factory.address,
          abi: ChangeDaoERC721Factory.abi,
          functionName: "setImplementation",
          params: {
            _newChangeDaoERC721Implementation: ChangeDaoERC721.address
          }
        });
        console.log("tx:", tx);
        const receipt = await tx.wait();
        console.log("receipt:", receipt);
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
      ChangeDaoERC721Factory,
      ChangeDaoERC721,
      changeDaoERC721FactoryAddress,
      changeDaoERC721ImplementationAddress,
      setFactoryAddressLoading,
      setFactoryAddress,
      setImplementationAddressLoading,
      setImplementationAddress
    };
  }
});
</script>
