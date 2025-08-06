<template>
  <div id="app">
    <!-- 渲染 HistoryMonitor 组件 -->
    <HistoryMonitor />
  </div>
</template>

<script setup>
// 引入自定义组件
import HistoryMonitor from './components/HistoryMonitor.vue'
</script>

<style scoped>
#app {
  width: 100%;
  min-height: 100vh;
  padding: 20px;
  box-sizing: border-box;
}
</style>