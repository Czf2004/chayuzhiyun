<template>
  <NavBar v-if="$route.meta.showNavbar !== false" />
  <router-view />
</template>

<script setup>
import NavBar from './components/NavBar.vue'
</script>

<style>
/* 全局样式 */
body {
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
</style>