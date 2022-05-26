<template>
  <div>
    <!-- Project Name -->
    <p class="text-h3">
      {{ project._projectName }}<br />

      <!-- Changemaker Name -->
      <span class="text-accent text-h4">
        <q-avatar size="sm" color="grey-5" class="q-my-sm q-mr-sm" square />{{
          shortAddr(project._creators[0])
        }}
      </span>
      <!-- <router-link
        class="text-h4"
        :to="{ name: 'user', params: { id: project.creator.id } }"
      >
        <q-avatar size="sm" color="grey-5" class="q-my-sm q-mr-sm" />{{
          project.creator.name
        }}
      </router-link> -->
    </p>

    <p>
      <!-- Movement -->
      <span>{{ $t("Movement") }}</span>
      <br />
      <span class="text-accent">
        {{ project._movementName }}
      </span>

      <br />
    </p>

    <template v-if="!minimal">
      <!-- Supported Causes -->
      <!-- <p>
        <span>{{ $t("Supported Causes") }}</span>
        <template v-for="(cause, i) in project.supportedCauses" :key="i">
          <br />
          <span class="text-accent">
            <q-avatar
              size="sm"
              color="grey-5"
              class="q-my-sm q-mr-sm"
              square
            />{{ cause }}
          </span>
        </template>
      </p> -->

      <!-- Area of Change -->
      <p>{{ $t("Area of Change") }}</p>
      <div class="q-gutter-md">
        <q-chip
          :label="$t('areasOfChange.' + project.areaOfChange)"
          class="text-subtitle1"
          :clickable="false"
          :ripple="false"
          color="primary"
        />
      </div>
    </template>
  </div>
</template>

<script>
import { shortAddr } from "../util/formatting";

export default {
  props: {
    project: Object,
    minimal: Boolean
  },
  methods: {
    shortAddr
  }
};
</script>
