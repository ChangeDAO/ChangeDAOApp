<template>
  <q-page padding>
    <div class="text-h4 q-mb-md non-selectable">
      {{ $t("Changemaker Approval") }}
    </div>
    <q-linear-progress v-if="!changemakers.length" indeterminate />
    <q-list v-else separator bordered>
      <q-expansion-item v-for="cm in changemakers" :key="cm.walletAddress">
        <template v-slot:header>
          <q-item-section side>
            <AddrAvatar :address="cm.walletAddress" />
          </q-item-section>
          <q-item-section>
            <q-item-label>
              {{ cm.firstName }} {{ cm.lastName }} ({{ cm.username }})
            </q-item-label>
            <q-item-label caption>
              <RelativeTime
                :before="$t('Created')"
                :value="cm.createdAt"
                class="text-caption"
              />
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <template v-if="!cm.isApproved">
              <div v-if="$q.screen.gt.xs" class="row">
                <q-btn
                  @click.stop="approve(cm)"
                  :label="$t(cm.isReviewed ? 'Reapprove' : 'Approve')"
                  :loading="approving[cm.id]"
                  color="positive"
                  flat
                />
                <q-btn
                  v-if="!cm.isReviewed"
                  @click.stop="deny(cm)"
                  :label="$t('Deny')"
                  :loading="denying[cm.id]"
                  color="negative"
                  flat
                />
              </div>
              <q-btn v-else icon="menu_dots" round flat>
                <q-menu>
                  <q-list>
                    <q-item @click="approve(cm)" clickable v-ripple>
                      <q-item-section side>
                        <q-spinner v-if="approving[cm.id]" />
                        <q-icon v-else name="success" color="positive" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{
                          $t(cm.isReviewed ? "Reapprove" : "Approve")
                        }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item
                      v-if="!cm.isReviewed"
                      @click="deny(cm)"
                      clickable
                      v-ripple
                    >
                      <q-item-section side>
                        <q-spinner v-if="denying[cm.id]" />
                        <q-icon v-else name="close" color="negative" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ $t("Deny") }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </template>
            <template v-else>
              <div class="row">
                <q-btn
                  @click.stop="revoke(cm)"
                  :label="$t('Revoke')"
                  :loading="revoking[cm.id]"
                  color="negative"
                  flat
                />
              </div>
            </template>
          </q-item-section>
        </template>

        <q-list>
          <!-- Wallet Address -->
          <q-item>
            <q-item-section>
              <q-item-label caption>{{ $t("Wallet Address") }}</q-item-label>
              <q-item-label>
                <q-item-label>
                  {{ cm.walletAddress }}
                </q-item-label>
              </q-item-label>
            </q-item-section>
          </q-item>

          <!-- Name -->
          <q-item>
            <q-item-section>
              <q-item-label caption>{{ $t("Name") }}</q-item-label>
              <q-item-label>
                <q-item-label>
                  {{ cm.firstName }} {{ cm.lastName }}
                </q-item-label>
              </q-item-label>
            </q-item-section>
          </q-item>

          <!-- Username -->
          <q-item>
            <q-item-section>
              <q-item-label caption>{{ $t("Username") }}</q-item-label>
              <q-item-label>
                {{ cm.username }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <!-- Username -->
          <q-item>
            <q-item-section>
              <q-item-label caption>{{ $t("Display Name") }}</q-item-label>
              <q-item-label>
                {{ cm.displayName }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <!-- Short Bio -->
          <q-item>
            <q-item-section>
              <q-item-label caption>{{ $t("Short Bio") }}</q-item-label>
              <q-item-label class="pre-line">
                {{ cm.shortBio }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <!-- Long Bio -->
          <q-item>
            <q-item-section>
              <q-item-label caption>{{ $t("Long Bio") }}</q-item-label>
              <q-item-label class="pre-line">
                {{ cm.longBio }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <!-- Email Address -->
          <q-item>
            <q-item-section side>
              <q-icon name="email" />
            </q-item-section>
            <q-item-section>
              <q-item-label caption>{{ $t("Email Address") }}</q-item-label>
              <q-item-label>
                {{ cm.email }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <!-- Twitter -->
          <q-item v-if="cm.social.twitter">
            <q-item-section side>
              <q-icon name="twitter" />
            </q-item-section>
            <q-item-section>
              <q-item-label caption>{{ $t("Twitter") }}</q-item-label>
              <q-item-label>
                {{ SOCIAL_URLS.TWITTER }}{{ cm.social.twitter }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <!-- Discord -->
          <q-item v-if="cm.social.discord">
            <q-item-section side>
              <q-icon name="discord" />
            </q-item-section>
            <q-item-section>
              <q-item-label caption>{{ $t("Discord") }}</q-item-label>
              <q-item-label>
                {{ SOCIAL_URLS.DISCORD }}{{ cm.social.discord }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <!-- Instagram -->
          <q-item v-if="cm.social.instagram">
            <q-item-section side>
              <q-icon name="instagram" />
            </q-item-section>
            <q-item-section>
              <q-item-label caption>{{ $t("Instagram") }}</q-item-label>
              <q-item-label>
                {{ SOCIAL_URLS.INSTAGRAM }}{{ cm.social.instagram }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <!-- YouTube -->
          <q-item v-if="cm.social.youtube">
            <q-item-section side>
              <q-icon name="youtube" />
            </q-item-section>
            <q-item-section>
              <q-item-label caption>{{ $t("YouTube") }}</q-item-label>
              <q-item-label>
                {{ SOCIAL_URLS.YOUTUBE }}{{ cm.social.youtube }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <!-- Website URL -->
          <q-item v-if="cm.social.website">
            <q-item-section side>
              <q-icon name="website" />
            </q-item-section>
            <q-item-section>
              <q-item-label caption>{{ $t("Website URL") }}</q-item-label>
              <q-item-label>https://{{ cm.social.website }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-expansion-item>
    </q-list>
  </q-page>
</template>

<script>
import Moralis from "moralis";
import { ref } from "vue";
import ChangeMakers from "../../contracts/deployments/rinkeby/ChangeMakers.json";

import { SOCIAL_URLS } from "../util/constants";
import { notifyError, notifySuccess } from "../util/notify";
import { shortAddr } from "../util/formatting";
import AddrAvatar from "../components/AddrAvatar";
import RelativeTime from "../components/RelativeTime";

import { TX_WAIT } from "../util/constants";

export default {
  name: "PageChangemakerManagement",

  components: { AddrAvatar, RelativeTime },

  setup() {
    // Validation rules
    const isValidAddress = (address) =>
      Moralis.web3Library.utils.isAddress(address);

    const changemakers = ref([]);
    try {
      Moralis.Cloud.run("getAllChangemakers").then((response) => {
        changemakers.value = response.changemakers;
        response.pending.forEach((pending) => {
          switch (pending.eventName) {
            case "ChangeMakerApproved":
              approving.value[pending.changemakerId] = true;
              break;
            case "ChangeMakerRevoked":
              revoking.value[pending.changemakerId] = true;
              break;
          }
        });
      });
    } catch (error) {
      notifyError(error.error || error);
    }

    const approving = ref({});
    const approve = async (cm) => {
      try {
        approving.value[cm.id] = true;
        const tx = await Moralis.executeFunction({
          contractAddress: ChangeMakers.address,
          abi: ChangeMakers.abi,
          functionName: "approveChangeMaker",
          params: {
            _changeMaker: cm.walletAddress,
          },
        });
        await Moralis.Cloud.run("approveChangemaker", {
          changemakerId: cm.id,
          transactionHash: tx.hash,
        });
        const response = await tx.wait(TX_WAIT);
        cm.isApproved = true;
        cm.isReviewed = true;
        notifySuccess("Success");
      } catch (error) {
        notifyError(error.error || error);
      } finally {
        approving.value[cm.id] = false;
      }
    };

    const denying = ref({});
    const deny = async (cm) => {
      try {
        denying.value[cm.id] = true;
        await Moralis.Cloud.run("denyChangemaker", {
          changemakerId: cm.id,
        });
        cm.isApproved = false;
        cm.isReviewed = true;
        notifySuccess("Success");
      } catch (error) {
        notifyError(error.error || error);
      } finally {
        denying.value[cm.id] = false;
      }
    };

    const revoking = ref({});
    const revoke = async (cm) => {
      try {
        revoking.value[cm.id] = true;
        const tx = await Moralis.executeFunction({
          contractAddress: ChangeMakers.address,
          abi: ChangeMakers.abi,
          functionName: "revokeChangeMaker",
          params: {
            _changeMaker: cm.walletAddress,
          },
        });
        await Moralis.Cloud.run("revokeChangemaker", {
          changemakerId: cm.id,
          transactionHash: tx.hash,
        });
        const response = await tx.wait(TX_WAIT);
        cm.isApproved = false;
        notifySuccess("Success");
      } catch (error) {
        notifyError(error.error || error);
      } finally {
        revoking.value[cm.id] = false;
      }
    };

    return {
      shortAddr,
      changemakers,
      approving,
      approve,
      denying,
      deny,
      revoking,
      revoke,
      SOCIAL_URLS,
    };
  },
};
</script>
