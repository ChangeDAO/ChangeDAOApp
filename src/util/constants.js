export const URLS = {
  ABOUT_US: "https://docs.changedao.org/about-us/master",
  TWITTER: "https://twitter.com/ChangeDAO",
  DISCORD: "https://discord.gg/88KeENZnyQ",
  PODCAST: "https://medium.com/changedao/podcast/home",
  BLOG: "https://medium.com/changedao",
  EVENTS: "https://medium.com/changedao/events/home",
  CONTACT: "mailto:operations@changedao.org",
};

export const SOCIAL_URLS = {
  TWITTER: "https://twitter.com/",
  DISCORD: "https://discord.gg/",
  INSTAGRAM: "https://www.instagram.com/",
  YOUTUBE: "https://youtube.com/channel/",
};

export const TX_WAIT = 1;
export const TX_URL = "https://etherscan.io/tx/";
export const IPFS = /^ipfs:\/\//i;
export const IPFS_GATEWAY = "https://dweb.link/ipfs/";

export const ETH_BUFFER = 0.01;
export const MAX_FILE_BYTES = 3 * 1024 * 1024;

export const CHANGEDAO_WALLET = "0x0ab87d39994b618dcb6c9011447bc9ca6ad2f797";
export const ETH_ADDRESS = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
export const DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
export const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

export const AREAS_OF_CHANGE = [
  "education",
  "energyAndEnvironment",
  "financialInclusion",
  "healthAndWellness",
  "humanRights",
  "identityAndVulnerablePopulations",
  "supplyChain",
];

export const ERC20_ABI = [
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_spender", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_from", type: "address" },
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { name: "_owner", type: "address" },
      { name: "_spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "_from", type: "address" },
      { indexed: true, name: "_to", type: "address" },
      { indexed: false, name: "_value", type: "uint256" },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "_owner", type: "address" },
      { indexed: true, name: "_spender", type: "address" },
      { indexed: false, name: "_value", type: "uint256" },
    ],
    name: "Approval",
    type: "event",
  },
];
