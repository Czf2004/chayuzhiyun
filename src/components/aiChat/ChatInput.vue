<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useMessageStore } from '@/stores/messageStore';
import {getResponse} from '@/index'
import { Promotion,Microphone} from '@element-plus/icons-vue'


const userMessage = ref('')
const messageStore = useMessageStore()
let abortController = null;

const handle_send = ()=>{
  const content = userMessage.value.trim()
  //内容为空
    if( content ===''){
        ElMessage.info('内容不能为空')
        return
    }

    if(messageStore.isLoading){
      ElMessage.info('正在思考中...')
      return
    }
    messageStore.addUserMessage(content);
    console.log('发送信息',content);
    userMessage.value='';
    messageStore.setLoading(true)
    messageStore.addAiMessage('')

   // 调用流式接口
  abortController = getResponse(
    content,
    // 完成回调
    ({ fullResponse }) => {
      messageStore.addAiMessage(fullResponse, true);
      messageStore.clearStreamInterval();
      messageStore.setLoading(false);
    },
    // 更新回调
    ({ fullResponse }) => {
      messageStore.addAiMessage(fullResponse, false);
    },
    // 错误回调
    (error) => {
      messageStore.clearStreamInterval();
      messageStore.setLoading(false);
      messageStore.addAiMessage('请求失败，请重试 '+ error.message)
    },
    {
      useKnowledgeBase: false,
      reasoningMode: false
    }
  );

  messageStore.setStreamInterval(abortController);

}
const handle_stop = ()=>{
  // 调用中断函数
  if (messageStore.streamInterval) {
    messageStore.streamInterval();
  }
  // 更新当前AI消息状态为已停止
  const currentAiMessage = messageStore.messages.find(
    msg => msg.id === messageStore.currentAiMessageId
  );
  if (currentAiMessage) {
    messageStore.addAiMessage(currentAiMessage.content, false, true);
  }
  messageStore.setLoading(false);
  messageStore.clearStreamInterval();
}
</script>

<template>
  <div class="inputContainer">
    <el-input placeholder="在这里输入您的问题，Enter发送"
    v-model="userMessage"
    clearable
    :autosize="{ minRows: 1, maxRows: 4 }"
    @keydown.enter="handle_send"
    >
    </el-input>

    <div class="bottom">
      <div class="left-btn">
          <el-button class="think">
        <p class="iconfont">&#xe606;</p>
        深度思考</el-button>
      </div>

    <div class="right-btn">
      <el-tooltip
        class="box-item"
        effect="dark"
        content="语音输入"
        placement="top"
      >
        <el-icon class="Microphone" :size="22"><Microphone /></el-icon>
      </el-tooltip>

      <el-tooltip v-if="messageStore.isLoading"
        class="box-item"
        effect="dark"
        content="暂停思考"
        placement="top"
      >
      <el-button
            type="success" circle @click="handle_stop">
              <el-icon class="Square">
              </el-icon>
            </el-button>
      </el-tooltip>

      <el-tooltip v-else
        class="box-item"
        effect="dark"
        content="发送"
        placement="top"
      >
      <el-button
      type="success" circle @click="handle_send">
        <el-icon :size="20">
          <Promotion />
        </el-icon>
      </el-button>
      </el-tooltip>

    </div>


    </div>
  </div>
</template>

<style scoped>
@font-face {
  font-family: 'iconfont';  /* Project id 5002552 */
  src: url('//at.alicdn.com/t/c/font_5002552_awp2vjauyj5.woff2?t=1755594026316') format('woff2'),
       url('//at.alicdn.com/t/c/font_5002552_awp2vjauyj5.woff?t=1755594026316') format('woff'),
       url('//at.alicdn.com/t/c/font_5002552_awp2vjauyj5.ttf?t=1755594026316') format('truetype');
}
.el-input{
  --el-input-height:60px;
  --el-input-border-color:transparent;
  --el-input-focus-border-color:transparent;
  --el-input-hover-border-color:transparent;
}

.el-input .el-textarea__inner {
  max-height: 100px;
  overflow-y: auto;
}

.bottom{
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}

.bottom .think{
  border-radius: 10px;
  height: 35px;
}

.Square{
  width: 13px;
  height: 13px;
  border: none;
  border-radius: 2px;
  display: inline-block;
  background-color: #fff;
}
.Microphone{
  position: absolute;
  right: 70px;
  bottom: 12px;
}

.Microphone:hover{
  cursor: pointer;
  color: rgb(54, 255, 188);
}
</style>
