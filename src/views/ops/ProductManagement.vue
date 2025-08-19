<template>
  <div class="app-container">
    <el-card>
      <template #header>
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span>精品茶册</span>
          <el-button type="primary" @click="showAdd=true">新增产品</el-button>
        </div>
      </template>
      <el-table :data="products" stripe>
        <el-table-column label="图片" width="100">
          <template #default="{row}">
            <img :src="row.imageUrl" alt="" style="width:72px;height:54px;object-fit:cover;border-radius:6px" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" min-width="160" />
        <el-table-column prop="year" label="年份" width="100" />
        <el-table-column prop="region" label="产区" width="160" />
        <el-table-column prop="basePrice" label="基础价(¥)" width="120" />
        <el-table-column label="故事" min-width="240">
          <template #default="{row}">{{ row.story || row.desc }}</template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{row}">
            <el-button size="small" @click="genTrace(row)">生成溯源页</el-button>
            <el-button size="small" type="primary" @click="copy(row.traceUrl)" :disabled="!row.traceUrl">复制链接</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="showAdd" title="新增产品" width="640px">
      <el-form :model="form" label-width="120px">
        <el-form-item label="名称"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="年份"><el-input-number v-model="form.year" :min="2000" :max="2100" /></el-form-item>
        <el-form-item label="产区"><el-input v-model="form.region" /></el-form-item>
        <el-form-item label="基础价(¥)"><el-input-number v-model="form.basePrice" :min="0" :step="10" /></el-form-item>
        <el-form-item label="图片URL"><el-input v-model="form.imageUrl" placeholder="粘贴图片链接" /></el-form-item>
        <el-form-item label="故事文案"><el-input v-model="form.story" type="textarea" :rows="4" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAdd=false">取消</el-button>
        <el-button type="primary" @click="handleAdd">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useOpsStore } from '@/stores/opsStore'

const store = useOpsStore()
const products = store.products
const showAdd = ref(false)
const form = ref({ name:'', desc:'', basePrice:0, year:new Date().getFullYear(), region:'', story:'', imageUrl:'' })

const handleAdd = () => {
  if (!form.value.name) return ElMessage.error('请输入名称')
  store.addProduct(form.value)
  showAdd.value = false
  Object.assign(form.value, { name:'', desc:'', basePrice:0, year:new Date().getFullYear(), region:'', story:'', imageUrl:'' })
  ElMessage.success('已新增产品')
}

const genTrace = (row) => {
  const url = store.generateTrace(row.id)
  ElMessage.success('已生成溯源链接')
}

const copy = async (text) => {
  if (!text) return
  await navigator.clipboard.writeText(text)
  ElMessage.success('链接已复制')
}
</script>

<style scoped>
.app-container { padding: 24px; }
</style>


