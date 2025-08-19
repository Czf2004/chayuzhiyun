<template>
  <div class="app-container">
    <div class="page-header">
      <h1 class="page-title">产品管理</h1>
      <p class="page-subtitle">管理产品信息、价格与溯源数据</p>
    </div>

    <el-row :gutter="24" class="main-content">
      <!-- 产品列表区域（16列） -->
      <el-col :span="16" :xs="24" class="list-column">
        <el-card class="content-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">产品列表</span>
              <div style="display:flex; gap:12px; align-items:center;">
                <el-input v-model="query.keyword" placeholder="搜索名称/描述/产地" clearable style="width: 260px" />
                <el-select v-model="query.sort" placeholder="排序" style="width: 160px">
                  <el-option label="按创建时间" value="createdAt" />
                  <el-option label="按基础价" value="basePrice" />
                  <el-option label="按成本价" value="costPrice" />
                </el-select>
                <el-button type="primary" @click="applyQuery" class="add-button">
                  <el-icon><Refresh /></el-icon> 筛选
                </el-button>
                <el-button type="primary" @click="startCreate" class="add-button">
                  <el-icon><Plus /></el-icon> 新增产品
                </el-button>
              </div>
            </div>
          </template>
          
          <div class="table-container">
            <el-table 
              :data="pagedProducts" 
              class="products-table"
              highlight-current-row
              v-loading="tableLoading"
            >
              <el-table-column label="图片" width="100" align="center">
                <template #default="{row}">
                  <div class="product-image-container">
                    <img 
                      :src="row.imageUrl || defaultProductImage" 
                      alt="Product image" 
                      class="product-image"
                    />
                  </div>
                </template>
              </el-table-column>
              
              <el-table-column prop="name" label="名称" min-width="160" />
              
              <el-table-column prop="description" label="描述" min-width="220">
                <template #default="{row}">
                  <span class="description-text" :title="row.description">{{ row.description }}</span>
                </template>
              </el-table-column>
              
              <el-table-column prop="basePrice" label="基础价(¥)" width="120" align="right">
                <template #default="{row}">{{ row.basePrice.toFixed(2) }}</template>
              </el-table-column>
              
              <el-table-column prop="costPrice" label="成本价(¥)" width="120" align="right">
                <template #default="{row}">{{ row.costPrice.toFixed(2) }}</template>
              </el-table-column>
              
              <el-table-column prop="origin" label="产地" width="140" />
              
              <el-table-column label="操作" width="280" fixed="right">
                <template #default="{row}">
                  <el-button 
                    size="small" 
                    @click="startEdit(row)"
                    class="btn-edit"
                  >
                    <el-icon :size="16"><Edit /></el-icon> 编辑
                  </el-button>
                  <el-button 
                    size="small" 
                    type="danger" 
                    @click="remove(row)"
                    class="btn-delete"
                  >
                    <el-icon :size="16"><Delete /></el-icon> 删除
                  </el-button>
                  <el-button 
                    size="small" 
                    type="success" 
                    @click="openTrace(row)"
                    class="btn-trace"
                  >
                    <el-icon :size="16"><Ticket /></el-icon> 溯源
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          
          <!-- 空状态 -->
          <div v-if="allProducts.length === 0 && !tableLoading" class="empty-state">
            <el-empty 
              description="暂无产品数据"
              image-size="100"
            >
              <el-button type="primary" @click="startCreate">
                <el-icon><Plus /></el-icon> 立即添加
              </el-button>
            </el-empty>
          </div>
          <div style="display:flex; justify-content:flex-end; padding: 12px 0 4px;">
            <el-pagination
              background
              layout="total, prev, pager, next"
              :total="filteredProducts.length"
              :page-size="pageSize"
              :current-page.sync="page"
            />
          </div>
        </el-card>
      </el-col>

      <!-- 产品表单区域（8列） -->
      <el-col :span="8" :xs="24" class="form-column">
        <el-card class="content-card form-card">
          <template #header>
            <span class="card-title">{{ editingId ? '编辑产品' : '新增产品' }}</span>
          </template>

          <el-form 
            :model="form" 
            label-width="100px" 
            class="product-form"
            :rules="formRules"
            ref="formRef"
          >
            <el-form-item label="产品名称" prop="name">
              <el-input 
                v-model="form.name" 
                placeholder="如：明前特级龙井" 
                class="form-input"
              />
            </el-form-item>
            
            <el-form-item label="描述" prop="description">
              <el-input 
                v-model="form.description" 
                type="textarea" 
                :rows="4" 
                placeholder="产品描述/故事文案" 
                class="form-input"
              />
            </el-form-item>
            
            <el-form-item label="基础价格" prop="basePrice">
              <el-input-number 
                v-model="form.basePrice" 
                :min="0" 
                :step="10" 
                class="form-input"
                placeholder="0.00"
                precision="2"
              />
            </el-form-item>
            
            <el-form-item label="成本价" prop="costPrice">
              <el-input-number 
                v-model="form.costPrice" 
                :min="0" 
                :step="10" 
                class="form-input"
                placeholder="0.00"
                precision="2"
              />
            </el-form-item>
            
            <el-form-item label="产地" prop="origin">
              <el-input 
                v-model="form.origin" 
                placeholder="如：浙江·杭州西湖" 
                class="form-input"
              />
            </el-form-item>
            
            <el-form-item label="采摘时间" prop="harvestTime">
              <el-date-picker 
                v-model="form.harvestTime" 
                type="date" 
                value-format="YYYY-MM-DD" 
                placeholder="选择日期" 
                class="form-input"
              />
            </el-form-item>
            
            <el-form-item label="产品图片">
              <el-upload 
                class="uploader" 
                :auto-upload="false" 
                :show-file-list="false" 
                :before-upload="handleImage"
              >
                <template #trigger>
                  <el-button class="upload-button">
                    <el-icon><Picture /></el-icon> 选择图片
                  </el-button>
                </template>
              </el-upload>
              
              <div v-if="form.imageUrl" class="image-preview-container">
                <img 
                  :src="form.imageUrl" 
                  class="image-preview"
                  alt="Product preview"
                />
                <el-button 
                  type="text" 
                  class="remove-image"
                  @click="form.imageUrl = ''"
                >
                  <el-icon :size="16"><Close /></el-icon> 移除
                </el-button>
              </div>
              
              <p class="upload-hint">支持JPG、PNG格式，建议尺寸800×600px</p>
            </el-form-item>
            
            <el-form-item class="form-actions">
              <el-button 
                @click="reset"
                class="btn-reset"
              >
                重置
              </el-button>
              <el-button 
                type="primary" 
                @click="submit"
                class="btn-submit"
              >
                {{ editingId ? '更新' : '提交' }}
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

    <!-- 溯源二维码弹窗 -->
    <el-dialog 
      v-model="traceVisible" 
      title="产品溯源二维码" 
      width="520px"
      class="trace-dialog"
      :close-on-click-modal="false"
    >
      <div class="trace-content">
        <div class="trace-info">
          <h3 class="trace-product-name">{{ currentProduct.name }}</h3>
          <p class="trace-product-origin">产地：{{ currentProduct.origin || '未设置' }}</p>
          <p class="trace-product-date">采摘时间：{{ currentProduct.harvestTime || '未设置' }}</p>
        </div>
        
        <div class="qrcode-container">
          <qrcode-vue :value="traceLink" :size="180" class="qrcode" />
          <p class="qrcode-hint">扫码查看产品溯源信息</p>
        </div>
      </div>
      
      <div class="trace-link-container">
        <el-input 
          v-model="traceLink" 
          readonly 
          class="trace-link"
          placeholder="溯源链接"
        />
        <el-button 
          type="primary" 
          @click="copy(traceLink)"
          class="copy-button"
        >
          <el-icon :size="16"><CopyDocument /></el-icon> 复制链接
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { ElMessage, ElLoading, ElMessageBox } from 'element-plus'
import QrcodeVue from 'qrcode.vue'
import { useOpsStore } from '@/stores/opsStore'
import { Plus, Edit, Delete, Ticket, Picture, Close, CopyDocument } from '@element-plus/icons-vue'

