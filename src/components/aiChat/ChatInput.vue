<script setup>
import { ref,computed } from 'vue';
import { ElMessage, ElNotification, } from 'element-plus';
import { useMessageStore } from '@/stores/messageStore';
import {getResponse} from '@/index'
import { Promotion,Microphone,PictureFilled} from '@element-plus/icons-vue'


const userMessage = ref('')
const fileList = ref([])
const messageStore = useMessageStore()
let abortController = null;
const isListening = ref(false)
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
const handle_stopthink = ()=>{
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

// 语音转文字
const startListening = ()=>{
      // eslint-disable-next-line no-undef
      let recognition = new webkitSpeechRecognition();
      if (!recognition) {
        // eslint-disable-next-line no-undef
        recognition = new SpeechRecognition();
      }
      // 实时显示
      recognition.interimResults = true;
      // 连续识别
      recognition.continuous = true
      // 设置语言
      recognition.lang = 'zh-CN';
      // 开始语音识别
      recognition.start();
      isListening.value = true;
       // 监听识别结果
      recognition.onresult = function (event) {
        var result = event.results[0][0].transcript;
        userMessage.value = result;
      };
      // 监听错误事件
      recognition.onerror = function (event) {
        isListening.value = false;
        ElMessage.error("监听语音失败:"+event.error);
        console.error(event.error);
      };
      // 监听结束事件（包括识别成功、识别错误和用户停止）
      recognition.onend = function () {
        isListening.value = false;
        console.log("语音识别停止");
      };
    isListening.value = true
}
const stopListening = ()=>{
  isListening.value = false
}

// 检查图片
const beforeUpload = (file)=>{
  const isImage = file.type.startsWith('image/')
  // 校验文件类型（仅允许图片
  if(!isImage){
    ElNotification('请检查文件是否上传正确')
    return false
  }
}
//动态判断是否禁止上传
const isUploadDisabled=computed(()=>{
  return fileList.value.length>=9
})

const handleExceed = (files,fileList)=>{
  const total = files.length + fileList.value.length
  ElMessage.info(`最多只能上传9张图片，您已上传${total}张`)
}

// 预览图片
const handlePreview = (file) => {
  console.log('预览图片:', file);
  // 可在此处实现大图预览逻辑
};

// 移除图片
const handleRemove = (file) => {
  console.log('移除图片:', file);
};

const handleSuccess = (response, uploadFile) => {
  console.log('上传成功（模拟）', response, uploadFile)
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

    <!-- 深度思考 -->
    <div class="bottom">
      <div class="left-btn">
          <el-button class="think">
        <p class="iconfont">&#xe606;</p>
        深度思考</el-button>
      </div>


    <div class="right-btn">
      <el-tooltip
          effect="dark"
          content="发送图片"
          placement="top"
          >
          <el-upload
          class="picture"
          action="#"
            v-model:file-list="fileList"
            :on-success="handleSuccess"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            list-type="picture"
            :before-upload="beforeUpload"
            :limit="9"
            :on-exceed="handleExceed"
            :disabled="isUploadDisabled"
          >
          <el-icon :size="20"><PictureFilled /></el-icon>
          </el-upload>
      </el-tooltip>

      <div class="button">
        <!-- 声波动画（仅在录音时显示） -->
           <el-tooltip v-if="isListening"
          class="box-item"
          effect="dark"
          content="停止输入"
          placement="top"
          >
          <div class="Mic-btn">
            <div class="sound-waves" @click="stopListening">
            <span class="wave wave-1"></span>
            <span class="wave wave-2"></span>
            <span class="wave wave-3"></span>
            <span class="wave wave-4"></span>
          </div>
          </div>

          </el-tooltip>

          <!-- 语音输入 -->
          <el-tooltip v-else
          class="box-item"
          effect="dark"
          content="语音输入"
          placement="top"
          >
          <el-icon :size="22" class="Mic-btn" @click="startListening"><Microphone /></el-icon>
          </el-tooltip>

      </div>

      <!-- 暂停思考 -->
      <el-tooltip v-if="messageStore.isLoading"
        class="box-item"
        effect="dark"
        content="暂停思考"
        placement="top"
      >
      <el-button
            type="success" circle @click="handle_stopthink">
              <el-icon class="Square">
              </el-icon>
            </el-button>
      </el-tooltip>

      <!-- 发送 -->
      <el-tooltip v-else
        class="box-item"
        effect="dark"
        content="发送"
        placement="top"
      >
      <el-button
      type="success" circle @click="handle_send" class="send">
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

.Mic-btn{
  position: relative;
  right: 60px;
  bottom: 35px;
}

.Square{
  width: 13px;
  height: 13px;
  border: none;
  border-radius: 2px;
  display: inline-block;
  background-color: #fff;
}

.button{
  position: absolute;
  bottom: 5px;
  right: 65px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 35px;
  height: 35px;
  border-radius: 5px;
}

.button:hover{
  /* background-color: #f1f1f1; */
  cursor: pointer;
}
/* 声波动画容器 */
.sound-waves {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
}

/* 声波线条样式 */
.wave {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid #4096ff; /* Element Plus primary 颜色 */
  opacity: 0;
}

/* 不同层级的声波 */
.wave-1 { width: 100%; height: 100%; animation: wave 1.2s infinite ease-in-out; }
.wave-2 { width: 80%; height: 80%; animation: wave 1.2s 0.2s infinite ease-in-out; }
.wave-3 { width: 60%; height: 60%; animation: wave 1.2s 0.4s infinite ease-in-out; }
.wave-4 { width: 40%; height: 40%; animation: wave 1.2s 0.6s infinite ease-in-out; }

/* 声波动画 */
@keyframes wave {
  0% {
    transform: scale(0.5);
    opacity: 0.8;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    transform: scale(1.2);
    opacity: 0;
  }
}

.picture{
  position: absolute;
  right: 95px;
  bottom: 32px;;
}
.picture:hover{
  cursor:pointer
}
.send{
  /* background-color: #3f3f3f; */
  border: none;
}
</style>
