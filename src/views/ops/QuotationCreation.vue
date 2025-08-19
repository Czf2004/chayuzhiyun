<template>
  <div class="app-container">
    <div class="page-header">
      <h1 class="page-title">专属报价管理</h1>
      <p class="page-subtitle">为客户创建个性化报价单，灵活调整产品价格与数量</p>
    </div>

    <el-card class="main-card">
      <!-- 头部：客户选择区 -->
      <template #header>
        <div class="card-header">
          <span class="header-title">创建专属报价</span>
          <el-select 
            v-model="selectedCustomerId" 
            placeholder="选择客户" 
            class="customer-select"
            clearable
          >
            <el-option 
              v-for="c in customers" 
              :key="c.id" 
              :label="c.name" 
              :value="c.id" 
            />
          </el-select>
        </div>
      </template>

      <!-- 产品添加区 -->
      <div class="product-add-section">
        <el-select 
          v-model="selectedProductId" 
          filterable 
          placeholder="搜索并选择产品" 
          class="product-select"
          clearable
          @change="handleProductSelect"
        >
          <el-option 
            v-for="p in products" 
            :key="p.id" 
            :label="`${p.name} (基础价: ¥${p.basePrice.toFixed(2)})`" 
            :value="p.id" 
          />
        </el-select>
        
        <el-button 
          type="primary" 
          @click="addSelected"
          class="add-button"
          :disabled="!selectedProductId"
        >
          <el-icon><Plus /></el-icon> 添加产品
        </el-button>
      </div>

      <!-- 报价项目列表 -->
      <div class="quote-table-container">
        <el-table 
          :data="items" 
          class="quote-table"
          border
          v-loading="tableLoading"
          :empty-text="items.length === 0 ? '暂无产品，请添加报价产品' : '加载中...'"
        >
          <el-table-column 
            label="产品名称" 
            min-width="200"
            align="left"
          >
            <template #default="{row}">
              <div class="product-info">
                <div class="product-name">{{ row.name }}</div>
                <div class="product-id text-muted">#{{ row.productId }}</div>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column 
            label="基础价(¥)" 
            width="140"
            align="right"
          >
            <template #default="{row}">{{ row.basePrice.toFixed(2) }}</template>
          </el-table-column>
          
          <el-table-column 
            label="数量" 
            width="140"
          >
            <template #default="{row}">
              <el-input-number 
                v-model="row.quantity" 
                :min="1" 
                :step="1"
                class="quantity-input"
                @change="handleQuantityChange"
              />
            </template>
          </el-table-column>
          
          <el-table-column 
            label="专属报价(¥)" 
            width="180"
            align="right"
          >
            <template #default="{row}">
              <el-input-number 
                v-model="row.unitPrice" 
                :min="0" 
                :step="10"
                :precision="2"
                class="price-input"
                @change="handlePriceChange(row)"
              />
            </template>
          </el-table-column>
          
          <el-table-column 
            label="小计(¥)" 
            width="160"
            align="right"
          >
            <template #default="{row}">
              <span :class="row.unitPrice < row.basePrice ? 'price-discounted' : ''">
                {{ (row.quantity * row.unitPrice).toFixed(2) }}
              </span>
            </template>
          </el-table-column>
          
          <el-table-column 
            label="操作" 
            width="120"
            align="center"
          >
            <template #default="{ $index }">
              <el-button 
                size="small" 
                type="danger" 
                @click="removeAt($index)"
                class="delete-button"
              >
                <el-icon :size="16"><Delete /></el-icon>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 总计与操作区 -->
      <div class="quote-summary">
        <div class="total-amount">
          <span class="total-label">报价总计：</span>
          <span class="total-value">¥{{ total.toFixed(2) }}</span>
          <span v-if="hasDiscount" class="discount-badge">含折扣</span>
        </div>
        
        <div class="action-buttons">
          <el-button 
            @click="resetQuote"
            class="reset-button"
          >
            <el-icon :size="16"><Refresh /></el-icon> 清空
          </el-button>
          
          <el-button 
            type="primary" 
            @click="generate"
            class="generate-button"
            :disabled="!selectedCustomerId || !items.length"
          >
            <el-icon :size="16"><Document /></el-icon> 生成报价单
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 结果弹窗 -->
    <el-dialog 
      v-model="showDialog" 
      title="专属报价单已生成" 
      width="560px"
      class="result-dialog"
      :close-on-click-modal="false"
    >
      <div class="dialog-content">
        <div class="quote-info">
          <p><span class="info-label">客户：</span>{{ currentCustomerName }}</p>
          <p><span class="info-label">报价单号：</span>{{ quoteId }}</p>
          <p><span class="info-label">生成时间：</span>{{ new Date().toLocaleString() }}</p>
          <p><span class="info-label">总金额：</span><span class="info-value">¥{{ total.toFixed(2) }}</span></p>
        </div>
        
        <div class="qrcode-section">
          <div class="qrcode-container">
            <qrcode-vue :value="shareLink" :size="180" class="qrcode" />
            <p class="qrcode-hint">扫码查看或分享报价单</p>
          </div>
        </div>
      </div>
      
      <div class="link-section">
        <el-input 
          v-model="shareLink" 
          readonly 
          class="share-link"
        />
        <el-button 
          type="primary" 
          @click="copy(shareLink)"
          class="copy-button"
        >
          <el-icon :size="16"><CopyDocument /></el-icon> 复制链接
        </el-button>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showDialog = false">关闭</el-button>
          <el-button type="primary" @click="downloadQuote">
            <el-icon :size="16"><Download /></el-icon> 下载报价单
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useOpsStore } from '@/stores/opsStore'
import { ElMessage, ElLoading, ElMessageBox } from 'element-plus'
import QrcodeVue from 'qrcode.vue'
import { Plus, Delete, Refresh, Document, CopyDocument, Download } from '@element-plus/icons-vue'

