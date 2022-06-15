<template>
  <q-page class="bg-gradient" padding>
    <q-tabs
      v-model="tab"
      inline-label
      active-color="grey-1"
      content-class="text-hl q-my-xl"
    >
      <q-tab name="featured" :label="$t('Featured')" />
      <q-tab name="all" :label="$t('All Projects')" />
    </q-tabs>

    <div class="projects row q-gutter-xl justify-center q-py-xl">
      <ProjectCard
        style="max-width: 300px"
        v-for="project in projects"
        :key="project.id"
        :project="project"
        @click="
          $router.push({
            name: 'project-mint',
            params: { projectID: project.id },
          })
        "
        class="cursor-pointer"
        v-ripple
      />
    </div>
  </q-page>
</template>

<script>
import Moralis from "moralis";
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { Loading } from "quasar";

import { notifyError } from "src/util/notify";

import ProjectCard from "src/components/ProjectCard";

export default {
  name: "PageProjectList",

  components: { ProjectCard },

  setup() {
    const router = useRouter();

    const isFeatured = computed(() => {
      return router.currentRoute.value.name === "projects-featured";
    });

    const tab = computed({
      get() {
        return isFeatured.value ? "featured" : "all";
      },
      set(value) {
        router.replace({
          name: value === "featured" ? "projects-featured" : "projects",
        });
      },
    });

    const projects = ref([]);
    const getProjects = async (isFeatured) => {
      try {
        Loading.show();
        projects.value = (
          await Moralis.Cloud.run(
            "getProjects",
            isFeatured ? { isFeatured: true } : undefined
          )
        ).projects;
      } catch (error) {
        console.error(error);
        notifyError(error);
      } finally {
        Loading.hide();
      }
    };

    watch(isFeatured, getProjects);
    getProjects(isFeatured.value);

    return {
      tab,
      projects,
    };
  },
};
</script>
