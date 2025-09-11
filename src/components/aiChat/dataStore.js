import { defineStore } from 'pinia'

export const useDataStore = defineStore('dataStore', {
  state: () => ({
    // 存储所有上传的文件，包含更详细的信息
    uploadedFiles: [],
    // 上传状态
    uploadStatus: {
      isUploading: false,
      progress: 0
    }
  }),

  actions: {
    // 添加文件到存储，包含完整信息
    addFile(file) {
      // 提取文件类型（从MIME类型或文件名推断）
      let fileType = file.raw?.type || '';
      if (!fileType && file.name) {
        const ext = file.name.split('.').pop()?.toLowerCase();
        fileType = ext ? `.${ext}` : 'unknown';
      }

      this.uploadedFiles.push({
        id: Date.now() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: fileType,
        status: file.status || 'uploaded', // 上传状态
        parseStatus: 'pending', // 解析状态：pending(待解析)、completed(解析完成)、failed(解析失败)
        uploadTime: new Date().toISOString(), // 上传时间
        url: file.url || '', // 文件URL，用于查看和下载
        raw: file.raw, // 原始文件对象
        ...file // 允许覆盖默认值
      })
    },

    // 从存储中移除文件
    removeFile(fileId) {
      this.uploadedFiles = this.uploadedFiles.filter(file => file.id !== fileId)
    },

    // 清空所有文件
    clearFiles() {
      this.uploadedFiles = []
    },

    // 更新上传状态
    setUploading(status, progress = 0) {
      this.uploadStatus.isUploading = status
      this.uploadStatus.progress = progress
    },

    // 更新文件的解析状态
    updateParseStatus(fileId, status, message = '') {
      const file = this.uploadedFiles.find(f => f.id === fileId);
      if (file) {
        file.parseStatus = status;
        // 可以存储解析相关的消息（如错误信息）
        if (message) {
          file.parseMessage = message;
        }
      }
    },

    // 更新文件的URL（可能用于解析后的文件地址）
    updateFileUrl(fileId, url) {
      const file = this.uploadedFiles.find(f => f.id === fileId);
      if (file) {
        file.url = url;
      }
    }
  },

  getters: {
    // 获取文件总数
    fileCount: (state) => state.uploadedFiles.length,

    // 根据上传状态筛选文件
    getFilesByUploadStatus: (state) => (status) => {
      return state.uploadedFiles.filter(file => file.status === status)
    },

    // 根据解析状态筛选文件
    getFilesByParseStatus: (state) => (status) => {
      return state.uploadedFiles.filter(file => file.parseStatus === status)
    },

    // 根据ID获取单个文件
    getFileById: (state) => (id) => {
      return state.uploadedFiles.find(file => file.id === id)
    }
  }
})
