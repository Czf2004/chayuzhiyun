<script setup>
import LeftUpload from './LeftUpload.vue';
</script>

<template>
  <div class="left">
    <div class="upload">
      <LeftUpload></LeftUpload>
    </div>
  </div>
</template>

<style scoped>
.left{
  height: 100%;
  /* background-color: antiquewhite; */
}

.upload{
  height: 60%;
  background-color: rgb(255, 255, 255);
}
</style>
