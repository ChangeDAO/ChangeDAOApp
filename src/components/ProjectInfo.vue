<template>
  <div>
    <!-- Project Name -->
    <p class="text-h3">
      {{ project.name }}<br />

      <!-- Changemaker Name -->
      <span class="text-accent text-h4">
        <q-avatar size="sm" color="grey-5" class="q-my-sm q-mr-sm" square />{{
          project.creator.name
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
      <!-- Collection -->
      <span>{{ $t("Collection") }}</span>
      <br />
      <span class="text-accent">
        {{ project.collection.name }}
      </span>
      <!-- <router-link
        :to="{ name: 'collection', params: { id: project.collection.id } }"
      >
        {{ project.collection.name }}
      </router-link> -->

      <br />
    </p>

    <template v-if="!minimal">
      <!-- Supported Causes -->
      <p>
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
      </p>

      <!-- Areas of Change -->
      <p>{{ $t("Areas of Change") }}</p>
      <div class="q-gutter-md">
        <q-chip
          v-for="area in project.areasOfChange"
          :key="area"
          :label="$t('areasOfChange.' + area)"
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
export default {
  props: {
    project: Object,
    minimal: Boolean
  }
};
</script>
