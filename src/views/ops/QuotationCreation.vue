<template>
  <div class="app-container">
    <el-card>
      <template #header>
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span>专属报价</span>
          <div style="display:flex;gap:8px;align-items:center">
            <el-select v-model="customer" placeholder="选择客户" style="width:240px">
              <el-option v-for="c in customers" :key="c.id" :label="c.name" :value="c" />
            </el-select>
          </div>
        </div>
      </template>

      <div style="display:flex;gap:16px;align-items:center;margin-bottom:12px">
        <el-input v-model="keyword" placeholder="搜索产品名称" style="width:300px" />
        <el-button @click="addByKeyword">添加</el-button>
      </div>

      <el-table :data="items" stripe>
        <el-table-column label="产品" min-width="240">
          <template #default="{row}">
            <div style="display:flex;gap:12px;align-items:center">
              <img :src="row.imageUrl" style="width:72px;height:54px;object-fit:cover;border-radius:6px" />
              <div>
                <div>{{ row.name }}</div>
                <div style="color:#6b7280;font-size:12px">基础价：¥{{ row.basePrice }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="客户价(¥)" width="200">
          <template #default="{row}">
            <el-input-number v-model="row.finalPrice" :min="0" :step="10" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="{ $index }">
            <el-button size="small" type="danger" @click="removeAt($index)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div style="margin-top:16px;display:flex;gap:12px">
        <el-button type="primary" @click="generate">生成报价单</el-button>
      </div>

      <div v-if="result" style="margin-top:12px">
        <div>专属链接：
          <el-input v-model="result.link" readonly />
        </div>
        <div style="margin-top:12px">
          <qrcode-vue :value="result.link" :size="128" />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useOpsStore } from '@/stores/opsStore'
import QrcodeVue from 'qrcode.vue'

const store = useOpsStore()
const customers = store.customers
const products = computed(() => store.products)
const customer = ref(null)
const keyword = ref('')
const items = ref([]) // {productId,name,imageUrl,basePrice,finalPrice}
const result = ref(null)

const addByKeyword = () => {
  const k = keyword.value.trim()
  if (!k) return
  const found = products.value.filter(p => p.name.includes(k))
  found.forEach(p => {
    if (!items.value.some(it => it.productId === p.id)) {
      items.value.push({ productId:p.id, name:p.name, imageUrl:p.imageUrl, basePrice:p.basePrice, finalPrice:p.basePrice })
    }
  })
}

const removeAt = (idx) => items.value.splice(idx, 1)

const generate = () => {
  if (!customer.value) return
  if (!items.value.length) return
  result.value = store.createQuotation({ customer: customer.value, items: items.value })
}
</script>

<style scoped>
.app-container { padding: 24px; }
</style>


