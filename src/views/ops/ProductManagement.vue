<template>
  <div class="app-container">
    <!-- 页面头：品牌感强化 -->
    <div class="page-header">
      <div class="header-inner">
        <h1 class="page-title">产品管理系统</h1>
        <p class="page-subtitle">全生命周期管理 | 溯源数据追踪</p>
      </div>
    </div>

    <!-- 主容器：双栏布局 + 响应式适配 -->
    <div class="main-layout">
      <!-- 左侧：产品列表区（16列） -->
      <div class="layout-column list-column">
        <el-card class="content-card list-card">
          <!-- 头部：搜索+筛选+操作 -->
          <div class="card-header">
            <div class="header-title-group">
              <span class="card-title">产品列表</span>
              <div class="divider"></div>
              <p class="header-meta">当前展示 {{ filteredProducts.length }} 条结果</p>
            </div>

            <div class="header-actions">
              <!-- 搜索 -->
              <el-input 
                v-model="query.keyword" 
                placeholder="搜索名称/描述/产地" 
                clearable 
                class="search-input"
              />
              
              <!-- 筛选 -->
              <el-select 
                v-model="query.sort" 
                placeholder="排序方式" 
                class="sort-select"
              >
                <el-option label="创建时间" value="createdAt" />
                <el-option label="基础价" value="basePrice" />
                <el-option label="成本价" value="costPrice" />
              </el-select>
              
              <!-- 操作按钮 -->
              <el-button 
                type="primary" 
                @click="applyQuery"
                class="action-btn"
              >
                <el-icon :size="16"><Refresh /></el-icon>
                筛选
              </el-button>
              <el-button 
                type="primary" 
                @click="startCreate"
                class="action-btn"
              >
                <el-icon :size="16"><Plus /></el-icon>
                新增产品
              </el-button>
            </div>
          </div>

          <!-- 表格区：滚动容器 + 空状态 -->
          <div class="table-wrapper">
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

            <!-- 空状态：独立容器，视觉更突出 -->
            <div v-if="filteredProducts.length === 0 && !tableLoading" class="empty-state">
              <el-empty 
                description="暂无产品数据"
                image-size="100"
              >
                <el-button type="primary" @click="startCreate">
                  <el-icon><Plus /></el-icon> 立即添加
                </el-button>
              </el-empty>
            </div>
          </div>

          <!-- 分页器：固定在卡片底部 -->
          <div class="pagination-bar">
            <el-pagination
              background
              layout="total, prev, pager, next"
              :total="filteredProducts.length"
              :page-size="pageSize"
              v-model:current-page="page"
            />
          </div>
        </el-card>
      </div>

      <!-- 右侧：产品表单区（8列） -->
      <div class="layout-column form-column">
        <el-card class="content-card form-card">
          <template #header>
            <span class="card-title">
              {{ editingId ? '编辑产品' : '新增产品' }}
            </span>
          </template>

          <!-- 表单核心：和原有逻辑一致，强化布局 -->
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
      </div>
    </div>

    <!-- 溯源弹窗：保持原有逻辑，强化样式 -->
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
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="traceVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { ElMessage, ElLoading, ElMessageBox } from 'element-plus'
import QrcodeVue from 'qrcode.vue'
import { useOpsStore } from '@/stores/opsStore'
import { Plus, Edit, Delete, Ticket, Picture, Close, CopyDocument, Refresh } from '@element-plus/icons-vue'

// 静态配置
const defaultProductImage = 'https://picsum.photos/seed/tea-default/120/90'
const pageSize = ref(10)

// 状态管理
const opsStore = useOpsStore()
const { allProducts } = storeToRefs(opsStore)

// 查询参数
const query = reactive({ 
  keyword: '', 
  sort: 'createdAt' 
})
const page = ref(1)

// 数据过滤 & 分页
const filteredProducts = computed(() => {
  const kw = (query.keyword || '').trim().toLowerCase()
  let list = allProducts.value.slice()
  
  // 搜索过滤
  if (kw) {
    list = list.filter(p => 
      (p.name || '').toLowerCase().includes(kw) ||
      (p.description || '').toLowerCase().includes(kw) ||
      (p.origin || '').toLowerCase().includes(kw)
    )
  }
  
  // 排序
  if (query.sort === 'basePrice') list.sort((a,b) => (a.basePrice || 0) - (b.basePrice || 0))
  else if (query.sort === 'costPrice') list.sort((a,b) => (a.costPrice || 0) - (b.costPrice || 0))
  
  return list
})

const pagedProducts = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filteredProducts.value.slice(start, start + pageSize.value)
})

// 表单 & 交互逻辑
const formRef = ref(null)
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

const startCreate = () => {
  editingId.value = null
  reset()
  if (window.innerWidth < 768) {
    document.querySelector('.form-column')?.scrollIntoView({ behavior: 'smooth' })
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
  
  if (window.innerWidth < 768) {
    document.querySelector('.form-column')?.scrollIntoView({ behavior: 'smooth' })
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
    setTimeout(() => {
      opsStore.deleteProduct(row.id)
      ElMessage.success('产品已删除')
      tableLoading.value = false
    }, 500)
  }).catch(() => {
    // 取消删除
  })
}

