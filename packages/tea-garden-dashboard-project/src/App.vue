<template>
  <div id="app">
    <!-- 茶园数据中枢仪表盘组件 -->
    <TeaGardenDashboard />
  </div>
</template>

<script setup>
// 导入主仪表盘组件
import TeaGardenDashboard from './components/TeaGardenDashboard.vue'
</script>

<style>
/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: #0f1a1f;
  color: #ffffff;
  min-height: 100vh;
}
</style>
