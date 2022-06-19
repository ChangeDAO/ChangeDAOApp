export default function () {
  return {
    initializing: false,
    initialized: false,
    chain: null,
    provider: null,
    user: null,
    userAddress: "",
    userENS: "",
    userNFTs: [],
    userRoles: [],
    userBalances: {},
    isAdmin: false,
  };
}
