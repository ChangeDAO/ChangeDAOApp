<template>
  <Chart chart-class="ProjectSplit" :options="options" />
</template>

<script>
import { defineComponent } from "vue";
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
    const names = {
      [CHANGEDAO_WALLET]: "ChangeDAO",
    };
    const primaryColor = getCssVar("primary");
    const accentColor = getCssVar("accent");
    const colors = {
      [CHANGEDAO_WALLET]: primaryColor,
    };

    const splitData = {};
    props.project.fundingPaymentSplitters.forEach((splitter) => {
      splitter.recipients.forEach((recipient, i) => {
        splitData[recipient.ethAddress] = recipient.shares;
        if (!(recipient.ethAddress in names)) {
          names[recipient.ethAddress] = shortAddr(recipient.ethAddress);
        }
        if (!(recipient.ethAddress in colors)) {
          colors[recipient.ethAddress] = lighten(accentColor, i * -10);
        }
      });
    });

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
