<template>
  <q-page padding>
    <div class="q-gutter-md">
      <q-input v-model="label" label="Label" />
      <q-btn
        @click="createSubnode"
        label="Create Subnode"
        color="primary"
        :loading="loading1"
      />
      <q-input v-model="cloneAddress" label="Subnode Address" />
      <q-input v-model="cmAddress" label="Changemaker Address" />
      <q-btn
        @click="grantRole"
        label="Grant Role"
        color="primary"
        :loading="loading2"
      />
    </div>
  </q-page>
</template>

<script>
import { defineComponent, computed, ref } from "vue";
import { sha3 } from "web3-utils";

import contractSubnodeRegistrar from "../../../changedao_contracts/deployments/localhost/SubnodeRegistrar.json";
import contractNode from "../../../changedao_contracts/deployments/localhost/Node.json";

export default defineComponent({
  name: "PageFundingAllocations",

  setup() {
    const label = ref("");
    const cmAddress = ref("");
    const cloneAddress = ref("");

    const loading1 = ref(false);
    const createSubnode = async () => {
      try {
        loading1.value = true;

        const tx = await Moralis.executeFunction({
          contractAddress: contractSubnodeRegistrar.address,
          abi: contractSubnodeRegistrar.abi,
          params: {
            _node: contractNode.address,
            _label: sha3(label.value)
          },
          functionName: "createSubnode"
        });
        console.log("tx:", tx);

        const receipt = await tx.wait();
        console.log("receipt:", receipt);
        cloneAddress.value =
          receipt.events[receipt.events.length - 1].args._subnode;
        console.log("cloneAddress:", cloneAddress.value);
      } catch (error) {
        console.error(error);
      } finally {
        loading1.value = false;
      }
    };

    const loading2 = ref(false);
    const grantRole = async () => {
      try {
        loading2.value = true;

        const DEFAULT_ADMIN_ROLE = Moralis.web3Library.utils.hexZeroPad(
          [0],
          32
        );
        const tx = await Moralis.executeFunction({
          contractAddress: cloneAddress.value,
          abi: contractNode.abi,
          params: {
            role: DEFAULT_ADMIN_ROLE,
            account: cmAddress.value
          },
          functionName: "grantRole"
        });
        console.log("tx:", tx);

        const receipt = await tx.wait();
        console.log("receipt:", receipt);
      } catch (error) {
        console.error(error);
      } finally {
        loading2.value = false;
      }
    };

    return {
      label,
      cmAddress,
      loading1,
      createSubnode,
      cloneAddress,
      loading2,
      grantRole
    };
  }
});
</script>
