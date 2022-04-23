<template>
  <q-page padding>
    <div class="text-h4 q-mb-md">Changemaker Approval</div>
    <q-list separator bordered>
      <q-expansion-item v-for="request in requests" :key="request.address">
        <template v-slot:header>
          <q-item-section side>
            <AddrAvatar :value="request.address" />
          </q-item-section>
          <q-item-section>
            <q-item-label>
              {{ request.firstName }} {{ request.lastName }} ({{
                request.username
              }})
            </q-item-label>
            <q-item-label caption>
              {{ shortAddr(request.address) }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <div class="row col">
              <q-btn
                @click.stop="approve"
                :label="$t('Approve')"
                :loading="approving.includes(request.address)"
                color="positive"
                flat
              />
              <q-btn
                @click.stop="deny"
                :label="$t('Deny')"
                :loading="denying.includes(request.address)"
                color="negative"
                flat
              />
            </div>
          </q-item-section>
        </template>

        <q-list>
          <!-- Name -->
          <q-item>
            <q-item-section>
              <q-item-label caption>{{ $t("Name") }}</q-item-label>
              <q-item-label>
                <q-item-label>
                  {{ request.firstName }} {{ request.lastName }}
                </q-item-label>
              </q-item-label>
            </q-item-section>
          </q-item>

          <!-- Username -->
          <q-item>
            <q-item-section>
              <q-item-label caption>{{ $t("Username") }}</q-item-label>
              <q-item-label>
                {{ request.username }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <!-- Short Bio -->
          <q-item>
            <q-item-section>
              <q-item-label caption>{{ $t("Short Bio") }}</q-item-label>
              <q-item-label>
                {{ request.shortBio }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <!-- Long Bio -->
          <q-item>
            <q-item-section>
              <q-item-label caption>{{ $t("Long Bio") }}</q-item-label>
              <q-item-label>
                {{ request.longBio }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <!-- Creating Change By -->
          <q-item>
            <q-item-section>
              <q-item-label caption>{{
                $t("Creating Change By")
              }}</q-item-label>
              <q-item-label>
                {{ request.creatingChangeBy }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <!-- Twitter -->
          <q-item>
            <q-item-section>
              <q-item-label caption>{{ $t("Twitter") }}</q-item-label>
              <q-item-label>
                {{ request.twitter }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <!-- Discord -->
          <q-item>
            <q-item-section>
              <q-item-label caption>{{ $t("Discord") }}</q-item-label>
              <q-item-label>
                {{ request.discord }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <!-- Instagram -->
          <q-item>
            <q-item-section>
              <q-item-label caption>{{ $t("Instagram") }}</q-item-label>
              <q-item-label>
                {{ request.instagram }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <!-- TikTok -->
          <q-item>
            <q-item-section>
              <q-item-label caption>{{ $t("TikTok") }}</q-item-label>
              <q-item-label>
                {{ request.tiktok }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <!-- YouTube -->
          <q-item>
            <q-item-section>
              <q-item-label caption>{{ $t("YouTube") }}</q-item-label>
              <q-item-label>
                {{ request.youtube }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <!-- Website URL -->
          <q-item>
            <q-item-section>
              <q-item-label caption>{{ $t("Website URL") }}</q-item-label>
              <q-item-label>
                {{ request.website }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-expansion-item>
    </q-list>
  </q-page>
</template>

<script>
import Moralis from "moralis";
import { defineComponent, computed, ref } from "vue";
import { LocalStorage } from "quasar";

import { notifyError, shortAddr } from "../util/formatting";
import AddrAvatar from "../components/AddrAvatar";

export default defineComponent({
  name: "PageChangemakerManagement",

  components: { AddrAvatar },

  setup() {
    // Validation rules
    const isValidAddress = address =>
      Moralis.web3Library.utils.isAddress(address);

    const requests = ref([]);
    // Temporarily populate from LocalStorage
    const data = LocalStorage.getItem("changemakerSignup");
    if (data) {
      requests.value.push(data);
    }

    const approving = ref([]);
    const approve = async () => {};

    const denying = ref([]);
    const deny = async () => {};

    return {
      requests,
      shortAddr,
      approve,
      approving,
      deny,
      denying
    };
  }
});
</script>