const opsStore = useOpsStore()

// 基础数据
const customers = computed(() => opsStore.customers || [])
const products = computed(() => opsStore.products || [])
const tableLoading = ref(false)

// 选中状态
const selectedCustomerId = ref(null)
const selectedProductId = ref(null)
const items = ref([])
const showDialog = ref(false)
const shareLink = ref('')
const quoteId = ref('')

// 当前客户名称
const currentCustomerName = computed(() => {
  const customer = customers.value.find(c => c.id === selectedCustomerId.value)
  return customer ? customer.name : '未选择客户'
})

// 检查是否有折扣
const hasDiscount = computed(() => {
  return items.value.some(item => item.unitPrice < item.basePrice)
})

// 添加产品
const addSelected = () => {
  if (!selectedProductId.value) {
    ElMessage.warning('请先选择产品')
    return
  }
  
  const product = products.value.find(p => p.id === selectedProductId.value)
  if (!product) {
    ElMessage.error('产品不存在')
    return
  }
  
  // 检查是否已添加
  if (items.value.some(item => item.productId === product.id)) {
    ElMessage.info('该产品已在报价单中')
    return
  }
  
  // 添加到列表
  items.value.push({
    productId: product.id,
    name: product.name,
    basePrice: product.basePrice,
    quantity: 1,
    unitPrice: product.basePrice // 默认使用基础价
  })
  
  // 清空选择
  selectedProductId.value = null
  ElMessage.success(`已添加产品：${product.name}`)
}

// 处理产品选择（自动填充基础价提示）
const handleProductSelect = (id) => {
  // 可添加产品详情预览逻辑
}

// 移除产品
const removeAt = (index) => {
  const removed = items.value.splice(index, 1)[0]
  ElMessage.info(`已移除产品：${removed.name}`)
}

// 数量变更处理
const handleQuantityChange = () => {
  // 可添加数量限制或价格联动逻辑
}

// 价格变更处理
const handlePriceChange = (row) => {
  if (row.unitPrice < row.basePrice * 0.5) {
    ElMessage.warning(`产品${row.name}的报价低于基础价的50%，请确认是否合理`)
  }
}

// 计算总计
const total = computed(() => {
  return items.value.reduce((sum, item) => {
    return sum + (item.quantity * item.unitPrice)
  }, 0)
})

// 重置报价单
const resetQuote = () => {
  if (items.value.length === 0) return
  
  ElMessageBox.confirm(
    '确定要清空当前报价单吗？所有已添加的产品将被移除。',
    '确认清空',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    items.value = []
    ElMessage.success('已清空报价单')
  }).catch(() => {
    // 取消操作
  })
}

// 生成报价单
const generate = () => {
  if (!selectedCustomerId.value) {
    ElMessage.warning('请先选择客户')
    return
  }
  
  if (items.value.length === 0) {
    ElMessage.warning('请添加至少一个产品')
    return
  }
  
  const loading = ElLoading.service({
    lock: true,
    text: '正在生成报价单...',
    background: 'rgba(255, 255, 255, 0.7)'
  })
  
  // 模拟API请求
  setTimeout(() => {
    const payloadItems = items.value.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPrice
    }))
    
    const res = opsStore.createQuotation({
      customerId: selectedCustomerId.value,
      items: payloadItems
    })
    
    // 生成报价单号（实际项目中由后端返回）
    quoteId.value = `QUOTE-${Date.now().toString().slice(-6)}`
    shareLink.value = `${window.location.origin}/#/quote/${res.uniqueCode || quoteId.value}`
    showDialog.value = true
    loading.close()
    ElMessage.success('报价单生成成功')
  }, 1200)
}

