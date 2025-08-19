<script setup>
import { useMessageStore } from '@/stores/messageStore';
import LoadIng from './LoadIng.vue';
const messageStore = useMessageStore()

</script>

<template>
  <div class="chat">
    <div class="user-message">
      <p>用户的问题</p>
    </div>
    <div class="user-image">
      <img src="../assets/火星基地照片.jpg">
    </div>
    <!-- <div class="ai-message">
      <LoadIng></LoadIng>
    </div> -->
    <div class="ai-message">
      <p>ai的回答</p>
    </div>
  </div>
  <div class="chat">
    <div v-for="(msg, index) in messageStore.messages" :key="index" class="message-item">
      <!-- 用户消息 -->
      <div v-if="msg.type === 'user'" class="user-message">
        <p>{{ msg.content }}</p>
      </div>
      <!-- <div v-if="msg.type === 'user'" class="user-image">
        <img src="../assets/火星基地照片.jpg">
      </div> -->

      <!-- AI消息 -->
      <div v-if="msg.type === 'ai'" class="ai-message">
        <p>{{ msg.content }}</p>
        <!-- 显示已停止提示 -->
        <p v-if="msg.isStopped" style="color: #999; font-size: 0.8em; margin-top: 5px;">
          已停止思考
        </p>
      </div>
    </div>

    <!-- 加载状态显示 -->
    <div v-if="messageStore.isLoading" class="ai-message">
      <LoadIng />
    </div>
  </div>
</template>

<style scoped>
.chat{
  display: flex;
  flex-direction: column;
}

.message-item{
  display: flex;
  flex-direction: column;
}

.user-message{
display: inline-block;
  max-width: 70%;
  align-self: flex-end;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeUp 0.3s ease-in-out forwards;
  margin-top: 20px;
}

.user-message p{
  line-height: 1.5;
  background-color: #7bd900;
  padding: 5px;
  border-radius: 10px;
  border-top-right-radius: 0;
  color: white;
}

@keyframes fadeUp{
  0%{
    opacity: 0;
    transform: translateY(20px);
  }
  100%{
    opacity: 1;
    transform: translateY(0);
  }
}

.user-image img{
  width: 150px;
  height: 100px;
  object-fit:cover;
  border-radius: 5px;
}

.user-image{
  margin-top: 4px;
  align-self: flex-end;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeUp 0.3s ease-in-out forwards;
}

.ai-message{
  margin-top: 20px;
  align-self: flex-start;
  max-width: 80%;
}

.ai-message p{
  line-height: 1.5;
  background-color: #f1f1f1;
  padding: 5px;
  border-radius: 10px;
  border-top-left-radius: 0;
  color: rgb(0, 0, 0);
}
</style>
