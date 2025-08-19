<template>
  <el-config-provider :size="elementSize">
    <NavBar v-if="$route.meta.showNavbar !== false" />
    <router-view />
  </el-config-provider>
</template>

<script setup>
import NavBar from './components/NavBar.vue'
import './assets/main.css'
import { computed } from 'vue'
import { useUiSettingsStore } from '@/stores/uiSettingsStore'

const ui = useUiSettingsStore()
const elementSize = computed(() => ui.settings.elementSize)
</script>

<style>
/* 全局样式 */
body {
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
</style>