// 复制链接
const copy = async (text) => {
  if (!text) return
  
  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success('链接已复制到剪贴板')
  } catch (error) {
    ElMessage.error('复制失败，请手动复制')
  }
}

// 下载报价单
const downloadQuote = () => {
  ElMessage.info('正在准备下载报价单PDF...')
  // 实际项目中调用下载接口
  setTimeout(() => {
    ElMessage.success('报价单已下载')
  }, 1000)
}

// 监听客户变更
watch(selectedCustomerId, (newVal) => {
  if (!newVal) {
    ElMessage.info('请选择客户以创建专属报价')
  }
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

/* 主卡片 */
.main-card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  background-color: #fff;
  overflow: hidden;
}

/* 卡片头部 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.customer-select {
  width: 320px;
}

/* 产品添加区 */
.product-add-section {
  display: flex;
  gap: 16px;
  padding: 20px 0;
  align-items: center;
  border-bottom: 1px solid #f3f4f6;
}

.product-select {
  flex: 1;
  min-width: 240px;
}

.add-button {
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

/* 报价表格 */
.quote-table-container {
  padding: 12px 0;
}

.quote-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.quote-table th {
  background-color: #f9fafb;
  font-weight: 600;
  color: #6b7280;
  font-size: 13px;
  padding: 14px 16px;
  border-bottom: 1px solid #f3f4f6;
}

.quote-table td {
  padding: 16px;
  border-bottom: 1px solid #f3f4f6;
}

.quote-table .el-table__row:hover > td {
  background-color: #f9fafb;
}

.product-info {
  display: flex;
  flex-direction: column;
}

.product-name {
  font-weight: 500;
  color: #111827;
}

.product-id {
  font-size: 12px;
  margin-top: 4px;
}

.text-muted {
  color: #9ca3af;
}

.quantity-input, .price-input {
  width: 100px;
}

.price-discounted {
  color: #dc2626;
  font-weight: 500;
}

.delete-button {
  padding: 4px 8px;
  border-radius: 4px;
}

/* 报价汇总 */
.quote-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  margin-top: 12px;
  border-top: 1px solid #f3f4f6;
}

.total-amount {
  display: flex;
  align-items: center;
  gap: 12px;
}

.total-label {
  font-size: 16px;
  color: #4b5563;
}

.total-value {
  font-size: 22px;
  font-weight: 600;
  color: #111827;
}

.discount-badge {
  background-color: #fee2e2;
  color: #dc2626;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 500;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.reset-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.generate-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

/* 弹窗样式 */
.result-dialog .el-dialog__header {
  padding: 20px 24px;
  border-bottom: 1px solid #f3f4f6;
}

.result-dialog .el-dialog__title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}

.result-dialog .el-dialog__body {
  padding: 24px;
}

.dialog-content {
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  align-items: center;
  margin-bottom: 24px;
}

.quote-info {
  flex: 1;
  min-width: 240px;
}

.info-label {
  color: #6b7280;
  font-weight: 500;
}

.info-value {
  color: #16a34a;
  font-weight: 600;
}

.quote-info p {
  margin: 0 0 12px 0;
  line-height: 1.5;
}

.qrcode-section {
  display: flex;
  justify-content: center;
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

.link-section {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.share-link {
  flex: 1;
}

.copy-button {
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .customer-select {
    width: 260px;
  }
}

@media (max-width: 992px) {
  .app-container {
    padding: 24px;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .customer-select {
    width: 100%;
  }
  
  .dialog-content {
    flex-direction: column;
    gap: 24px;
  }
}

@media (max-width: 768px) {
  .app-container {
    padding: 16px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .product-add-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .add-button {
    width: 100%;
    justify-content: center;
  }
  
  .quote-summary {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .action-buttons {
    width: 100%;
    justify-content: space-between;
  }
  
  .reset-button, .generate-button {
    flex: 1;
    justify-content: center;
  }
  
  .link-section {
    flex-direction: column;
  }
  
  .copy-button {
    width: 100%;
  }
}

@media (max-width: 576px) {
  .action-buttons {
    flex-direction: column;
    gap: 8px;
  }
  
  .dialog-footer {
    flex-direction: column;
  }
  
  .dialog-footer .el-button {
    width: 100%;
  }
}
</style>