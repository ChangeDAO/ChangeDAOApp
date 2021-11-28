<template>
  <div ref="root" class="chart" />
</template>

<script>
import c3 from "c3";
import { defineComponent, ref, toRef, onMounted, onBeforeUnmount } from "vue";

export default defineComponent({
  name: "Chart",

  props: {
    options: {
      required: true,
      type: Object
    }
  },

  setup(props, context) {
    const root = ref(null);
    const chart = ref(null);

    const options = toRef(props, "options");

    onMounted(() => {
      chart.value = c3.generate({
        ...options.value,
        bindto: root.value
      });
    });

    onBeforeUnmount(() => {
      if (chart.value) {
        chart.value = chart.value.destroy();
      }
    });

    const dispatch = cb => {
      if (cb && chart.value) {
        cb.call(null, chart.value);
      }
    };

    return {
      root,
      chart,
      dispatch
    };
  }
});
</script>
