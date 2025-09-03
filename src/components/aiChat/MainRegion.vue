<script setup>
import ChatInput from './ChatInput.vue';
import ChatMessage from './ChatMessage.vue';
import { Plus } from '@element-plus/icons-vue'
</script>

<template>
  <el-container>
    <!-- 头部 -->
    <el-header>
      <div class="head">
        <p>用户的第一个问题显示在这里</p>
        <el-button round class="chat-btn"><el-icon class="plus" size="18"><Plus /></el-icon>新对话</el-button>
      </div>
    </el-header>
    <hr>
    <!-- 问答区 -->
      <el-main>
        <ChatMessage></ChatMessage>
      </el-main>

    <!-- 输入问题 -->
    <el-footer>
      <ChatInput></ChatInput>
    </el-footer>
  </el-container>
</template>


<style scoped>
/* 中间的上中下 */
.el-container{
  width: 850px;
  height: 100%;
  margin:0 auto;
  box-sizing: border-box;
  padding-bottom: 0;
  /* border: 1px solid greenyellow; */
  border: none;
  /* border-radius: 25px; */
  background-color: rgba(255,255,255,0.6);
  backdrop-filter: blur(5px);
}

.head{
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* background-color: beige; */
}

hr{
  border: none;
  height: 1px;
  background-color: #dedede;
  margin-top: 20px;
}

.el-header{
  height: 20px;
  line-height: 20px;
  margin-top: 10px;
  font-weight: 500;
  font-size: 15px;
}

.chat-btn{
  background-color: #2f2f2fec;
  color: #ffffff;
  border: none;
}

.chat-btn:hover{
  background-color: #2f2f2f;
  color: #ffffff;
}

.plus svg{
margin-right: 5px;
}

.el-main{
  padding-top: 0;
  margin-bottom: 50px;
}

.el-footer{
  /* position: fixed; */
  width: 800px;
  height: 120px;
  border: 1px gainsboro solid;
  border-radius: 10px;
  bottom: 10px;
  background-color: #fff;
  margin-left: 25px;
  margin-bottom: 35px
  /* bottom: 40px;
  left: 25px; */
}
</style>
