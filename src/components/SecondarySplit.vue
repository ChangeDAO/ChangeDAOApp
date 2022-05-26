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

import Chart from "./Chart";

import { shortAddr } from "../util/formatting";

export default defineComponent({
  name: "SecondarySplit",

  components: { Chart },

  props: {
    project: {
      required: true,
      type: Object
    }
  },

  setup(props, context) {
    const { t } = useI18n({ useScope: "global" });

    const names = {
      changeDao: "ChangeDAO"
    };
    props.project._creators.forEach((addr, i) => {
      names[i] = shortAddr(addr);
    });

    const splitData = { changeDao: 2000 };
    props.project._royaltiesPayees.forEach((addr, i) => {
      splitData[i] = props.project._royaltiesShares[i];
    });

    for (let id in names) {
      names[id] = `${splitData[id] / 100}% – ${names[id]}`;
    }

    const options = {
      donut: {
        width: 40,
        label: {
          show: false
        },
        title: t("Secondary Sales")
      },
      data: {
        type: "donut",
        json: splitData,
        names,
        colors: {
          changeDao: "#8001FB",
          0: "#2EBAD3",
          1: "#137C8E",
          2: "#005A6A"
        }
      },
      tooltip: {
        show: false
      },
      legend: {
        show: false
      }
    };

    return {
      options
    };
  }
});
</script>