const handleImage = (file) => {
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

const submit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      const loading = ElLoading.service({ 
        lock: true, 
        text: editingId.value ? '更新中...' : '提交中...', 
        background: 'rgba(255, 255, 255, 0.7)' 
      })

      setTimeout(() => {
        if (editingId.value) {
          opsStore.updateProduct(editingId.value, { ...form })
          ElMessage.success('产品已更新')
        } else {
          opsStore.addProduct({ ...form })
          ElMessage.success('产品已新增')
          reset()
        }
        loading.close()
      }, 800)
    }
  })
}

const reset = () => {
  formRef.value?.resetFields()
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

// 加载态 & 初始化
const tableLoading = ref(false)
const applyQuery = () => { page.value = 1 }

onMounted(() => {
  if (window.innerWidth < 768) {
    pageSize.value = 6
  }
  tableLoading.value = true
  setTimeout(() => (tableLoading.value = false), 800)
})
</script>

<style scoped lang="scss">
// 变量定义：统一风格
$primary-color: #3b82f6;
$radius-base: 12px;
$shadow-base: 0 4px 12px rgba(0,0,0,0.05);

.app-container {
  padding: 32px;
  background: #f9fafb;
  min-height: 100vh;
  width: 100%;
}

/* 页面头：品牌级展示 */
.page-header {
  .header-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 16px 0;
    border-bottom: 1px solid #e5e7eb;
    
    .page-title {
      font-size: 32px;
      font-weight: 700;
      color: #111827;
      margin: 0;
    }
    .page-subtitle {
      font-size: 14px;
      color: #6b7280;
      margin: 4px 0 0;
    }
  }
}

/* 主布局：双栏弹性布局 */
.main-layout {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  max-width: 1440px;
  margin: 24px auto 0;
  
  .layout-column {
    flex: 1;
    min-width: 320px;
  }
  .list-column { flex: 2 1 0; }
  .form-column { flex: 1 1 0; }
}

/* 卡片统一样式：强化层次 */
.content-card {
  border: none;
  border-radius: $radius-base;
  box-shadow: $shadow-base;
  background: #fff;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  }
}

/* 列表卡片：头部操作区 */
.list-card {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #f3f4f6;
    
    .header-title-group {
      display: flex;
      align-items: center;
      gap: 12px;
      
      .card-title {
        font-size: 18px;
        font-weight: 600;
        color: #111827;
      }
      .divider {
        width: 1px;
        height: 20px;
        background: #e5e7eb;
      }
      .header-meta {
        font-size: 14px;
        color: #6b7280;
        margin: 0;
      }
    }
    
    .header-actions {
      display: flex;
      align-items: center;
      gap: 12px;
      
      .search-input {
        width: 240px;
        border-radius: 8px;
      }
      .sort-select {
        width: 160px;
        border-radius: 8px;
      }
      .action-btn {
        padding: 8px 16px;
        border-radius: 8px;
        &.is-icon {
          i { margin-right: 6px; }
        }
      }
    }
  }
  
  .table-wrapper {
    max-height: 600px;
    overflow: auto;
    padding: 16px;
    position: relative;
  }
  /* 表头吸顶 */
  .products-table {
    .el-table__header-wrapper {
      position: sticky;
      top: 0;
      z-index: 3;
      background: #f9fafb;
    }
  }
  
  .pagination-bar {
    padding: 16px 20px;
    border-top: 1px solid #f3f4f6;
    background: #f9fafb;
    text-align: right;
  }
}

/* 表单卡片： sticky 优化 + 响应式 */
.form-card {
  position: sticky;
  top: 32px;
  padding: 20px;
  
  @media (max-width: 768px) {
    position: static;
  }
  
  .product-form {
    .form-input {
      width: 100%;
      border-radius: 8px;
    }
    .upload-button {
      border-radius: 8px;
    }
    .form-actions {
      display: flex;
      gap: 12px;
      margin-top: 24px;
      
      .btn-reset, .btn-submit {
        flex: 1;
        border-radius: 8px;
      }
    }
  }
}

/* 表格交互：强化 hover & 对齐 */
.products-table {
  th {
    background: #f9fafb;
    font-weight: 600;
    color: #6b7280;
  }
  td {
    &:hover {
      background: #f3f4f6;
    }
  }
}

/* 图片与文本优化 */
.product-image-container {
  width: 80px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  background: #f3f4f6;
  display: inline-block;
}
.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.description-text {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 空状态：居中强化 */
.empty-state {
  padding: 64px 0;
  text-align: center;
}

/* 溯源弹窗：视觉升级 */
.trace-dialog {
  .el-dialog__header {
    border-bottom: 1px solid #f3f4f6;
  }
  .trace-content {
    gap: 32px;
    .trace-info {
      .trace-product-name {
        font-size: 20px;
        font-weight: 600;
      }
    }
    .qrcode {
      border: 12px solid #fff;
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    }
  }
}

/* 响应式适配：多断点覆盖 */
@media (max-width: 1200px) {
  .main-layout {
    flex-direction: column;
  }
  .list-column, .form-column {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .app-container {
    padding: 16px;
  }
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  .header-actions {
    flex-direction: column;
    width: 100%;
    gap: 8px;
    
    .search-input, .sort-select, .action-btn {
      width: 100%;
    }
  }
  .list-card {
    .table-wrapper {
      max-height: 420px;
    }
  }
}
</style>
