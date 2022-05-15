<template>
  <q-page padding>
    <div class="text-h4 q-mx-md q-mb-lg">{{ $t("Deployed Contracts") }}</div>

    <q-list separator bordered>
      <!-- Addresses -->
      <q-expansion-item label="Contract Addresses" header-class="text-bold">
        <q-item v-for="(contract, name) in contracts" :key="name">
          <q-item-section avatar>
            <AddrAvatar :address="contract.address" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="ellipsis" caption>{{ name }}:</q-item-label>
            <q-item-label class="ellipsis">
              {{ contract.address }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-expansion-item>

      <!-- Configuration -->
      <q-expansion-item label="Contract Configuration" header-class="text-bold">
        <q-list>
          <q-expansion-item @show="changeDaoNFT.get" expand-separator>
            <template v-slot:header>
              <q-item-section avatar>
                <AddrAvatar :address="contracts.ChangeDaoNFT.address" />
              </q-item-section>
              <q-item-section>
                ChangeDaoNFT
              </q-item-section>
            </template>

            <!-- ChangeDaoNFT.changeDaoNFTFactory Address -->
            <q-item>
              <q-item-section>
                <q-item-label class="ellipsis" caption>
                  ChangeDaoNFT.changeDaoNFTFactory:
                </q-item-label>
                <q-item-label
                  class="ellipsis"
                  :class="changeDaoNFT.factoryAddress.color.value"
                >
                  <q-skeleton
                    type="text"
                    width="26em"
                    v-if="changeDaoNFT.factoryAddress.loading.value"
                  />
                  <template v-else>
                    {{ changeDaoNFT.factoryAddress.model.value }}
                  </template>
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn
                  @click="changeDaoNFT.factoryAddress.set"
                  label="Set"
                  color="primary"
                  :loading="changeDaoNFT.factoryAddress.setting.value"
                />
              </q-item-section>
            </q-item>

            <!-- ChangeDaoNFT.controller Address -->
            <q-item>
              <q-item-section>
                <q-item-label class="ellipsis" caption>
                  ChangeDaoNFT.controller:
                </q-item-label>
                <q-item-label
                  class="ellipsis"
                  :class="changeDaoNFT.controllerAddress.color.value"
                >
                  <q-skeleton
                    type="text"
                    width="26em"
                    v-if="changeDaoNFT.controllerAddress.loading.value"
                  />
                  <template v-else>
                    {{ changeDaoNFT.controllerAddress.model.value }}
                  </template>
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn
                  @click="changeDaoNFT.controllerAddress.set"
                  label="Set"
                  color="primary"
                  :loading="changeDaoNFT.controllerAddress.setting.value"
                />
              </q-item-section>
            </q-item>

            <!-- ChangeDaoNFT.feeNumerator Value -->
            <q-item>
              <q-item-section>
                <q-item-label class="ellipsis" caption>
                  ChangeDaoNFT.feeNumerator:
                </q-item-label>
                <q-item-label>
                  ChangeDaoNFT stores a fee numerator, which can be re-set. The
                  value should not exceed 10,000. The fee determines the amount
                  of a royalty from a secondary market sale. When the contract
                  is first deployed, set the value to 1000, which is a 10%
                  royalty for any sale.
                </q-item-label>
              </q-item-section>
              <q-item-section side class="q-gutter-sm">
                <q-input
                  type="number"
                  v-model.number="changeDaoNFT.feeNumerator.model.value"
                  :loading="changeDaoNFT.feeNumerator.loading.value"
                  :rules="[isValidShare]"
                  min="0"
                  max="10000"
                  hide-bottom-space
                  dense
                />
                <q-btn
                  @click="changeDaoNFT.feeNumerator.set"
                  label="Set"
                  color="primary"
                  :loading="changeDaoNFT.feeNumerator.setting.value"
                  :disable="
                    !isValidShare(changeDaoNFT.feeNumerator.model.value)
                  "
                />
              </q-item-section>
            </q-item>
          </q-expansion-item>

          <q-expansion-item @show="changeDaoNFTFactory.get" expand-separator>
            <template v-slot:header>
              <q-item-section avatar>
                <AddrAvatar :address="contracts.ChangeDaoNFTFactory.address" />
              </q-item-section>
              <q-item-section>
                ChangeDaoNFTFactory
              </q-item-section>
            </template>

            <!-- ChangeDaoNFTFactory.changeDaoNFT Address -->
            <q-item>
              <q-item-section>
                <q-item-label class="ellipsis" caption>
                  ChangeDaoNFTFactory.changeDaoNFT:
                </q-item-label>
                <q-item-label
                  class="ellipsis"
                  :class="changeDaoNFTFactory.i12nAddress.color.value"
                >
                  <q-skeleton
                    type="text"
                    width="26em"
                    v-if="changeDaoNFTFactory.i12nAddress.loading.value"
                  />
                  <template v-else>
                    {{ changeDaoNFTFactory.i12nAddress.model.value }}
                  </template>
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn
                  @click="changeDaoNFTFactory.i12nAddress.set"
                  label="Set"
                  color="primary"
                  :loading="changeDaoNFTFactory.i12nAddress.setting.value"
                />
              </q-item-section>
            </q-item>

            <!-- ChangeDaoNFTFactory.controller Address -->
            <q-item>
              <q-item-section>
                <q-item-label class="ellipsis" caption>
                  ChangeDaoNFTFactory.controller:
                </q-item-label>
                <q-item-label
                  class="ellipsis"
                  :class="changeDaoNFTFactory.controllerAddress.color.value"
                >
                  <q-skeleton
                    type="text"
                    width="26em"
                    v-if="changeDaoNFTFactory.controllerAddress.loading.value"
                  />
                  <template v-else>
                    {{ changeDaoNFTFactory.controllerAddress.model.value }}
                  </template>
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn
                  @click="changeDaoNFTFactory.controllerAddress.set"
                  label="Set"
                  color="primary"
                  :loading="changeDaoNFTFactory.controllerAddress.setting.value"
                />
              </q-item-section>
            </q-item>
          </q-expansion-item>

          <q-expansion-item @show="paymentSplitterFactory.get" expand-separator>
            <template v-slot:header>
              <q-item-section avatar>
                <AddrAvatar
                  :address="contracts.PaymentSplitterFactory.address"
                />
              </q-item-section>
              <q-item-section>
                PaymentSplitterFactory
              </q-item-section>
            </template>

            <!-- PaymentSplitterFactory.fundingAllocations Address -->
            <q-item>
              <q-item-section>
                <q-item-label class="ellipsis" caption>
                  PaymentSplitterFactory.fundingAllocations:
                </q-item-label>
                <q-item-label
                  class="ellipsis"
                  :class="paymentSplitterFactory.fundingA9sAddress.color.value"
                >
                  <q-skeleton
                    type="text"
                    width="26em"
                    v-if="
                      paymentSplitterFactory.fundingA9sAddress.loading.value
                    "
                  />
                  <template v-else>
                    {{ paymentSplitterFactory.fundingA9sAddress.model.value }}
                  </template>
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn
                  @click="paymentSplitterFactory.fundingA9sAddress.set"
                  label="Set"
                  color="primary"
                  :loading="
                    paymentSplitterFactory.fundingA9sAddress.setting.value
                  "
                />
              </q-item-section>
            </q-item>

            <!-- PaymentSplitterFactory.paymentSplitter Address -->
            <q-item>
              <q-item-section>
                <q-item-label class="ellipsis" caption>
                  PaymentSplitterFactory.paymentSplitter:
                </q-item-label>
                <q-item-label
                  class="ellipsis"
                  :class="
                    paymentSplitterFactory.paymentSplitterAddress.color.value
                  "
                >
                  <q-skeleton
                    type="text"
                    width="26em"
                    v-if="
                      paymentSplitterFactory.paymentSplitterAddress.loading
                        .value
                    "
                  />
                  <template v-else>
                    {{
                      paymentSplitterFactory.paymentSplitterAddress.model.value
                    }}
                  </template>
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn
                  @click="paymentSplitterFactory.paymentSplitterAddress.set"
                  label="Set"
                  color="primary"
                  :loading="
                    paymentSplitterFactory.paymentSplitterAddress.setting.value
                  "
                />
              </q-item-section>
            </q-item>

            <!-- PaymentSplitterFactory.controller Address -->
            <q-item>
              <q-item-section>
                <q-item-label class="ellipsis" caption>
                  PaymentSplitterFactory.controller:
                </q-item-label>
                <q-item-label
                  class="ellipsis"
                  :class="paymentSplitterFactory.controllerAddress.color.value"
                >
                  <q-skeleton
                    type="text"
                    width="26em"
                    v-if="
                      paymentSplitterFactory.controllerAddress.loading.value
                    "
                  />
                  <template v-else>
                    {{ paymentSplitterFactory.controllerAddress.model.value }}
                  </template>
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn
                  @click="paymentSplitterFactory.controllerAddress.set"
                  label="Set"
                  color="primary"
                  :loading="
                    paymentSplitterFactory.controllerAddress.setting.value
                  "
                />
              </q-item-section>
            </q-item>
          </q-expansion-item>

          <q-expansion-item @show="sharedFundingFactory.get" expand-separator>
            <template v-slot:header>
              <q-item-section avatar>
                <AddrAvatar :address="contracts.SharedFundingFactory.address" />
              </q-item-section>
              <q-item-section>
                SharedFundingFactory
              </q-item-section>
            </template>

            <!-- SharedFundingFactory.sharedFunding Address -->
            <q-item>
              <q-item-section>
                <q-item-label class="ellipsis" caption>
                  SharedFundingFactory.sharedFunding:
                </q-item-label>
                <q-item-label
                  class="ellipsis"
                  :class="sharedFundingFactory.i12nAddress.color.value"
                >
                  <q-skeleton
                    type="text"
                    width="26em"
                    v-if="sharedFundingFactory.i12nAddress.loading.value"
                  />
                  <template v-else>
                    {{ sharedFundingFactory.i12nAddress.model.value }}
                  </template>
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn
                  @click="sharedFundingFactory.i12nAddress.set"
                  label="Set"
                  color="primary"
                  :loading="sharedFundingFactory.i12nAddress.setting.value"
                />
              </q-item-section>
            </q-item>

            <!-- SharedFundingFactory.fundingAllocations Address -->
            <q-item>
              <q-item-section>
                <q-item-label class="ellipsis" caption>
                  SharedFundingFactory.fundingAllocations:
                </q-item-label>
                <q-item-label
                  class="ellipsis"
                  :class="sharedFundingFactory.fundingA9sAddress.color.value"
                >
                  <q-skeleton
                    type="text"
                    width="26em"
                    v-if="sharedFundingFactory.fundingA9sAddress.loading.value"
                  />
                  <template v-else>
                    {{ sharedFundingFactory.fundingA9sAddress.model.value }}
                  </template>
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn
                  @click="sharedFundingFactory.fundingA9sAddress.set"
                  label="Set"
                  color="primary"
                  :loading="
                    sharedFundingFactory.fundingA9sAddress.setting.value
                  "
                />
              </q-item-section>
            </q-item>

            <!-- SharedFundingFactory.controller Address -->
            <q-item>
              <q-item-section>
                <q-item-label class="ellipsis" caption>
                  SharedFundingFactory.controller:
                </q-item-label>
                <q-item-label
                  class="ellipsis"
                  :class="sharedFundingFactory.controllerAddress.color.value"
                >
                  <q-skeleton
                    type="text"
                    width="26em"
                    v-if="sharedFundingFactory.controllerAddress.loading.value"
                  />
                  <template v-else>
                    {{ sharedFundingFactory.controllerAddress.model.value }}
                  </template>
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn
                  @click="sharedFundingFactory.controllerAddress.set"
                  label="Set"
                  color="primary"
                  :loading="
                    sharedFundingFactory.controllerAddress.setting.value
                  "
                />
              </q-item-section>
            </q-item>
          </q-expansion-item>

          <q-expansion-item @show="fundingA9s.get" expand-separator>
            <template v-slot:header>
              <q-item-section avatar>
                <AddrAvatar :address="contracts.FundingAllocations.address" />
              </q-item-section>
              <q-item-section>
                FundingAllocations
              </q-item-section>
            </template>

            <!-- FundingAllocations.changeDaoFunding Value -->
            <q-item>
              <q-item-section>
                <q-input
                  label="FundingAllocations.changeDaoFunding"
                  type="number"
                  v-model.number="fundingA9s.changeDaoFunding.model.value"
                  :loading="fundingA9s.changeDaoFunding.loading.value"
                  :rules="[isValidShare]"
                  hide-bottom-space
                  min="0"
                  max="10000"
                />
              </q-item-section>
              <q-item-section side>
                <q-btn
                  @click="fundingA9s.changeDaoFunding.set"
                  label="Set"
                  color="primary"
                  :loading="fundingA9s.changeDaoFunding.setting.value"
                  :disable="
                    !isValidShare(fundingA9s.changeDaoFunding.model.value)
                  "
                />
              </q-item-section>
            </q-item>

            <!-- FundingAllocations.changeDaoRoyalties Value -->
            <q-item>
              <q-item-section>
                <q-input
                  label="FundingAllocations.changeDaoRoyalties"
                  type="number"
                  v-model.number="fundingA9s.changeDaoRoyalties.model.value"
                  :loading="fundingA9s.changeDaoRoyalties.loading.value"
                  :rules="[isValidShare]"
                  hide-bottom-space
                  min="0"
                  max="10000"
                />
              </q-item-section>
              <q-item-section side>
                <q-btn
                  @click="fundingA9s.changeDaoRoyalties.set"
                  label="Set"
                  color="primary"
                  :loading="fundingA9s.changeDaoRoyalties.setting.value"
                  :disable="
                    !isValidShare(fundingA9s.changeDaoRoyalties.model.value)
                  "
                />
              </q-item-section>
            </q-item>

            <!-- FundingAllocations.changeDaoWallet Address -->
            <q-item>
              <q-item-section>
                <q-input
                  v-model="fundingA9s.changeDaoWallet.model.value"
                  label="FundingAllocations.changeDaoWallet"
                  :rules="[isValidAddress]"
                  hide-bottom-space
                  :loading="fundingA9s.changeDaoWallet.loading.value"
                />
              </q-item-section>
              <q-item-section side>
                <q-btn
                  @click="fundingA9s.changeDaoWallet.set"
                  label="Set"
                  color="primary"
                  :loading="fundingA9s.changeDaoWallet.setting.value"
                />
              </q-item-section>
            </q-item>
          </q-expansion-item>

          <q-expansion-item expand-separator>
            <template v-slot:header>
              <q-item-section avatar>
                <AddrAvatar :address="contracts.PaymentSplitter.address" />
              </q-item-section>
              <q-item-section>
                PaymentSplitter
              </q-item-section>
            </template>

            <q-item>
              <q-item-section>
                <q-item-label class="ellipsis" caption>
                  Release Funds
                </q-item-label>
                <q-item-label class="ellipsis">
                  ChangeDao can release any funds inadvertently sent to the
                  implementation contract.
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn
                  @click="paymentSplitter.releaseFunds"
                  label="Release Funds"
                  color="primary"
                  :loading="paymentSplitter.releasing.value"
                />
              </q-item-section>
            </q-item>
          </q-expansion-item>
        </q-list>
      </q-expansion-item>
    </q-list>
  </q-page>
</template>

<script>
import Moralis from "moralis";
import { defineComponent, computed, ref } from "vue";
import { useQuasar } from "quasar";

import { notifyError } from "../util/notify";
import AddrAvatar from "../components/AddrAvatar";

import ChangeDaoNFT from "../../../changedao_production/deployments/rinkeby/ChangeDaoNFT.json";
import ChangeDaoNFTFactory from "../../../changedao_production/deployments/rinkeby/ChangeDaoNFTFactory.json";
import ChangeMakers from "../../../changedao_production/deployments/rinkeby/ChangeMakers.json";
import Controller from "../../../changedao_production/deployments/rinkeby/Controller.json";
import FundingAllocations from "../../../changedao_production/deployments/rinkeby/FundingAllocations.json";
import PaymentSplitter from "../../../changedao_production/deployments/rinkeby/PaymentSplitter.json";
import PaymentSplitterFactory from "../../../changedao_production/deployments/rinkeby/PaymentSplitterFactory.json";
import SharedFunding from "../../../changedao_production/deployments/rinkeby/SharedFunding.json";
import SharedFundingFactory from "../../../changedao_production/deployments/rinkeby/SharedFundingFactory.json";

export default defineComponent({
  name: "PageDeploymentManagement",

  components: { AddrAvatar },

  setup() {
    const $q = useQuasar();

    const changeDaoNFT = {
      get: () =>
        Promise.all([
          changeDaoNFT.factoryAddress.get(),
          changeDaoNFT.controllerAddress.get(),
          changeDaoNFT.feeNumerator.get()
        ]),
      factoryAddress: {
        model: ref(""),
        loading: ref(false),
        setting: ref(false),
        color: computed(() =>
          changeDaoNFT.factoryAddress.model.value ===
          ChangeDaoNFTFactory.address
            ? "text-positive"
            : "text-negative"
        ),
        get: async () => {
          try {
            changeDaoNFT.factoryAddress.loading.value = true;
            changeDaoNFT.factoryAddress.model.value = await Moralis.executeFunction(
              {
                contractAddress: ChangeDaoNFT.address,
                abi: ChangeDaoNFT.abi,
                functionName: "changeDaoNFTFactory"
              }
            );
          } catch (error) {
            notifyError(error.error || error);
          } finally {
            changeDaoNFT.factoryAddress.loading.value = false;
          }
        },
        set: async () => {
          try {
            changeDaoNFT.factoryAddress.setting.value = true;
            const request = await Moralis.executeFunction({
              contractAddress: ChangeDaoNFT.address,
              abi: ChangeDaoNFT.abi,
              functionName: "setChangeDaoNFTFactory",
              params: {
                _changeDaoNFTFactory: ChangeDaoNFTFactory.address
              }
            });
            const response = await request.wait();
            await changeDaoNFT.factoryAddress.get();
          } catch (error) {
            notifyError(error.error || error);
          } finally {
            changeDaoNFT.factoryAddress.setting.value = false;
          }
        }
      },
      controllerAddress: {
        model: ref(""),
        loading: ref(false),
        setting: ref(false),
        color: computed(() =>
          changeDaoNFT.controllerAddress.model.value === Controller.address
            ? "text-positive"
            : "text-negative"
        ),
        get: async () => {
          try {
            changeDaoNFT.controllerAddress.loading.value = true;
            changeDaoNFT.controllerAddress.model.value = await Moralis.executeFunction(
              {
                contractAddress: ChangeDaoNFT.address,
                abi: ChangeDaoNFT.abi,
                functionName: "controller"
              }
            );
          } catch (error) {
            notifyError(error.error || error);
          } finally {
            changeDaoNFT.controllerAddress.loading.value = false;
          }
        },
        set: async () => {
          try {
            changeDaoNFT.controllerAddress.setting.value = true;
            const request = await Moralis.executeFunction({
              contractAddress: ChangeDaoNFT.address,
              abi: ChangeDaoNFT.abi,
              functionName: "setController",
              params: {
                _controller: Controller.address
              }
            });
            const response = await request.wait();
            await changeDaoNFT.controllerAddress.get();
          } catch (error) {
            notifyError(error.error || error);
          } finally {
            changeDaoNFT.controllerAddress.setting.value = false;
          }
        }
      },
      feeNumerator: {
        model: ref(0),
        loading: ref(false),
        setting: ref(false),
        get: async () => {
          try {
            changeDaoNFT.feeNumerator.loading.value = true;
            changeDaoNFT.feeNumerator.model.value = await Moralis.executeFunction(
              {
                contractAddress: ChangeDaoNFT.address,
                abi: ChangeDaoNFT.abi,
                functionName: "feeNumerator"
              }
            );
          } catch (error) {
            notifyError(error.error || error);
          } finally {
            changeDaoNFT.feeNumerator.loading.value = false;
          }
        },
        set: async () => {
          try {
            changeDaoNFT.feeNumerator.setting.value = true;
            const request = await Moralis.executeFunction({
              contractAddress: ChangeDaoNFT.address,
              abi: ChangeDaoNFT.abi,
              functionName: "setFeeNumerator",
              params: {
                _feeNumerator: Moralis.web3Library.BigNumber.from(
                  changeDaoNFT.feeNumerator.model.value
                )
              }
            });
            const response = await request.wait();
            await changeDaoNFT.feeNumerator.get();
          } catch (error) {
            notifyError(error.error || error);
          } finally {
            changeDaoNFT.feeNumerator.setting.value = false;
          }
        }
      }
    };

    const changeDaoNFTFactory = {
      get: () =>
        Promise.all([
          changeDaoNFTFactory.i12nAddress.get(),
          changeDaoNFTFactory.controllerAddress.get()
        ]),
      i12nAddress: {
        model: ref(""),
        loading: ref(false),
        setting: ref(false),
        color: computed(() =>
          changeDaoNFTFactory.i12nAddress.model.value === ChangeDaoNFT.address
            ? "text-positive"
            : "text-negative"
        ),
        get: async () => {
          try {
            changeDaoNFTFactory.i12nAddress.loading.value = true;
            changeDaoNFTFactory.i12nAddress.model.value = await Moralis.executeFunction(
              {
                contractAddress: ChangeDaoNFTFactory.address,
                abi: ChangeDaoNFTFactory.abi,
                functionName: "changeDaoNFTImplementation"
              }
            );
          } catch (error) {
            notifyError(error.error || error);
          } finally {
            changeDaoNFTFactory.i12nAddress.loading.value = false;
          }
        },
        set: async () => {
          try {
            changeDaoNFTFactory.i12nAddress.setting.value = true;
            const request = await Moralis.executeFunction({
              contractAddress: ChangeDaoNFTFactory.address,
              abi: ChangeDaoNFTFactory.abi,
              functionName: "setChangeDaoNFTImplementation",
              params: {
                _newCDNFTImplementation: ChangeDaoNFT.address
              }
            });
            const response = await request.wait();
            await changeDaoNFTFactory.i12nAddress.get();
          } catch (error) {
            notifyError(error.error || error);
          } finally {
            changeDaoNFTFactory.i12nAddress.setting.value = false;
          }
        }
      },
      controllerAddress: {
        model: ref(""),
        loading: ref(false),
        setting: ref(false),
        color: computed(() =>
          changeDaoNFTFactory.controllerAddress.model.value ===
          Controller.address
            ? "text-positive"
            : "text-negative"
        ),
        get: async () => {
          try {
            changeDaoNFTFactory.controllerAddress.loading.value = true;
            changeDaoNFTFactory.controllerAddress.model.value = await Moralis.executeFunction(
              {
                contractAddress: ChangeDaoNFTFactory.address,
                abi: ChangeDaoNFTFactory.abi,
                functionName: "controller"
              }
            );
          } catch (error) {
            notifyError(error.error || error);
          } finally {
            changeDaoNFTFactory.controllerAddress.loading.value = false;
          }
        },
        set: async () => {
          try {
            changeDaoNFTFactory.controllerAddress.setting.value = true;
            const request = await Moralis.executeFunction({
              contractAddress: ChangeDaoNFTFactory.address,
              abi: ChangeDaoNFTFactory.abi,
              functionName: "setController",
              params: {
                _controller: Controller.address
              }
            });
            const response = await request.wait();
            await changeDaoNFTFactory.controllerAddress.get();
          } catch (error) {
            notifyError(error.error || error);
          } finally {
            changeDaoNFTFactory.controllerAddress.setting.value = false;
          }
        }
      }
    };

    const paymentSplitterFactory = {
      get: () =>
        Promise.all([
          paymentSplitterFactory.fundingA9sAddress.get(),
          paymentSplitterFactory.paymentSplitterAddress.get(),
          paymentSplitterFactory.controllerAddress.get()
        ]),
      fundingA9sAddress: {
        model: ref(""),
        loading: ref(false),
        setting: ref(false),
        color: computed(() =>
          paymentSplitterFactory.fundingA9sAddress.model.value ===
          FundingAllocations.address
            ? "text-positive"
            : "text-negative"
        ),
        get: async () => {
          try {
            paymentSplitterFactory.fundingA9sAddress.loading.value = true;
            paymentSplitterFactory.fundingA9sAddress.model.value = await Moralis.executeFunction(
              {
                contractAddress: PaymentSplitterFactory.address,
                abi: PaymentSplitterFactory.abi,
                functionName: "allocations"
              }
            );
          } catch (error) {
            notifyError(error.error || error);
          } finally {
            paymentSplitterFactory.fundingA9sAddress.loading.value = false;
          }
        },
        set: async () => {
          try {
            paymentSplitterFactory.fundingA9sAddress.setting.value = true;
            const request = await Moralis.executeFunction({
              contractAddress: PaymentSplitterFactory.address,
              abi: PaymentSplitterFactory.abi,
              functionName: "setFundingAllocations",
              params: {
                _allocations: FundingAllocations.address
              }
            });
            const response = await request.wait();
            await paymentSplitterFactory.fundingA9sAddress.get();
          } catch (error) {
            notifyError(error.error || error);
          } finally {
            paymentSplitterFactory.fundingA9sAddress.setting.value = false;
          }
        }
      },
      paymentSplitterAddress: {
        model: ref(""),
        loading: ref(false),
        setting: ref(false),
        color: computed(() =>
          paymentSplitterFactory.paymentSplitterAddress.model.value ===
          PaymentSplitter.address
            ? "text-positive"
            : "text-negative"
        ),
        get: async () => {
          try {
            paymentSplitterFactory.paymentSplitterAddress.loading.value = true;
            paymentSplitterFactory.paymentSplitterAddress.model.value = await Moralis.executeFunction(
              {
                contractAddress: PaymentSplitterFactory.address,
                abi: PaymentSplitterFactory.abi,
                functionName: "paymentSplitter"
              }
            );
          } catch (error) {
            notifyError(error.error || error);
          } finally {
            paymentSplitterFactory.paymentSplitterAddress.loading.value = false;
          }
        },
        set: async () => {
          try {
            paymentSplitterFactory.paymentSplitterAddress.setting.value = true;
            const request = await Moralis.executeFunction({
              contractAddress: PaymentSplitterFactory.address,
              abi: PaymentSplitterFactory.abi,
              functionName: "setPaymentSplitterImplementation",
              params: {
                _paymentSplitter: PaymentSplitter.address
              }
            });
            const response = await request.wait();
            await paymentSplitterFactory.paymentSplitterAddress.get();
          } catch (error) {
            notifyError(error.error || error);
          } finally {
            paymentSplitterFactory.paymentSplitterAddress.setting.value = false;
          }
        }
      },
      controllerAddress: {
        model: ref(""),
        loading: ref(false),
        setting: ref(false),
        color: computed(() =>
          paymentSplitterFactory.controllerAddress.model.value ===
          Controller.address
            ? "text-positive"
            : "text-negative"
        ),
        get: async () => {
          try {
            paymentSplitterFactory.controllerAddress.loading.value = true;
            paymentSplitterFactory.controllerAddress.model.value = await Moralis.executeFunction(
              {
                contractAddress: PaymentSplitterFactory.address,
                abi: PaymentSplitterFactory.abi,
                functionName: "controller"
              }
            );
          } catch (error) {
            notifyError(error.error || error);
          } finally {
            paymentSplitterFactory.controllerAddress.loading.value = false;
          }
        },
        set: async () => {
          try {
            paymentSplitterFactory.controllerAddress.setting.value = true;
            const request = await Moralis.executeFunction({
              contractAddress: PaymentSplitterFactory.address,
              abi: PaymentSplitterFactory.abi,
              functionName: "setController",
              params: {
                _controller: Controller.address
              }
            });
            const response = await request.wait();
            await paymentSplitterFactory.controllerAddress.get();
          } catch (error) {
            notifyError(error.error || error);
          } finally {
            paymentSplitterFactory.controllerAddress.setting.value = false;
          }
        }
      }
    };

    const sharedFundingFactory = {
      get: () =>
        Promise.all([
          sharedFundingFactory.i12nAddress.get(),
          sharedFundingFactory.fundingA9sAddress.get(),
          sharedFundingFactory.controllerAddress.get()
        ]),
      i12nAddress: {
        model: ref(""),
        loading: ref(false),
        setting: ref(false),
        color: computed(() =>
          sharedFundingFactory.i12nAddress.model.value === SharedFunding.address
            ? "text-positive"
            : "text-negative"
        ),
        get: async () => {
          try {
            sharedFundingFactory.i12nAddress.loading.value = true;
            sharedFundingFactory.i12nAddress.model.value = await Moralis.executeFunction(
              {
                contractAddress: SharedFundingFactory.address,
                abi: SharedFundingFactory.abi,
                functionName: "sharedFunding"
              }
            );
          } catch (error) {
            notifyError(error.error || error);
          } finally {
            sharedFundingFactory.i12nAddress.loading.value = false;
          }
        },
        set: async () => {
          try {
            sharedFundingFactory.i12nAddress.setting.value = true;
            const request = await Moralis.executeFunction({
              contractAddress: SharedFundingFactory.address,
              abi: SharedFundingFactory.abi,
              functionName: "setSharedFundingImplementation",
              params: {
                _sharedFunding: SharedFunding.address
              }
            });
            const response = await request.wait();
            await sharedFundingFactory.i12nAddress.get();
          } catch (error) {
            notifyError(error.error || error);
          } finally {
            sharedFundingFactory.i12nAddress.setting.value = false;
          }
        }
      },
      fundingA9sAddress: {
        model: ref(""),
        loading: ref(false),
        setting: ref(false),
        color: computed(() =>
          sharedFundingFactory.fundingA9sAddress.model.value ===
          FundingAllocations.address
            ? "text-positive"
            : "text-negative"
        ),
        get: async () => {
          try {
            sharedFundingFactory.fundingA9sAddress.loading.value = true;
            sharedFundingFactory.fundingA9sAddress.model.value = await Moralis.executeFunction(
              {
                contractAddress: SharedFundingFactory.address,
                abi: SharedFundingFactory.abi,
                functionName: "allocations"
              }
            );
          } catch (error) {
            notifyError(error.error || error);
          } finally {
            sharedFundingFactory.fundingA9sAddress.loading.value = false;
          }
        },
        set: async () => {
          try {
            sharedFundingFactory.fundingA9sAddress.setting.value = true;
            const request = await Moralis.executeFunction({
              contractAddress: SharedFundingFactory.address,
              abi: SharedFundingFactory.abi,
              functionName: "setFundingAllocations",
              params: {
                _allocations: FundingAllocations.address
              }
            });
            const response = await request.wait();
            await sharedFundingFactory.fundingA9sAddress.get();
          } catch (error) {
            notifyError(error.error || error);
          } finally {
            sharedFundingFactory.fundingA9sAddress.setting.value = false;
          }
        }
      },
      controllerAddress: {
        model: ref(""),
        loading: ref(false),
        setting: ref(false),
        color: computed(() =>
          sharedFundingFactory.controllerAddress.model.value ===
          Controller.address
            ? "text-positive"
            : "text-negative"
        ),
        get: async () => {
          try {
            sharedFundingFactory.controllerAddress.loading.value = true;
            sharedFundingFactory.controllerAddress.model.value = await Moralis.executeFunction(
              {
                contractAddress: SharedFundingFactory.address,
                abi: SharedFundingFactory.abi,
                functionName: "controller"
              }
            );
          } catch (error) {
            notifyError(error.error || error);
          } finally {
            sharedFundingFactory.controllerAddress.loading.value = false;
          }
        },
        set: async () => {
          try {
            sharedFundingFactory.controllerAddress.setting.value = true;
            const request = await Moralis.executeFunction({
              contractAddress: SharedFundingFactory.address,
              abi: SharedFundingFactory.abi,
              functionName: "setController",
              params: {
                _controller: Controller.address
              }
            });
            const response = await request.wait();
            await sharedFundingFactory.controllerAddress.get();
          } catch (error) {
            notifyError(error.error || error);
          } finally {
            sharedFundingFactory.controllerAddress.setting.value = false;
          }
        }
      }
    };

    const fundingA9s = {
      get: () =>
        Promise.all([
          fundingA9s.changeDaoRoyalties.get(),
          fundingA9s.changeDaoFunding.get(),
          fundingA9s.changeDaoWallet.get()
        ]),
      changeDaoFunding: {
        model: ref(0),
        loading: ref(false),
        setting: ref(false),
        get: async () => {
          try {
            fundingA9s.changeDaoFunding.loading.value = true;
            fundingA9s.changeDaoFunding.model.value = await Moralis.executeFunction(
              {
                contractAddress: FundingAllocations.address,
                abi: FundingAllocations.abi,
                functionName: "changeDaoFunding"
              }
            );
          } catch (error) {
            notifyError(error.error || error);
          } finally {
            fundingA9s.changeDaoFunding.loading.value = false;
          }
        },
        set: async () => {
          try {
            fundingA9s.changeDaoFunding.setting.value = true;
            const request = await Moralis.executeFunction({
              contractAddress: FundingAllocations.address,
              abi: FundingAllocations.abi,
              functionName: "setChangeDaoFunding",
              params: {
                _fundingShares: Moralis.web3Library.BigNumber.from(
                  fundingA9s.changeDaoFunding.model.value
                )
              }
            });
            const response = await request.wait();
            await fundingA9s.changeDaoFunding.get();
          } catch (error) {
            notifyError(error.error || error);
          } finally {
            fundingA9s.changeDaoFunding.setting.value = false;
          }
        }
      },
      changeDaoRoyalties: {
        model: ref(0),
        loading: ref(false),
        setting: ref(false),
        get: async () => {
          try {
            fundingA9s.changeDaoRoyalties.loading.value = true;
            fundingA9s.changeDaoRoyalties.model.value = await Moralis.executeFunction(
              {
                contractAddress: FundingAllocations.address,
                abi: FundingAllocations.abi,
                functionName: "changeDaoRoyalties"
              }
            );
          } catch (error) {
            notifyError(error.error || error);
          } finally {
            fundingA9s.changeDaoRoyalties.loading.value = false;
          }
        },
        set: async () => {
          try {
            fundingA9s.changeDaoRoyalties.setting.value = true;
            const request = await Moralis.executeFunction({
              contractAddress: FundingAllocations.address,
              abi: FundingAllocations.abi,
              functionName: "setChangeDaoRoyalties",
              params: {
                _royaltiesShares: Moralis.web3Library.BigNumber.from(
                  fundingA9s.changeDaoRoyalties.model.value
                )
              }
            });
            const response = await request.wait();
            await fundingA9s.changeDaoRoyalties.get();
          } catch (error) {
            notifyError(error.error || error);
          } finally {
            fundingA9s.changeDaoRoyalties.setting.value = false;
          }
        }
      },
      changeDaoWallet: {
        model: ref(""),
        loading: ref(false),
        setting: ref(false),
        get: async () => {
          try {
            fundingA9s.changeDaoWallet.loading.value = true;
            fundingA9s.changeDaoWallet.model.value = await Moralis.executeFunction(
              {
                contractAddress: FundingAllocations.address,
                abi: FundingAllocations.abi,
                functionName: "changeDaoWallet"
              }
            );
          } catch (error) {
            notifyError(error.error || error);
          } finally {
            fundingA9s.changeDaoWallet.loading.value = false;
          }
        },
        set: async () => {
          try {
            fundingA9s.changeDaoWallet.setting.value = true;
            const request = await Moralis.executeFunction({
              contractAddress: FundingAllocations.address,
              abi: FundingAllocations.abi,
              functionName: "setChangeDaoWallet",
              params: {
                _changeDaoWallet: fundingA9s.changeDaoWallet.model.value
              }
            });
            const response = await request.wait();
            await fundingA9s.changeDaoWallet.get();
          } catch (error) {
            notifyError(error.error || error);
          } finally {
            fundingA9s.changeDaoWallet.setting.value = false;
          }
        }
      }
    };

    const paymentSplitter = {
      funds: ref(""),
      releasing: ref(false),
      releaseFunds: async () => {
        try {
          paymentSplitter.releasing.value = true;
          const request = await Moralis.executeFunction({
            contractAddress: PaymentSplitter.address,
            abi: PaymentSplitter.abi,
            functionName: "ownerReleaseAll"
          });
          const response = await request.wait();
        } catch (error) {
          notifyError(error.error || error);
        } finally {
          paymentSplitter.releasing.value = false;
        }
      }
    };

    // Validation rules
    const isValidAddress = address =>
      Moralis.web3Library.utils.isAddress(address);
    const isValidShare = share => share >= 0 && share <= 1e4;

    return {
      isValidAddress,
      isValidShare,
      contracts: {
        ChangeDaoNFT,
        ChangeDaoNFTFactory,
        ChangeMakers,
        Controller,
        FundingAllocations,
        PaymentSplitter,
        PaymentSplitterFactory,
        SharedFunding,
        SharedFundingFactory
      },
      changeDaoNFT,
      changeDaoNFTFactory,
      paymentSplitterFactory,
      sharedFundingFactory,
      fundingA9s,
      paymentSplitter
    };
  }
});
</script>

<style lang="scss">
.q-field__bottom {
  display: none;
}
</style>
