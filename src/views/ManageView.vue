<template>
  <div class="manage-view">
    <!-- 引入茶园管理相关组件 -->
    <div class="button-group">
      <AddGardenButton />
      <importExcelButton />
    </div>
    <div class="form-container">
      <GardenForm />
    </div>
  </div>
</template>

<script setup>
// 引入茶园管理组件（注意路径与复制后的位置一致）
import AddGardenButton from '../components/manage/AddGardenButton.vue'
import importExcelButton from '../components/manage/importExcelButton.vue'
import GardenForm from '../components/manage/GardenForm.vue'
</script>

<style scoped>
/* 继承原manage2的样式并适配主项目 */
.manage-view {
  padding: 2rem 5%;
  background-color: #fff;
  min-height: calc(100vh - 80px); /* 减去导航栏高度 */
}

.button-group {
  display: flex;
  justify-content: flex-end; /* 按钮靠右显示 */
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-right: 20px; /* 微调位置 */
}

.form-container {
  margin-top: 1rem;
}
</style>