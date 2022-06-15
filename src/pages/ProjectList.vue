<template>
  <q-page padding>
    <div class="justify-center">
      <div class="text-h5 text-uppercase row q-gutter-lg">
        <router-link :to="{ name: 'projects-featured' }">{{
          $t("Featured")
        }}</router-link>

        <router-link :to="{ name: 'projects' }">{{
          $t("All Projects")
        }}</router-link>
      </div>

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
          clickable
          v-ripple
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";

import { notifyError } from "src/util/notify";

import ProjectCard from "src/components/ProjectCard";

import Moralis from "moralis";

export default {
  name: "PageProjectList",

  components: { ProjectCard },

  setup() {
    const router = useRouter();

    const isFeatured = computed(() => {
      return router.currentRoute.name === "projects-featured";
    });

    const projects = ref([]);
    const getProjects = async (isFeatured) => {
      try {
        projects.value = (
          await Moralis.Cloud.run("getProjects", {
            isFeatured,
          })
        ).projects;
      } catch (error) {
        console.error(error);
        notifyError(error);
      }
    };

    watch(isFeatured, getProjects);
    getProjects(isFeatured.value);

    return {
      isFeatured,
      projects,
    };
  },
};
</script>
