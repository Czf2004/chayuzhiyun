<template>
  <div class="app-container">
    <el-row :gutter="12">
      <!-- 产品列表区域 -->
      <el-col :span="14">
        <el-card class="card-modern">
          <template #header>
            <div style="display:flex;justify-content:space-between;align-items:center">
              <span>产品列表</span>
              <div>
                <el-button type="primary" @click="startCreate">新增产品</el-button>
              </div>
            </div>
          </template>
          <el-table :data="allProducts" stripe>
            <el-table-column label="图片" width="100">
              <template #default="{row}">
                <img :src="row.imageUrl" alt="" style="width:72px;height:54px;object-fit:cover;border-radius:6px" />
              </template>
            </el-table-column>
            <el-table-column prop="name" label="名称" min-width="160" />
            <el-table-column prop="description" label="描述" min-width="220" show-overflow-tooltip />
            <el-table-column prop="basePrice" label="基础价(¥)" width="120" />
            <el-table-column prop="costPrice" label="成本价(¥)" width="120" />
            <el-table-column label="操作" width="260" fixed="right">
              <template #default="{row}">
                <el-button size="small" @click="startEdit(row)">编辑</el-button>
                <el-button size="small" type="danger" @click="remove(row)">删除</el-button>
                <el-button size="small" type="success" @click="openTrace(row)">生成溯源页</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <!-- 产品表单区域 -->
      <el-col :span="10">
        <el-card class="card-modern">
          <template #header>
            <span>{{ editingId ? '编辑产品' : '新增产品' }}</span>
          </template>

          <el-form :model="form" label-width="100px">
            <el-form-item label="产品名称"><el-input v-model="form.name" placeholder="如：明前特级龙井" /></el-form-item>
            <el-form-item label="描述"><el-input v-model="form.description" type="textarea" :rows="4" placeholder="产品描述/故事文案" /></el-form-item>
            <el-form-item label="基础价格"><el-input-number v-model="form.basePrice" :min="0" :step="10" /></el-form-item>
            <el-form-item label="成本价"><el-input-number v-model="form.costPrice" :min="0" :step="10" /></el-form-item>
            <el-form-item label="产地"><el-input v-model="form.origin" placeholder="如：浙江·杭州西湖" /></el-form-item>
            <el-form-item label="采摘时间"><el-date-picker v-model="form.harvestTime" type="date" value-format="YYYY-MM-DD" placeholder="选择日期" /></el-form-item>
            <el-form-item label="产品图片">
              <el-upload class="uploader" :auto-upload="false" :show-file-list="false" :before-upload="handleImage">
                <template #trigger>
                  <el-button>选择图片</el-button>
                </template>
              </el-upload>
              <div v-if="form.imageUrl" style="margin-top:8px">
                <img :src="form.imageUrl" style="width:120px;height:90px;object-fit:cover;border-radius:6px" />
              </div>
            </el-form-item>
            <el-form-item>
              <el-button @click="reset">重置</el-button>
              <el-button type="primary" @click="submit">提交</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

    <!-- 溯源二维码弹窗 -->
    <el-dialog v-model="traceVisible" title="溯源页二维码" width="480px">
      <div style="display:flex;gap:16px;align-items:center;flex-direction:column">
        <qrcode-vue :value="traceLink" :size="180" />
        <el-input v-model="traceLink" readonly />
        <el-button type="primary" @click="copy(traceLink)">复制链接</el-button>
      </div>
    </el-dialog>
  </div>
  
</template>

<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import QrcodeVue from 'qrcode.vue'
import { useOpsStore } from '@/stores/opsStore'

const opsStore = useOpsStore()
const { allProducts } = storeToRefs(opsStore)

// 表单状态
const editingId = ref(null)
const form = ref({
  name: '',
  description: '',
  basePrice: 0,
  costPrice: 0,
  origin: '',
  harvestTime: '',
  imageUrl: ''
})

// 列表操作
const startCreate = () => { editingId.value = null; reset() }
const startEdit = (row) => {
  editingId.value = row.id
  Object.assign(form.value, {
    name: row.name,
    description: row.description,
    basePrice: row.basePrice,
    costPrice: row.costPrice,
    origin: row.origin,
    harvestTime: row.harvestTime,
    imageUrl: row.imageUrl
  })
}
const remove = (row) => {
  opsStore.deleteProduct(row.id)
  ElMessage.success('已删除')
}

// 上传预览
const handleImage = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => { form.value.imageUrl = e.target.result }
  reader.readAsDataURL(file)
  return false
}

// 提交
const submit = () => {
  if (!form.value.name) return ElMessage.error('请输入产品名称')
  if (editingId.value) {
    opsStore.updateProduct(editingId.value, form.value)
    ElMessage.success('已更新')
  } else {
    opsStore.addProduct(form.value)
    ElMessage.success('已新增')
  }
}
const reset = () => {
  Object.assign(form.value, { name:'', description:'', basePrice:0, costPrice:0, origin:'', harvestTime:'', imageUrl:'' })
}

// 溯源
const traceVisible = ref(false)
const traceLink = ref('')
const openTrace = (row) => {
  traceLink.value = `${window.location.origin}/#/trace/${row.id}`
  traceVisible.value = true
}

const copy = async (text) => { if (text) { await navigator.clipboard.writeText(text); ElMessage.success('已复制') } }
</script>

<style scoped>
.app-container { padding: 24px; }
</style>


