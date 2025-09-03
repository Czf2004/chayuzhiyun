<script setup>
import { UploadFilled,Document,CircleCloseFilled,ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import {useDataStore} from '@/stores/dataStore'
import {ref, onMounted, nextTick} from 'vue'

const dataStore = useDataStore()
// const uploadedFiles = ref ([])
const fileListRef = ref(null)
const scrollStep = 160

// 上传文件
const handleChange = (uploadFile, uploadFiles) => {
  const newFiles = uploadFiles.filter(file =>
    !dataStore.uploadedFiles.some(f => f.id === file.id)
  )
  newFiles.forEach(file => dataStore.addFile(file))
}

// 移除文件
const handleRemove = (fileId) => {
  dataStore.removeFile(fileId)
}

// 格式化文件大小
const formatFileSize = (size) => {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`
  return `${(size / (1024 * 1024)).toFixed(2)} MB`
}

// 滚动控制
const scrollLeft = () => {
  if (fileListRef.value) {
    fileListRef.value.scrollBy({ left: -scrollStep, behavior: 'smooth' })
  }
}

const scrollRight = () => {
  if (fileListRef.value) {
    fileListRef.value.scrollBy({ left: scrollStep, behavior: 'smooth' })
  }
}

// 检查是否需要显示箭头
const showArrows = ref(false)
onMounted(() => {
  nextTick(() => {
    checkArrows()
  })
})

const checkArrows = () => {
  if (fileListRef.value) {
    showArrows.value = fileListRef.value.scrollWidth > fileListRef.value.clientWidth
  }
}
</script>

<template>
  <div class="upload">
    <el-upload
      class="upload-demo"
      drag
      action="#"
      multiple
      :limit="50"
      accept=".xlsx,.xls,.csv,.jpg,.jpeg,.png,.pdf"
      :on-change="handleChange"
      :file-list="dataStore.uploadedFiles"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">
        拖拽文件到此处或 <em>点击此处上传</em>
      </div>
    </el-upload>
    <div class="file-list-container">
      <!-- 左箭头 -->
      <el-icon
        v-if="showArrows"
        class="scroll-arrow left-arrow"
        @click="scrollLeft" size="13px"
      >
        <ArrowLeft />
      </el-icon>
    <!-- 上传列表 -->
      <div class="file-list" ref="fileListRef" v-if="dataStore.uploadFiles">
        <div class="file-item" v-for="file in dataStore.uploadedFiles"
        :key="file.id">
          <el-icon size="26px"><Document /></el-icon>
          <div class="f-info" style="margin-left: 8px;">
            <span class="f-name" style="font-size: 14px;">{{ file.name }}</span>
            <span class="f-type" style="font-size: 12px; color: gray;">{{ file.type }} . {{ formatFileSize(file.size) }}</span>
          </div>
          <el-icon @click="handleRemove(file.id)" class="delete" size="13px"><CircleCloseFilled /></el-icon>
        </div>

      </div>
      <!-- 右箭头 -->
      <el-icon
      v-if="showArrows"
        class="scroll-arrow right-arrow"
        @click="scrollRight" size="13px"
      >
        <ArrowRight />
      </el-icon>
    </div>
    <!-- 进度条 -->
  </div>
</template>

<style scoped>
.upload{
  padding: 10px;
}

.file-list-container{
  position: relative;
  display: flex;
}

.scroll-arrow{
  border: 1px solid rgb(227, 227, 227);
  border-radius: 5px;
  padding: 2px;
  top: 20px;
  color:gray
}

.left-arrow{
  right: 5px;
}

.right-arrow{
  left: 5px;
}

.scroll-arrow:hover{
  cursor: pointer;
  background-color: rgb(242, 242, 242);
}

.file-list{
  overflow-x: auto;
  display: flex;
  scrollbar-width: none;
}

.file-item{
  position: relative;
  display: flex;
  align-items: center;
  background-color: rgb(239, 239, 239);
  padding: 10px 12px;
  border-radius: 10px;
  width: 150px;
  margin-right: 10px;
  box-sizing: border-box;
  /* 父组件display:flex时，子组件不被压缩 */
  flex-shrink: 0;
}

.file-item:hover .delete{
  opacity: 1;
}

.f-info{
  display: flex;
  flex-direction: column;
}

.f-name{
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.delete{
  position: absolute;
  right: 2px;
  top: 2px;
  opacity: 0;
}

.delete:hover{
  cursor: pointer;
}
</style>
