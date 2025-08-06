<template>
  <div class="dashboard-view">
    <!-- 引入仪表盘组件 -->
    <TeaGardenDashboard />
  </div>
</template>

<script setup>
// 引入数据仪表盘组件
import TeaGardenDashboard from '../components/dashboard/TeaGardenDashboard.vue'
</script>

<style scoped>
/* 适配仪表盘样式，继承原项目黑色背景 */
.dashboard-view {
  background-color: #0f1a1f;
  min-height: calc(100vh - 80px); /* 减去导航栏高度 */
  padding-top: 1rem;
}
</style>