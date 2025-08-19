<template>
  <div class="app-container">
    <el-card class="card-modern">
      <template #header>
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span>专属报价</span>
          <el-select v-model="selectedCustomerId" placeholder="选择客户" style="width:280px">
            <el-option v-for="c in customers" :key="c.id" :label="c.name" :value="c.id" />
          </el-select>
        </div>
      </template>

      <!-- 产品添加区 -->
      <div style="display:flex;gap:12px;align-items:center;margin-bottom:12px">
        <el-select v-model="selectedProductId" filterable placeholder="搜索选择产品" style="width:360px">
          <el-option v-for="p in products" :key="p.id" :label="p.name" :value="p.id" />
        </el-select>
        <el-button @click="addSelected">添加</el-button>
      </div>

      <!-- 报价项目列表 -->
      <el-table :data="items" stripe>
        <el-table-column label="产品名" min-width="220">
          <template #default="{row}">{{ row.name }}</template>
        </el-table-column>
        <el-table-column label="基础价(¥)" width="140">
          <template #default="{row}">{{ row.basePrice }}</template>
        </el-table-column>
        <el-table-column label="数量" width="140">
          <template #default="{row}"><el-input-number v-model="row.quantity" :min="1" /></template>
        </el-table-column>
        <el-table-column label="专属报价(¥)" width="180">
          <template #default="{row}"><el-input-number v-model="row.unitPrice" :min="0" :step="10" /></template>
        </el-table-column>
        <el-table-column label="小计(¥)" width="160">
          <template #default="{row}">{{ (row.quantity * row.unitPrice).toFixed(2) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="{ $index }"><el-button size="small" type="danger" @click="removeAt($index)">删除</el-button></template>
        </el-table-column>
      </el-table>

      <div style="margin-top:12px;text-align:right">总计：<b>¥{{ total.toFixed(2) }}</b></div>

      <div style="margin-top:16px;display:flex;gap:12px">
        <el-button type="primary" @click="generate">生成报价单</el-button>
      </div>
    </el-card>

    <!-- 结果弹窗 -->
    <el-dialog v-model="showDialog" title="专属报价单" width="520px" class="glass">
      <div style="display:flex;gap:16px;align-items:center;flex-direction:column">
        <qrcode-vue :value="shareLink" :size="180" />
        <el-input v-model="shareLink" readonly />
        <el-button type="primary" @click="copy(shareLink)">复制链接</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useOpsStore } from '@/stores/opsStore'
import QrcodeVue from 'qrcode.vue'

const opsStore = useOpsStore()
const customers = computed(() => opsStore.customers)
const products = computed(() => opsStore.products)
const selectedCustomerId = ref(null)
const selectedProductId = ref(null)
// items: { productId, name, basePrice, quantity, unitPrice }
const items = ref([])

const addSelected = () => {
  const id = selectedProductId.value
  if (!id) return
  const p = products.value.find(x => x.id === id)
  if (!p) return
  if (items.value.some(it => it.productId === id)) return
  items.value.push({ productId: p.id, name: p.name, basePrice: p.basePrice, quantity: 1, unitPrice: p.basePrice })
}

const removeAt = (idx) => items.value.splice(idx, 1)
const total = computed(() => items.value.reduce((s, it) => s + it.quantity * it.unitPrice, 0))

const showDialog = ref(false)
const shareLink = ref('')
const generate = () => {
  if (!selectedCustomerId.value) return
  if (!items.value.length) return
  const payloadItems = items.value.map(it => ({ productId: it.productId, quantity: it.quantity, unitPrice: it.unitPrice }))
  const res = opsStore.createQuotation({ customerId: selectedCustomerId.value, items: payloadItems })
  shareLink.value = `${window.location.origin}/#/quote/${res.uniqueCode}`
  showDialog.value = true
}
</script>

<style scoped>
.app-container { padding: 24px; }
</style>


