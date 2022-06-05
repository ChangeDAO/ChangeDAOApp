<template>
  <q-page class="page-home column">
    <!-- Landing -->
    <div class="row justify-center items-center landing">
      <q-card-section class="col-12 col-md-5 q-pr-md column justify-center">
        <p class="text-h2">
          CHANGEMAKER NAME
        </p>
        <p class="text-h4">
          Title of the drop
        </p>
        <p class="text-caption">
          MOVEMENT NAME
        </p>
        <div class="q-pt-md">
          <q-btn label="Discover" color="primary" class="text-color-white" />
        </div>
      </q-card-section>
      <q-card-section class="col-12 col-md-auto">
        <img src="~assets/ChangeDAO-sample-cover.png" style="width: 100%;" class="shadow-4" />
      </q-card-section>
    </div>

    <!-- Proof of change -->
    <q-card-section class="proof-of-change text-center q-gutter-md">
      <p class="text-h2 text-uppercase">Proof Of Change</p>
      <p class="text-h3">By ChangeDAO</p>
      <p class="q-mt-xl">
        <q-btn label="Discover" color="primary" class="text-color-white" />
      </p>
    </q-card-section>

    <!-- Stay Connected -->
    <q-card-section class="stay-connected row justify-center items-center text-center">
      <div class="q-gutter-sm q-py-xl col-12 col-md-5">
        <p class="text-h3 text-uppercase">Stay Connected</p>
        <p>Subscribe to our weekly newsletter and be the first to know about <br />upcoming events, news, and moments of change.</p>
        <q-input filled placeholder="Your email" hint="With placeholder" dense>
          <template v-slot:after>
            <q-btn label="Subscribe" color="black" class="text-color-white" />
          </template>
        </q-input>
      </div>
    </q-card-section>

    <!-- Featured Projects -->
    <q-card-section class="q-py-xl">
      <p class="text-center text-h3 text-uppercase q-mb-xl">
        Featured Projects
      </p>
      <div class="row justify-center items-center q-gutter-xl q-px-lg">
        <div class="col-12 col-md-2">
          <q-card>
            <img src="~assets/ChangeDAO-sample-cover.png" style="width: 100%;" class="shadow-4" />
            <div class="absolute-bottom q-pa-md caption">
              <div class="row items-center">
                <q-avatar
                  size="sm"
                  color="grey-9"
                  class="q-my-sm q-mr-sm"
                  square
                />
                <div class="text-subtitle2 text-weight-bold">@changemakerhandle</div>
              </div>
              <div class="text-caption text-weight-bold">Title of the drop</div>
              <div class="row justify-between">
                <div class="text-caption text-uppercase">Movement Name</div>
                <div class="text-caption text-grey-6 text-right">## of #### minted</div>
              </div>
            </div>
          </q-card>
        </div>
        <div class="col-12 col-md-2">
          <q-card>
            <img src="~assets/ChangeDAO-sample-cover.png" style="width: 100%;" class="shadow-4" />
            <div class="absolute-bottom q-pa-md caption">
              <div class="row items-center">
                <q-avatar
                  size="sm"
                  color="grey-9"
                  class="q-my-sm q-mr-sm"
                  square
                />
                <div class="text-subtitle2 text-weight-bold">@changemakerhandle</div>
              </div>
              <div class="text-caption text-weight-bold">Title of the drop</div>
              <div class="row justify-between">
                <div class="text-caption text-uppercase">Movement Name</div>
                <div class="text-caption text-grey-6 text-right">## of #### minted</div>
              </div>
            </div>
          </q-card>
        </div>
        <div class="col-12 col-md-2">
          <q-card>
            <img src="~assets/ChangeDAO-sample-cover.png" style="width: 100%;" class="shadow-4" />
            <div class="absolute-bottom q-pa-md caption">
              <div class="row items-center">
                <q-avatar
                  size="sm"
                  color="grey-9"
                  class="q-my-sm q-mr-sm"
                  square
                />
                <div class="text-subtitle2 text-weight-bold">@changemakerhandle</div>
              </div>
              <div class="text-caption text-weight-bold">Title of the drop</div>
              <div class="row justify-between">
                <div class="text-caption text-uppercase">Movement Name</div>
                <div class="text-caption text-grey-6 text-right">## of #### minted</div>
              </div>
            </div>
          </q-card>
        </div>
      </div>
    </q-card-section>

    <!-- Stories of Change -->
    <q-card-section>
      <!-- Podcast -->
      <div class="q-gutter-xl q-pt-xl green-radial">
        <p class="text-h3 text-uppercase text-center q-mb-xl">Engage with our stories of change</p>
        <div class="row justify-center q-px-lg">
          <div class="col col-md-8">
            <div class="stories-of-change q-pa-lg q-col-gutter-md" :class="{ row: $q.screen.gt.sm }">
              <div class="col-9">
                <p class="text-h3 text-uppercase">Podcast</p>
                <p>Proof of Change lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut.</p>
                <q-btn label="Listen" color="black" class="text-color-white" />
              </div>
              <div class="col-3">
                <img src="~assets/ChangeDAO-sample-cover.png" style="width: 100%;" class="shadow-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Blog -->
      <div class="q-gutter-xl q-pt-xl">
        <div class="row justify-center q-px-lg">
          <div class="col col-md-8">
            <div class="stories-of-change q-pa-lg q-col-gutter-md" :class="{ row: $q.screen.gt.sm }">
              <div class="col-9">
                <p class="text-h3 text-uppercase">Blog</p>
                <p>Proof of Change lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut.</p>
                <q-btn label="Read" color="black" class="text-color-white" />
              </div>
              <div class="col-3">
                <img src="~assets/ChangeDAO-sample-cover.png" style="width: 100%;" class="shadow-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Events -->
      <div class="q-gutter-xl q-pt-xl">
        <div class="row justify-center q-px-lg">
          <div class="col col-md-8">
            <div class="stories-of-change q-pa-lg q-col-gutter-md" :class="{ row: $q.screen.gt.sm }">
              <div class="col-9">
                <p class="text-h3 text-uppercase">Events</p>
                <p>Proof of Change lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut.</p>
                <q-btn label="Get Involved" color="black" class="text-color-white" />
              </div>
              <div class="col-3">
                <img src="~assets/ChangeDAO-sample-cover.png" style="width: 100%;" class="shadow-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </q-card-section>

    <!-- Newsletter -->
    <q-card-section class="row justify-center items-center text-center">
      <div class="q-gutter-sm q-py-xl col-12 col-md-5">
        <p class="text-h3 text-uppercase">Join Our Newsletter</p>
        <q-input filled bg-color="black" placeholder="Your email" hint="With placeholder" dense>
          <template v-slot:after>
            <q-btn label="Subscribe" color="black" class="text-color-white" />
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
    padding: 8vw 0;
  }

  .proof-of-change {
    padding: 10em 0 2em;
    background-image: url("assets/ChangeDAO-sample-cover-01.png");
    background-position: 50%;
    background-repeat: no-repeat;
    background-size: cover;
  }

  .stay-connected {
    padding: 8em 4em;
    background-image: radial-gradient($primary 0%, transparent 50%);
  }

  .caption {
    background: rgba(0,0,0,.47);
  }

  .stories-of-change {
    border: 2px solid white;
  }

  .green-radial {
    background-image: radial-gradient(circle at center, $accent 0%, transparent 50%, transparent);
  }
}
</style>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "PageHome",

  setup() {
    return {};
  }
});
</script>
