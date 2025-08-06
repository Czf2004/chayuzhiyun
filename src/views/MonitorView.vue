<template>
  <div class="monitor-view">
    <h2>历史监控数据</h2>
    <HistoryMonitor />
  </div>
</template>

<script setup>
// 引入历史监控组件
import HistoryMonitor from '../components/monitor/HistoryMonitor.vue'
</script>

<style scoped>
.monitor-view {
  padding: 2rem 5%;
  background-color: #fff;
  min-height: calc(100vh - 80px);
}
</style>