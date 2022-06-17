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
    props.project.royaltiesPaymentSplitters.forEach((splitter) => {
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
