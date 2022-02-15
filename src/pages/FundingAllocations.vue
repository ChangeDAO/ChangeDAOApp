<template>
  <q-page padding>
    <div class="q-gutter-md">
      <q-input v-model="label" label="Label" />
      <q-input v-model="address" label="Address" />
      <q-btn
        @click="createSubnode"
        label="createSubnode"
        color="primary"
        :loading="loading"
      />
    </div>
  </q-page>
</template>

<script>
import { defineComponent, computed, ref } from "vue";
import { sha3 } from "web3-utils";

import SubnodeRegistrar from "../../../changedao_contracts/deployments/localhost/SubnodeRegistrar.json";

export default defineComponent({
  name: "PageFundingAllocations",

  setup() {
    const contractAddress = SubnodeRegistrar.address;
    const abi = SubnodeRegistrar.abi;

    const label = ref("");
    const address = ref("");
    const loading = ref(false);

    const createSubnode = async () => {
      try {
        loading.value = true;
        const params = {
          _node: address.value,
          _label: sha3(label.value)
        };
        console.log(params);

        const result = await Moralis.executeFunction({
          contractAddress,
          abi,
          params,
          functionName: "createSubnode",
        });

        console.log(result);
        return result;
      } catch (error) {
        console.error(error);
      } finally {
        loading.value = false;
      }
    };

    return { label, address, loading, createSubnode };
  }
});
</script>
