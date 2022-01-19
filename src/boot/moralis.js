import Moralis from "moralis";
import { boot } from "quasar/wrappers";

export default boot(({ app }) => {
  const serverUrl = process.env.moralisServerURL;
  const appId = process.env.moralisAppID;
  if (process.env.DEV) {
    window.Moralis = Moralis;
  }
  return Moralis.start({ serverUrl, appId });
});
