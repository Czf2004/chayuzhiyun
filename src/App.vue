<template>
  <el-config-provider :size="elementSize">
    <NavBar v-if="$route.meta.showNavbar !== false" />
    <div style="display:flex; min-height: calc(100vh - 64px); background: var(--app-neutral-1);">
      <SideBar v-if="$route.meta.showNavbar !== false" />
      <main style="flex:1;">
        <router-view />
      </main>
    </div>
  </el-config-provider>
  
</template>

<script setup>
import NavBar from './components/NavBar.vue'
import SideBar from './components/SideBar.vue'
import './assets/main.css'
import { computed } from 'vue'
import { useUiSettingsStore } from '@/stores/uiSettingsStore'

const ui = useUiSettingsStore()
const elementSize = computed(() => ui.settings.elementSize)
</script>

<style>
/* 全局样式 */
body { margin: 0; font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif; background: var(--app-neutral-1); }
</style>