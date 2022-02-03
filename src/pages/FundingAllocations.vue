<template>
  <q-page padding>
    <q-btn @click="getAddress" label="Get Address" flat />
    <output>{{ changeDaoWallet }}</output>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "PageFundingAllocations",

  setup() {
    const contractAddress = "0xE3011A37A904aB90C8881a99BD1F6E21401f1522";
    const abi = [
      {
        inputs: [
          {
            internalType: "address payable",
            name: "_changeDaoWallet",
            type: "address"
          }
        ],
        stateMutability: "nonpayable",
        type: "constructor"
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "_changeDaoWallet",
            type: "address"
          }
        ],
        name: "NewWallet",
        type: "event"
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "previousOwner",
            type: "address"
          },
          {
            indexed: true,
            internalType: "address",
            name: "newOwner",
            type: "address"
          }
        ],
        name: "OwnershipTransferred",
        type: "event"
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "uint256",
            name: "_shareAmount",
            type: "uint256"
          },
          {
            indexed: true,
            internalType: "bytes32",
            name: "_contractType",
            type: "bytes32"
          }
        ],
        name: "SetShares",
        type: "event"
      },
      {
        inputs: [],
        name: "CHANGEDAO_FUNDS",
        outputs: [
          {
            internalType: "bytes32",
            name: "",
            type: "bytes32"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [],
        name: "CHANGEDAO_ROYALTIES",
        outputs: [
          {
            internalType: "bytes32",
            name: "",
            type: "bytes32"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [],
        name: "changeDaoFunds",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [],
        name: "changeDaoRoyalties",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [],
        name: "changeDaoWallet",
        outputs: [
          {
            internalType: "address payable",
            name: "",
            type: "address"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [],
        name: "owner",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_fundShares",
            type: "uint256"
          }
        ],
        name: "setChangeDaoFunds",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_royaltiesShares",
            type: "uint256"
          }
        ],
        name: "setChangeDaoRoyalties",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address payable",
            name: "_changeDaoWallet",
            type: "address"
          }
        ],
        name: "setChangeDaoWallet",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "newOwner",
            type: "address"
          }
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      }
    ];
    const changeDaoWallet = ref("");

    const getAddress = async () => {
      try {
        const result = await Moralis.executeFunction({
          contractAddress,
          abi,
          functionName: "changeDaoWallet"
        });
        console.log(result);
        changeDaoWallet.value = result;
        return result;
      } catch (error) {
        console.error(error);
      }
    };

    return { getAddress, changeDaoWallet };
  }
});
</script>
