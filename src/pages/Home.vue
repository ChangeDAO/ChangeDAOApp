<template>
  <q-page class="page-home column">
    <!-- Landing -->
    <q-card-section class="landing">
      <div class="title text-h1">
        NFTs AS A FORCE<br />
        FOR CHANGE
      </div>
      <div class="subtitle text-h3">
        Discover, Create, and Support Stories of Change
      </div>
      <div class="social q-mt-xl text-h4 text-center">
        JOIN OUR STORY + STAY CONNECTED
      </div>
    </q-card-section>

    <!-- Areas of Change -->
    <q-card-section></q-card-section>

    <!-- Social -->
    <q-card-section class="bg-primary text-center text-h3">
      Join our story
      <q-btn class="q-mx-md" label="Message Us" outline />
    </q-card-section>

    <!-- NFTs as a Force for Change -->
    <q-card-section class="text-center q-py-xl">
      <div class="text-h2">NFTs as a Force for Change</div>
      <div class="dots text-h2" />
      <p class="text-body1">
        <b>Changemakers</b> create positive change in the world<br />
        <b>Art</b> inspires and educates us to participate<br />
        <b>Community</b> makes change happen as one global movement
      </p>
    </q-card-section>

    <!-- Banner -->
    <img src="~assets/ChangeDao-Journey.png" style="width: 100%;" />

    <!-- Are you a Changemaker? -->
    <div class="items-center justify-center" :class="{ row: $q.screen.gt.sm }">
      <div class="col q-pa-xl" style="max-width: 50em;">
        <p class="text-h3">
          Are you a Changemaker?
        </p>
        <p class="text-body1">
          Changemakers are hand-selected and verified by our core team. They are
          artists, causes and curators that have a track-record of using NFTs as
          a force for change in the world.
        </p>
        <p class="text-body1 text-bold">
          Want to get involved? Connect with our team today.
        </p>
        <p>
          <q-btn label="Message Us" color="primary" />
        </p>
      </div>
      <div class="col flex flex-center">
        <img src="~assets/SplitPay.gif" />
      </div>
    </div>

    <!-- Triple P NFTs -->
    <q-card-section class="q-py-xl bg-dark">
      <div class="text-center text-h2">
        We’re Introducing Triple P NFTs
        <div class="dots text-h2" />
      </div>
      <div class="q-gutter-lg" :class="{ row: $q.screen.gt.sm }">
        <div class="col">
          <p class="text-h1">People</p>
          <p class="text-h3 text-accent">Create to your heart’s delight.</p>
          <p>
            Every NFT on ChangeDAO benefits a cause. Elevate and educate our
            community about the cause you care about with your art. Create
            change, start a movement.
          </p>
        </div>
        <q-separator color="primary" :vertical="$q.screen.gt.sm" />
        <div class="col">
          <p class="text-h1">Profit</p>
          <p class="text-h3 text-accent">We’re all in this together.</p>
          <p>
            Our smart contracts are unique to the Changemaker — and to each
            individual project. Changemakers determine how revenue from sales is
            distribute d. And our platform fees are lower than you think.
          </p>
        </div>
        <q-separator color="primary" :vertical="$q.screen.gt.sm" />
        <div class="col">
          <p class="text-h1">Planet</p>
          <p class="text-h3 text-accent">Reduce and offset.</p>
          <p>
            We’re taking sustainability head-on, crafting quality code that
            reduces overall energy consumption. And ChangeDAO will acquire
            carbon offsets to cover what little energy we do use to bring change
            to life.
          </p>
        </div>
      </div>
    </q-card-section>

    <q-card-section class="footer text-center q-gutter-xl">
      <p class="text-h2">Share Your Story.<br />Be the Change.</p>
      <p>
        <q-btn label="Message Us" outline />
      </p>
    </q-card-section>
  </q-page>
</template>

<style lang="scss">
.page-home {
  img {
    max-width: 100%;
    display: block;
  }

  .dots:after {
    content: "• • •";
    color: $primary;
  }

  .landing {
    padding: 0 8vw;
    background-image: url("assets/bg.d99f0577.gif");
    background-position: 50%;
    background-repeat: no-repeat;
    background-size: cover;
    .title {
      margin: 1em 0 0.2em;
    }
    .subtitle {
      margin-bottom: 2em;
    }
    .social {
      margin: 1em 0 2em;
    }
  }

  .footer {
    padding: 5em;
    background-image: url("assets/Footer.e1348242.png");
    background-position: 50%;
    background-repeat: no-repeat;
    background-size: cover;
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
