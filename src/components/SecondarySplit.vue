<template>
  <Chart chart-class="SecondarySplit" :options="options" />
</template>

<style lang="scss">
.SecondarySplit {
  text {
    fill: $grey-1;
  }
}
</style>

<script>
import { defineComponent } from "vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import { colors, getCssVar } from "quasar";
const { lighten } = colors;

import Chart from "./Chart";

import { CHANGEDAO_WALLET } from "../util/constants";
import { shortAddr } from "../util/formatting";

export default defineComponent({
  name: "SecondarySplit",

  components: { Chart },

  props: {
    project: {
      required: true,
      type: Object,
    },
  },

  setup(props, context) {
    const store = useStore();
    const { t } = useI18n({ useScope: "global" });

    const names = {
      [CHANGEDAO_WALLET]: "ChangeDAO",
    };
    const primaryColor = getCssVar("primary");
    const accentColor = getCssVar("accent");
    const colors = {
      [CHANGEDAO_WALLET]: primaryColor,
    };

    const splitData = {};
    const addresses = [];
    props.project.royaltiesPaymentSplitters.forEach((splitter) => {
      splitter.recipients.forEach((recipient, i) => {
        let address = recipient.ethAddress;
        splitData[address] = recipient.shares;
        if (!(address in names)) {
          let cm = store.state.changemakers[address.toLowerCase()];
          if (cm) {
            names[address] = cm.displayName;
          } else {
            names[address] = shortAddr(address);
            addresses.push(address);
          }
        }
        if (!(address in colors)) {
          colors[address] = lighten(accentColor, i * -10);
        }
      });
    });

    // Get changemaker info for unresolved addresses
    // addresses.forEach((address) =>
    //   store.dispatch("getChangemaker", address).then((cm) => {
    //     if (cm) {
    //       names[address] = `${splitData[address] / 100}% – ${cm.displayName}`;
    //     }
    //   })
    // );

    for (let id in names) {
      names[id] = `${splitData[id] / 100}% – ${names[id]}`;
    }

    const options = {
      donut: {
        width: 40,
        label: {
          show: false,
        },
        title: t("Secondary Sales"),
      },
      data: {
        type: "donut",
        json: splitData,
        names,
        colors,
      },
      tooltip: {
        show: false,
      },
      legend: {
        show: false,
      },
    };

    return {
      options,
    };
  },
});
</script>
