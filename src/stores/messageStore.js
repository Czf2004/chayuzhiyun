import { defineStore } from "pinia";

export const useMessageStore = defineStore('message',{
  state:()=>({
    messages:[],
    isLoading:false,
    streamAbort: null, // 用于存储中断函数
    currentAiMessageId: null // 记录当前AI回复的ID
  }),
  actions:{
    addUserMessage(content) {
      this.messages.push({
        type: 'user',
        content: content
      })
    },
    addAiMessage(content, isComplete = false, isStopped = false) {
      // 如果有当前正在处理的AI消息，就更新它
      if (this.currentAiMessageId) {
        const index = this.messages.findIndex(
          msg => msg.id === this.currentAiMessageId
        );
        if (index !== -1) {
          this.messages[index].content = content;
          this.messages[index].isComplete = isComplete;
          this.messages[index].isStopped = isStopped;
          return;
        }
      }

      // 否则添加新的AI消息
      const newMessage = {
        id: Date.now(),
        type: 'ai',
        content: content,
        isComplete: isComplete,
        isStopped: isStopped
      };
      this.messages.push(newMessage);
      this.currentAiMessageId = newMessage.id;
    },
    setLoading(status) {
      this.isLoading = status;
    },
    setStreamInterval(abortFunc) {
      this.streamAbort = abortFunc;
    },
    clearStreamInterval() {
      this.streamAbort = null;
      this.currentAiMessageId = null;
    }
  }
})
