<template>
  <q-page class="page-home">
    <!-- Landing -->
    <div class="row reverse justify-center items-center landing">
      <q-card-section class="col-12 col-sm-6">
        <img
          src="https://uyoiyikhfnid.usemoralis.com:2053/server/files/WD5H5Q6OSZh069zAtZ58bx0qtD1Bc0Cg66aVa00D/783338aa382fb5c02770333f9cfc7e66_Global%20Demonstration_Share%20Your%20Light.png"
          style="width: 100%"
        />
      </q-card-section>
      <q-card-section class="col-12 col-sm-6">
        <p class="text-h2">ChangeDAO</p>
        <p class="text-h4">Share Your Light</p>
        <p class="text-caption">Global Demonstration</p>
        <div class="q-pt-md">
          <q-btn
            label="Discover"
            color="primary"
            :to="{
              name: 'project-view',
              params: { projectID: 'GWPEs4kzppdo7VmAdaxKx8cU' },
            }"
            :class="{ 'full-width': $q.screen.lt.sm }"
          />
        </div>
      </q-card-section>
    </div>

    <!-- Proof of change -->
    <q-card-section class="proof-of-change text-center q-gutter-md">
      <p class="text-h2 text-uppercase">Proof Of Change</p>
      <p class="text-h3">By ChangeDAO</p>
      <p class="q-mt-xl">
        <q-btn
          label="Discover"
          color="primary"
          @click="
            openURL(
              'https://medium.com/changedao/episode-1-one-story-at-a-time-chatting-with-david-all-founder-of-changedao-f211ae46ab7c'
            )
          "
        />
      </p>
    </q-card-section>

    <!-- Stay Connected -->
    <q-card-section
      class="stay-connected row justify-center items-center text-center"
    >
      <div class="q-gutter-sm q-py-xl col-12 col-sm-8">
        <p class="text-h3 text-uppercase">Stay Connected</p>
        <p>
          Subscribe to our weekly newsletter and be the first to know about
          upcoming events, news, and moments of change.
        </p>
        <q-input
          v-model="email"
          @keydown.enter="submitEmail"
          placeholder="Your email"
          bg-color="dark-accent"
          class="q-mx-auto"
          style="max-width: 40em"
          filled
          dense
        >
          <template v-if="$q.screen.gt.xs" v-slot:after>
            <q-btn
              @click="submitEmail"
              :disabled="!isEmailValid"
              :loading="isSubmitting"
              label="Subscribe"
              color="dark-accent"
            />
          </template>
        </q-input>
        <q-btn
          v-if="$q.screen.lt.sm"
          @click="submitEmail"
          :disabled="!isEmailValid"
          :loading="isSubmitting"
          label="Subscribe"
          color="dark-accent"
        />
      </div>
    </q-card-section>

    <!-- Featured Projects -->
    <q-card-section class="q-pb-xl">
      <p class="text-center text-h3 text-uppercase q-mb-xl">
        Featured Projects
      </p>
      <div class="row flex-center q-gutter-xl q-px-lg">
        <ProjectCard
          class="col-sm-3 cursor-pointer"
          v-for="(project, i) in featuredProjects"
          :key="i"
          :project="project"
          @click="
            $router.push({
              name: 'project-view',
              params: { projectID: project.id },
            })
          "
        />
      </div>

      <div class="flex flex-center q-pa-xl q-pt-xl q-gutter-y-lg q-gutter-x-xl">
        <q-btn-group outline>
          <q-btn
            :label="$t('Featured Projects')"
            :to="{ name: 'projects-featured' }"
            color="accent"
            outline
          />
          <q-btn
            :label="$t('All Projects')"
            :to="{ name: 'projects' }"
            color="accent"
            outline
          />
        </q-btn-group>
      </div>
    </q-card-section>

    <!-- Stories of Change -->
    <q-card-section class="stories-of-change">
      <p class="text-h3 text-uppercase text-center q-my-lg">
        Stories of Change
      </p>

      <div class="q-gutter-xl q-py-xl column flex-center">
        <!-- Podcast -->
        <div class="section q-pa-lg">
          <p class="text-h3 text-uppercase">{{ $t("Podcast") }}</p>

          <div class="row reverse q-col-gutter-md">
            <div class="col-sm-4">
              <img
                src="~assets/podcast.png"
                style="width: 100%"
                class="shadow-4"
              />
            </div>

            <div class="col-sm-8">
              <p class="pre-line">{{ $t("home.podcast") }}</p>
              <q-btn
                @click="podcast"
                label="Listen"
                color="dark-accent"
                :class="{ 'full-width': $q.screen.lt.sm }"
              />
            </div>
          </div>
        </div>

        <!-- Blog -->
        <div class="section q-pa-lg">
          <p class="text-h3 text-uppercase">{{ $t("Blog") }}</p>

          <div class="row reverse q-col-gutter-md">
            <div class="col-sm-4">
              <img
                src="~assets/blog.png"
                style="width: 100%"
                class="shadow-4"
              />
            </div>

            <div class="col-sm-8">
              <p class="pre-line">{{ $t("home.blog") }}</p>
              <q-btn
                @click="blog"
                label="Read"
                color="dark-accent"
                :class="{ 'full-width': $q.screen.lt.sm }"
              />
            </div>
          </div>
        </div>

        <!-- Events -->
        <div class="section q-pa-lg">
          <p class="text-h3 text-uppercase">{{ $t("Events") }}</p>

          <div class="row reverse q-col-gutter-md">
            <div class="col-sm-4">
              <img
                src="~assets/events.png"
                style="width: 100%"
                class="shadow-4"
              />
            </div>

            <div class="col-sm-8">
              <p class="pre-line">{{ $t("home.events") }}</p>

              <q-btn
                @click="events"
                label="Get Involved"
                color="dark-accent"
                :class="{ 'full-width': $q.screen.lt.sm }"
              />
            </div>
          </div>
        </div>
      </div>
    </q-card-section>

    <!-- Newsletter -->
    <q-card-section class="row justify-center items-center text-center">
      <div class="q-gutter-sm q-py-xl col-12 col-sm-6">
        <p class="text-h3 text-uppercase">Join Our Newsletter</p>
        <q-input
          v-model="email"
          @keydown.enter="submitEmail"
          bg-color="dark-accent"
          placeholder="Your email"
          class="q-mx-auto"
          style="max-width: 40em"
          filled
          dense
        >
          <template v-slot:after>
            <q-btn
              @click="submitEmail"
              :disabled="!isEmailValid"
              :loading="isSubmitting"
              label="Subscribe"
              color="dark-accent"
            />
          </template>
        </q-input>
      </div>
    </q-card-section>
  </q-page>
