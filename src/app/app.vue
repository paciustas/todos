<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="app">
    <router-view />
  </div>
</template>

<style lang="scss">
@import 'style.scss';
@import 'primevue/resources/themes/tailwind-light/theme.css';
// @import 'primevue/resources/themes/aura-light-green/theme.css';
@import 'primeicons/primeicons.css';
@import 'primeflex/primeflex.scss';
</style>