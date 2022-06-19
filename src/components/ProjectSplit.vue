<template>
  <Chart chart-class="ProjectSplit" :options="options" />
</template>

<script>
import { defineComponent } from "vue";
import { useStore } from "vuex";
import { colors, getCssVar } from "quasar";
const { lighten } = colors;

import Chart from "./Chart";

import { CHANGEDAO_WALLET } from "../util/constants";
import { shortAddr } from "../util/formatting";

export default defineComponent({
  name: "ProjectSplit",

  components: { Chart },

  props: {
    project: {
      required: true,
      type: Object,
    },
  },

  setup(props, context) {
    const store = useStore();

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
    props.project.fundingPaymentSplitters.forEach((splitter) => {
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
      pie: {
        label: {
          show: false,
        },
      },
      data: {
        type: "pie",
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
