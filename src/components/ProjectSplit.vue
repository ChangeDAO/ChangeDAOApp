<template>
  <Chart chart-class="ProjectSplit" :options="options" />
</template>

<style lang="scss">
.ProjectSplit {
  g.c3-chart-arcs {
    transform-origin: 100% 100%;
    transform: scale(0.5);
    filter: drop-shadow(0 0 60px $grey-7);
  }
}
</style>

<script>
import { defineComponent } from "vue";

import Chart from "./Chart";

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
      creator: props.project.creator.name,
      collaborator1: props.project.collaborators.find(
        c => c.id === "collaborator1"
      ).name,
      collaborator2: props.project.collaborators.find(
        c => c.id === "collaborator2"
      ).name,
      changeDaoCommunityTreasury: "ChangeDAO CommunityTreasury.eth",
      changeDaoOperationsTreasury: "ChangeDAO OperationsTreasury.eth"
    };

    for (let id in names) {
      names[id] = `${props.project.primarySplit[id]}% – ${names[id]}`;
    }

    const options = {
      pie: {
        label: {
          show: false
        }
      },
      data: {
        type: "pie",
        json: props.project.primarySplit,
        names,
        colors: {
          creator: "#2EBAD3",
          collaborator1: "#137C8E",
          collaborator2: "#005A6A",
          changeDaoCommunityTreasury: "#8001FB",
          changeDaoOperationsTreasury: "#4F009C"
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
