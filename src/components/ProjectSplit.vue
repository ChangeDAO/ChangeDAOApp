<template>
  <Chart chart-class="ProjectSplit" :options="options" />
</template>

<script>
import Chart from "./Chart";

export default {
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
      donut: {
        width: 65,
        label: {
          show: false
        }
      },
      data: {
        type: "donut",
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
};
</script>
