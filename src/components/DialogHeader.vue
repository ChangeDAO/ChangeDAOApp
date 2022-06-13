<template>
  <q-card-section class="dialog-header">
    <q-item class="q-pa-none fg-inherit">
      <q-item-section v-if="icon || $slots.avatar" class="items-center" avatar>
        <slot name="avatar">
          <q-icon :name="icon" size="md" />
        </slot>
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-h5">
          <slot name="title">
            {{ title }}
          </slot>
        </q-item-label>
        <q-item-label
          v-if="subtitle || $slots.subtitle"
          class="text-subtitle1"
          subtitle
        >
          <slot name="subtitle">
            {{ subtitle }}
          </slot>
        </q-item-label>
      </q-item-section>
      <q-item-section class="fg-inherit" side top>
        <div class="row reverse items-center q-gutter-xs">
          <q-btn
            v-close-popup
            v-if="!noCloseBtn"
            icon="close"
            size="lg"
            dense
            round
            flat
          />
          <slot name="buttons" />
        </div>
      </q-item-section>
    </q-item>
    <slot name="bottom" />
  </q-card-section>
</template>

<script>
export default {
  name: "",
  props: {
    icon: String,
    title: String,
    subtitle: String,
    noCloseBtn: Boolean,
    color: String,
    textColor: String,
  },
};
</script>
