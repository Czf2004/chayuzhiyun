<script setup>
import MainRegion from '../components/MainRegion.vue';
import RightRegion from '../components/RightRegion.vue';
import LeftRegion from '../components/LeftRegion.vue';
</script>

<template>
  <div class="web">
    <!-- <img src="./assets/绿色背景.webp" alt=""> -->
    <div class="left">
      <LeftRegion></LeftRegion>
    </div>

    <div class="main">
      <MainRegion></MainRegion>
    </div>

    <div class="right">
      <RightRegion></RightRegion>
    </div>
  </div>

</template>


<style>

*{
  margin: 0;
  padding: 0;
}

.web{
  display: flex;
}

.main{
  background-image: linear-gradient(to top left,rgb(211, 255, 211),white);
  height: 725px;
  background-size: cover;
  margin-top: 10px;
  box-sizing: border-box;

  border-left: 1px solid rgb(235, 235, 235);
  border-right: 1px solid rgb(235, 235, 235);
  border-top: 1px solid rgb(235, 235, 235);
}

.left{
  width: 300px;
  margin-right: 5px;
}


.right{
  margin-left: 5px;
}
</style>
