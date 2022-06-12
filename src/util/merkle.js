import { MerkleTree } from "merkletreejs";
import Moralis from "moralis";
import keccak256 from "keccak256";

// The digest created by hashing a recipient's address
export const createLeafRainbow = sponsorAddress => {
  const ethers = Moralis.web3Library;
  let leaf = ethers.utils.solidityKeccak256(["address"], [sponsorAddress]);
  return leaf;
};

// An array of leaves made from the addresses of the sponsors
export const createLeavesRainbow = rainbowArray => {
  let leaves = [];
  for (let i = 0; i < rainbowArray.length; i++) {
    let digest = createLeafRainbow(rainbowArray[i]);
    leaves.push(digest);
  }
  return leaves;
};

// Generate a tree based on the array of recipient leaves
export const createMerkleTreeRainbow = rainbowArray => {
  let leavesArray = createLeavesRainbow(rainbowArray);
  return new MerkleTree(leavesArray, keccak256, { sortPairs: true });
};

// Returns the root of the tree
export const createMerkleRootRainbow = rainbowArray => {
  let tree = createMerkleTreeRainbow(rainbowArray);
  // return tree.getHexRoot().toString('hex');
  return tree.getHexRoot().toString();
};

// Returns a proof used to verify if a leaf belongs to a given root
export const createMerkleProofRainbow = (rainbowArray, leaf) => {
  let tree = createMerkleTreeRainbow(rainbowArray);
  return tree.getHexProof(leaf);
};
