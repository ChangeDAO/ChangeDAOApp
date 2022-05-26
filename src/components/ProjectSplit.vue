<template>
  <Chart chart-class="ProjectSplit" :options="options" />
</template>

<script>
import { defineComponent } from "vue";

import Chart from "./Chart";

import { shortAddr } from "../util/formatting";

export default defineComponent({
  name: "ProjectSplit",

  components: { Chart },

  props: {
    project: {
      required: true,
      type: Object
    }
  },

  setup(props, context) {
    const names = {
      changeDao: "ChangeDAO"
    };
    props.project._creators.forEach((addr, i) => {
      names[i] = shortAddr(addr);
    });

    const splitData = { changeDao: 200 };
    props.project._fundingPayees.forEach((addr, i) => {
      splitData[i] = props.project._fundingShares[i];
    });

    for (let id in names) {
      names[id] = `${splitData[id] / 100}% – ${names[id]}`;
    }

    const options = {
      pie: {
        label: {
          show: false
        }
      },
      data: {
        type: "pie",
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
