<template>
  <Chart class="SecondarySplit" :options="options" />
</template>

<style lang="scss">
.SecondarySplit {
  text {
    fill: $grey-1;
  }

  g.c3-chart-arcs {
    transform-origin: 100% 70%;
    transform: scale(0.5);
  }
}
</style>

<script>
import Chart from "./Chart";

export default {
  name: "SecondarySplit",

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
      names[id] = `${props.project.secondarySplit[id]}% - ${names[id]}`;
    }

    const options = {
      pie: {
        label: {
          show: false
        }
      },
      data: {
        type: "pie",
        json: props.project.secondarySplit,
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
      }
    };

    return {
      options
    };
  }
};
</script>
