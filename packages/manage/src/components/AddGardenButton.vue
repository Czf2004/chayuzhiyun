<template>
  <el-button type="primary" @click="openForm" class="add">新增茶园</el-button>
</template>

<script setup>
import { useGardenStore } from '../stores/gardenStore'

const gardenStore = useGardenStore()

const openForm = () => {
  gardenStore.openAddForm()
}
</script>

<style scoped>
.add{
  position: relative;
  left:-100px;
}
</style>