</template>

<style lang="scss">
.page-home {
  img {
    max-width: 100%;
    display: block;
  }

  .landing {
    padding: 8vw 0 10em;
    max-width: $breakpoint-md;
    margin: 0 auto;
  }

  .proof-of-change {
    padding: 10em 0 2em;
    background-image: url("assets/ProofOfChange.png");
    background-position: 50%;
    background-repeat: no-repeat;
    background-size: cover;
  }

  .stay-connected {
    padding: 8em 4em;
    background-image: radial-gradient($primary 0%, transparent 50%);
    background-size: 175% 100%;
    background-position: center;

    .q-field__control {
      background-color: rgba(#000, 60%) !important;
    }
  }

  .stories-of-change {
    .section {
      border: 2px solid white;
      max-width: $breakpoint-sm;

      @media (min-width: $breakpoint-sm-min) {
        img {
          margin-top: map-get($space-lg, "y") * -2;
        }
      }
    }

    background-image: radial-gradient(
        80% 50% at 25% 25%,
        $accent 0%,
        transparent 50%,
        transparent
      ),
      radial-gradient(
        80% 50% at 75% 75%,
        $accent 0%,
        transparent 50%,
        transparent
      );
  }

  @media (max-width: $breakpoint-sm-max) {
    .text-h1 {
      font-size: 9vw;
      line-height: 10.9vw;
    }
    .text-h2 {
      font-size: 5.5vw;
      line-height: 6.6vw;
    }
    .text-h3 {
      font-size: 3.125vw;
      line-height: 3.8vw;
    }
    .text-h4 {
      font-size: 2.34vw;
      line-height: 2.84vw;
    }
  }

  @media (max-width: $breakpoint-xs-max) {
    .text-h1 {
      font-size: 54px;
      line-height: 65.4px;
    }
    .text-h2 {
      font-size: 33px;
      line-height: 39.6px;
    }
    .text-h3 {
      font-size: 18.8px;
      line-height: 22.8px;
    }
    .text-h4 {
      font-size: 14px;
      line-height: 17px;
    }
  }
}
</style>

<script>
import Moralis from "moralis";
import { computed, ref } from "vue";
import { openURL } from "quasar";
import { shuffle } from "lodash";

import { notifyError, notifySuccess } from "../util/notify";
import { EMAIL_FORMAT } from "../util/formatting";
import { URLS } from "../util/constants";

import ProjectCard from "../components/ProjectCard";

export default {
  name: "PageHome",

  components: {
    ProjectCard,
  },

  setup() {
    const email = ref("");
    const isEmailValid = computed(() => EMAIL_FORMAT.test(email.value));
    const isSubmitting = ref(false);
    const submitEmail = async () => {
      try {
        isSubmitting.value = true;
        await fetch(URLS.NEWSLETTER_FORM, {
          method: "POST",
          mode: "cors",
          cache: "no-cache",
          body: JSON.stringify({
            email: email.value,
          }),
        });
        email.value = "";
        notifySuccess("Subscribed");
      } catch (error) {
        console.error(error);
        notifyError(error);
      } finally {
        isSubmitting.value = false;
      }
    };

    const blog = () => {
      openURL(URLS.BLOG);
    };
    const podcast = () => {
      openURL(URLS.PODCAST);
    };
    const events = () => {
      openURL(URLS.EVENTS);
    };

    const featuredProjects = ref([]);
    Moralis.Cloud.run("getProjects", { isFeatured: true }).then((result) => {
      featuredProjects.value = shuffle(result.projects).slice(0, 3);
    });

    return {
      email,
      isEmailValid,
      isSubmitting,
      featuredProjects,
      submitEmail,
      blog,
      podcast,
      events,
      openURL,
    };
  },
};
</script>
