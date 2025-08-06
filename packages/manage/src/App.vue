<script setup>
import GardenForm from './components/GardenForm.vue';
import AddGardenButton from './components/AddGardenButton.vue';
import importExcelButton from './components/importExcelButton.vue';
</script>

<template>
  <div class="page">
    <h1>茶园管理系统</h1>
    <div class="button">
      <AddGardenButton></AddGardenButton>
      <importExcelButton></importExcelButton>
    </div>
    <div class="form">
      <GardenForm></GardenForm>
    </div>
  </div>
</template>

<style scoped>
.button{
  margin-left: 1070px;
  margin-top: 10px;
  display: flex;
  /* gap: 0px;
  background-color: #f99090; */
}
.page{
  position: relative;
  min-height: 100vh;
  padding-top: 50px;
}
.form{
  position: absolute;
  top: 150px;
}
</style>
