<template>
  <q-list>
    <slot name="before" />
    <SmoothReflow>
      <q-item v-for="(payee, i) in payeesModel" :key="i + 1">
        <q-item-section>
          <!-- Payee Address -->
          <q-item-label class="row q-gutter-x-sm">
            <q-input
              class="col"
              v-model="payeesModel[i]"
              :label="$t('Wallet Address')"
              :rules="[isValid]"
              :autofocus="!payee"
              hide-bottom-space
              v-bind="$attrs"
            >
              <template v-slot:prepend>
                <AddrAvatar v-if="isValid(payee)" :address="payee" />
                <q-avatar v-else color="primary" size="sm" />
              </template>
            </q-input>

            <q-input
              v-model.number="sharesModel[i]"
              type="number"
              :min="1"
              :max="totalShares - sharesModel.length"
              :label="$t('Shares')"
              @change="balanceShares(i)"
            />
          </q-item-label>

          <!-- Shares -->
          <q-item-label>
            <q-slider
              v-model="sharesModel[i]"
              :min="1"
              :max="totalShares - sharesModel.length"
              @change="balanceShares(i)"
            />
          </q-item-label>
        </q-item-section>

        <!-- Delete -->
        <q-item-section side>
          <q-btn @click="remove(i)" icon="delete" round flat />
        </q-item-section>
      </q-item>
    </SmoothReflow>

    <q-item @click="add" class="non-selectable" clickable v-ripple>
      <q-item-section side>
        <q-icon name="add" />
      </q-item-section>
      <q-item-section>
        {{ $t("Add") }}
      </q-item-section>
      <q-item-section side>
        {{ sum }}
      </q-item-section>
    </q-item>

    <slot name="after" />
  </q-list>
</template>

<script>
import AddrAvatar from "./AddrAvatar";
import SmoothReflow from "./SmoothReflow";

import Moralis from "moralis";
import { computed } from "vue";

export default {
  name: "PaymentSplitInput",
  components: { AddrAvatar, SmoothReflow },
  props: {
    payees: Array,
    shares: Array,
    totalShares: {
      type: Number,
      default: 10000
    }
  },
  setup(props, { emit }) {
    const payeesModel = computed({
      get() {
        return props.payees;
      },
      set(value) {
        emit("update:payees", value);
      }
    });

    const sharesModel = computed({
      get() {
        return props.shares;
      },
      set(value) {
        emit("update:shares", value);
      }
    });

    const add = () => {
      sharesModel.value.push(
        Math.round(props.totalShares / (sharesModel.value.length + 1))
      );
      payeesModel.value.push("");
      balanceShares(sharesModel.value.length - 1);
    };

    const remove = index => {
      sharesModel.value.splice(index, 1);
      payeesModel.value.splice(index, 1);
      balanceShares();
    };

    const balanceShares = (ignoreIndex = null) => {
      const shares = sharesModel.value;

      if (shares.length === 1) {
        shares[0] = props.totalShares;
        return;
      }

      let lastSum = null,
        sum,
        diff,
        balance;
      while (sum !== props.totalShares && sum !== lastSum) {
        lastSum = sum;
        sum = shares.reduce((a, b) => a + b, 0);
        diff = props.totalShares - sum;
        balance = sum;
        if (ignoreIndex !== null) {
          balance -= shares[ignoreIndex];
        }
        if (diff === 0) {
          return;
        }

        // Spread the difference evenly
        shares.forEach((share, i) => {
          if (ignoreIndex !== i) {
            shares[i] =
              shares[i] +
                Math.round(
                  (diff * (share || 1 / shares.length)) / (balance || 1)
                ) || 1;
          }
        });
      }

      // Correct rounding error
      if (diff) {
        let target;
        if (diff > 0) {
          target = Math.min.apply(null, shares);
        } else {
          target = Math.max.apply(null, shares);
        }
        shares[shares.indexOf(target)] += diff;
      }
    };

    const sum = computed(() => sharesModel.value.reduce((a, b) => a + b, 0));

    const isValid = addr => Moralis.web3Library.utils.isAddress(addr);

    return {
      payeesModel,
      sharesModel,
      add,
      remove,
      isValid,
      balanceShares,
      sum
    };
  }
};
</script>
