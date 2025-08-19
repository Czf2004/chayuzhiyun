<template>
  <aside class="sidebar">
    <div class="group">
      <div class="group-title">导航</div>
      <RouterLink class="item" :class="{ active: isActive('/home') }" to="/home">
        <span>首页</span>
      </RouterLink>
      <RouterLink class="item" :class="{ active: isActive('/ops') }" to="/ops">
        <span>运营总览</span>
      </RouterLink>
      <RouterLink class="item" :class="{ active: isActive('/ops/products') }" to="/ops/products">
        <span>茶册管理</span>
      </RouterLink>
      <RouterLink class="item" :class="{ active: isActive('/ops/quotations') }" to="/ops/quotations">
        <span>专属报价</span>
      </RouterLink>
      <RouterLink class="item" :class="{ active: isActive('/device-management') }" v-if="isAdmin" to="/device-management">
        <span>设备管理</span>
      </RouterLink>
      <RouterLink class="item" :class="{ active: isActive('/user-management') }" v-if="isAdmin" to="/user-management">
        <span>用户管理</span>
      </RouterLink>
      <RouterLink class="item" :class="{ active: isActive('/settings') }" to="/settings">
        <span>系统设置</span>
      </RouterLink>
    </div>
  </aside>
  
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useUserStore } from '@/stores/userStore'

const route = useRoute()
const userStore = useUserStore()
const isAdmin = computed(() => userStore.getUserInfo.role === 'admin')
const isActive = (prefix) => route.path.startsWith(prefix)
</script>

<style scoped>
/* 样式在全局 main.css 中（.sidebar ...） */
</style>


