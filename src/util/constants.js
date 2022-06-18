export const URLS = {
  ABOUT_US: "https://docs.changedao.org/about-us/master",
  TWITTER: "https://twitter.com/ChangeDAO",
  DISCORD: "https://discord.gg/88KeENZnyQ",
  PODCAST: "https://medium.com/changedao/podcast/home",
  BLOG: "https://medium.com/changedao",
  EVENTS: "https://medium.com/changedao/events/home",
  NEWSLETTER_FORM: "https://getform.io/f/664280cb-7478-486f-8945-4cc9d819e88a",
};

export const TX_WAIT = 1;
export const TX_URL = "https://rinkeby.etherscan.io/tx/";
export const IPFS_GATEWAY = "https://dweb.link/ipfs/";

export const ETH_BUFFER = 0.01;

export const CHANGEDAO_WALLET = "0xee911a1e8e25997a152e337f45648f9e070fc509";
export const ETH_ADDRESS = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
export const DAI_ADDRESS = "0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea";
export const USDC_ADDRESS = "0x4dbcdf9b62e891a7cec5a2568c3f4faf9e8abe2b";

export const NETWORKS = {
  1: "Main Net",
  2: "Deprecated Morden test network",
  3: "Ropsten test network",
  4: "Rinkeby test network",
  42: "Kovan test network",
  4447: "Truffle Develop Network",
  5777: "Ganache Blockchain",
};

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
