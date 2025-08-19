<template>
  <div class="loading">
    <span class="circle"></span>
    <span class="circle"></span>
    <span class="circle"></span>
  </div>
</template>

<style scoped>
.loading{
  display: flex;
}

.circle{
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: #6d6d6d;
  margin: 0 4px;
  animation: colorChange 1s linear infinite;/* 无限循环 */
}

.circle:nth-child(1){
  animation-delay: 0s;
}
.circle:nth-child(2){
  animation-delay: 0.33s;
}
.circle:nth-child(3){
  animation-delay: 0.67s;
}

@keyframes colorChange{
  0%{
    background-color: #dedede;
  }
  33.33%{
    background-color: #dedede;
  }
  66.67%{
    background-color: #dedede;
  }
}
</style>