// 引入默认产品图片
const defaultProductImage = 'https://picsum.photos/seed/tea-default/120/90'

const opsStore = useOpsStore()
const { allProducts } = storeToRefs(opsStore)
const query = reactive({ keyword: '', sort: 'createdAt' })
const page = ref(1)
const pageSize = 10

const filteredProducts = computed(() => {
  const kw = (query.keyword || '').trim().toLowerCase()
  let list = allProducts.value.slice()
  if (kw) {
    list = list.filter(p =>
      String(p.name || '').toLowerCase().includes(kw) ||
      String(p.description || '').toLowerCase().includes(kw) ||
      String(p.origin || '').toLowerCase().includes(kw)
    )
  }
  if (query.sort === 'basePrice') list.sort((a,b)=> (a.basePrice||0)-(b.basePrice||0))
  else if (query.sort === 'costPrice') list.sort((a,b)=> (a.costPrice||0)-(b.costPrice||0))
  return list
})

const pagedProducts = computed(() => {
  const start = (page.value - 1) * pageSize
  return filteredProducts.value.slice(start, start + pageSize)
})

const applyQuery = () => { page.value = 1 }
const tableLoading = ref(false)
const formRef = ref(null)

// 表单验证规则
const formRules = reactive({
  name: [
    { required: true, message: '请输入产品名称', trigger: 'blur' },
    { max: 50, message: '名称不能超过50个字符', trigger: 'blur' }
  ],
  basePrice: [
    { required: true, message: '请输入基础价格', trigger: 'blur' },
    { type: 'number', min: 0, message: '价格不能为负数', trigger: 'blur' }
  ],
  costPrice: [
    { required: true, message: '请输入成本价', trigger: 'blur' },
    { type: 'number', min: 0, message: '成本价不能为负数', trigger: 'blur' }
  ]
})

// 表单状态
const editingId = ref(null)
const currentProduct = ref({})
const form = reactive({
  name: '',
  description: '',
  basePrice: 0,
  costPrice: 0,
  origin: '',
  harvestTime: '',
  imageUrl: ''
})

// 列表操作
const startCreate = () => {
  editingId.value = null
  reset()
  // 在移动设备上自动滚动到表单区域
  if (window.innerWidth < 768) {
    document.querySelector('.form-column').scrollIntoView({ behavior: 'smooth' })
  }
}

const startEdit = (row) => {
  editingId.value = row.id
  currentProduct.value = { ...row }
  Object.assign(form, {
    name: row.name,
    description: row.description,
    basePrice: row.basePrice,
    costPrice: row.costPrice,
    origin: row.origin,
    harvestTime: row.harvestTime,
    imageUrl: row.imageUrl
  })
  
  // 在移动设备上自动滚动到表单区域
  if (window.innerWidth < 768) {
    document.querySelector('.form-column').scrollIntoView({ behavior: 'smooth' })
  }
}

const remove = (row) => {
  ElMessageBox.confirm(
    `确定要删除产品"${row.name}"吗？此操作不可撤销。`,
    '删除确认',
    {
      confirmButtonText: '确认删除',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    tableLoading.value = true
    // 模拟API请求延迟
    setTimeout(() => {
      opsStore.deleteProduct(row.id)
      ElMessage.success('产品已删除')
      tableLoading.value = false
    }, 500)
  }).catch(() => {
    // 取消删除
  })
}

// 上传预览
const handleImage = (file) => {
  // 验证文件类型和大小
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('请上传图片文件（JPG、PNG格式）')
    return false
  }
  
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过2MB')
    return false
  }

  const reader = new FileReader()
  reader.onload = (e) => { 
    form.imageUrl = e.target.result 
  }
  reader.readAsDataURL(file)
  return false
}

// 提交表单
const submit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      const loading = ElLoading.service({ 
        lock: true, 
        text: editingId.value ? '更新中...' : '提交中...', 
        background: 'rgba(255, 255, 255, 0.7)' 
      })

      // 模拟API请求延迟
      setTimeout(() => {
        if (editingId.value) {
          opsStore.updateProduct(editingId.value, { ...form })
          ElMessage.success('产品已更新')
        } else {
          opsStore.addProduct({ ...form })
          ElMessage.success('产品已新增')
          reset() // 新增成功后重置表单
        }
        loading.close()
      }, 800)
    }
  })
}

const reset = () => {
  formRef.value.resetFields()
  form.imageUrl = ''
}

// 溯源功能
const traceVisible = ref(false)
const traceLink = ref('')

const openTrace = (row) => {
  currentProduct.value = row
  traceLink.value = `${window.location.origin}/#/trace/${row.id}`
  traceVisible.value = true
}

const copy = async (text) => {
  if (text) {
    try {
      await navigator.clipboard.writeText(text)
      ElMessage.success('链接已复制')
    } catch (error) {
      ElMessage.error('复制失败，请手动复制')
    }
  }
}

// 初始化加载
onMounted(() => {
  // 模拟数据加载
  tableLoading.value = true
  setTimeout(() => {
    tableLoading.value = false
  }, 800)
})
</script>

<style scoped>
.app-container {
  padding: 32px;
  background-color: #f9fafb;
  min-height: 100vh;
}

/* 页面标题 */
.page-header {
  margin-bottom: 32px;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 16px;
  color: #6b7280;
  margin: 0;
}

/* 主内容区域 */
.main-content {
  display: flex;
  flex-wrap: wrap;
}

/* 卡片样式 */
.content-card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  background-color: #fff;
  overflow: hidden;
  transition: all 0.2s ease;
}

.content-card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

/* 列表区域 */
.list-column {
  margin-bottom: 24px;
}

.table-container {
  overflow: auto;
}

.products-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.products-table th {
  background-color: #f9fafb;
  font-weight: 600;
  color: #6b7280;
  font-size: 13px;
  padding: 14px 16px;
  border-bottom: 1px solid #f3f4f6;
}

.products-table td {
  padding: 16px;
  border-bottom: 1px solid #f3f4f6;
  transition: background-color 0.2s ease;
}

.products-table .el-table__row:hover > td {
  background-color: #f9fafb;
}

.product-image-container {
  width: 72px;
  height: 54px;
  border-radius: 6px;
  overflow: hidden;
  background-color: #f3f4f6;
  margin: 0 auto;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-image-container:hover .product-image {
  transform: scale(1.05);
}

.description-text {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  color: #4b5563;
}

.add-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
}

/* 按钮样式 */
.btn-edit {
  color: #3b82f6;
  border-color: #dbeafe;
  margin-right: 6px;
}

.btn-edit:hover {
  background-color: #eff6ff;
}

.btn-delete {
  margin-right: 6px;
}

.btn-trace {
  color: #16a34a;
  border-color: #dcfce7;
}

.btn-trace:hover {
  background-color: #f0fdf4;
}

/* 表单区域 */
.form-column {
  margin-bottom: 24px;
}

.form-card {
  position: sticky;
  top: 24px;
}

.product-form {
  padding-top: 8px;
}

.form-input {
  width: 100%;
  border-radius: 6px;
}

.uploader {
  margin-bottom: 12px;
}

.upload-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.image-preview-container {
  position: relative;
  width: 120px;
  height: 90px;
  border-radius: 6px;
  overflow: hidden;
  background-color: #f3f4f6;
}

.image-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-image {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  padding: 0;
  margin: 0;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.image-preview-container:hover .remove-image {
  opacity: 1;
}

.upload-hint {
  margin: 8px 0 0 0;
  font-size: 12px;
  color: #9ca3af;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.btn-reset {
  flex: 1;
}

.btn-submit {
  flex: 1;
}

/* 空状态 */
.empty-state {
  padding: 48px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* 溯源弹窗 */
.trace-dialog .el-dialog__header {
  padding: 20px 24px 16px;
  border-bottom: 1px solid #f3f4f6;
}

.trace-dialog .el-dialog__title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}

.trace-dialog .el-dialog__body {
  padding: 24px;
}

.trace-content {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.trace-info {
  min-width: 240px;
}

.trace-product-name {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #111827;
}

.trace-product-origin,
.trace-product-date {
  margin: 0 0 8px 0;
  color: #4b5563;
  font-size: 14px;
}

.qrcode-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.qrcode {
  border: 8px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

.qrcode-hint {
  margin: 12px 0 0 0;
  font-size: 14px;
  color: #6b7280;
}

.trace-link-container {
  display: flex;
  gap: 12px;
}

.trace-link {
  flex: 1;
}

.copy-button {
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

/* 响应式调整 */
@media (max-width: 1024px) {
  .app-container {
    padding: 24px;
  }
  
  .main-content {
    gap: 24px;
  }
  
  .list-column, .form-column {
    margin-bottom: 0;
  }
}

@media (max-width: 768px) {
  .app-container {
    padding: 16px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .add-button {
    width: 100%;
    justify-content: center;
  }
  
  .trace-content {
    flex-direction: column;
  }
  
  .trace-link-container {
    flex-direction: column;
  }
  
  .copy-button {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .products-table .el-button--small {
    padding: 4px 8px;
    font-size: 12px;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style>