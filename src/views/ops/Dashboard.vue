<template>
  <div class="app-container">
    <el-row :gutter="12">
      <el-col :span="6"><el-card class="card"><div class="kpi-title">本月成交额</div><div class="kpi-num">¥{{ sales }}</div></el-card></el-col>
      <el-col :span="6"><el-card class="card"><div class="kpi-title">本月成本</div><div class="kpi-num">¥{{ cost }}</div></el-card></el-col>
      <el-col :span="6"><el-card class="card"><div class="kpi-title">本月利润</div><div class="kpi-num">¥{{ profit }}</div></el-card></el-col>
      <el-col :span="6"><el-card class="card"><div class="kpi-title">报价查看</div><div class="kpi-num">{{ viewedCount }}</div></el-card></el-col>
    </el-row>

    <el-card style="margin-top:12px">
      <template #header><span>利润趋势</span></template>
      <canvas ref="chartRef" height="120"></canvas>
    </el-card>

    <el-card style="margin-top:12px">
      <template #header><span>核心产品利润率排行</span></template>
      <el-table :data="ranking" stripe>
        <el-table-column prop="name" label="产品" />
        <el-table-column prop="profitRate" label="利润率" />
      </el-table>
    </el-card>

    <el-card style="margin-top:12px">
      <template #header><span>最近报价单</span></template>
      <el-table :data="recentQuotations" stripe>
        <el-table-column prop="customer.name" label="客户" />
        <el-table-column prop="code" label="编号" />
        <el-table-column label="是否查看">
          <template #default="{row}"><el-tag :type="row.is_viewed?'success':'info'">{{ row.is_viewed?'已查看':'未查看' }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="viewed_at" label="查看时间" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useOpsStore } from '@/stores/opsStore'
import Chart from 'chart.js/auto'

const store = useOpsStore()
// 虚拟统计（可改为接口）
const sales = computed(() => store.analytics.salesThisMonth || 120000)
const cost = computed(() => store.analytics.costThisMonth || 70000)
const profit = computed(() => (store.analytics.profitThisMonth || (sales.value - cost.value)))
const ranking = computed(() => store.analytics.productProfitRanking.length ? store.analytics.productProfitRanking : [
  { name:'明前龙井', profitRate:'45%' }, { name:'金骏眉', profitRate:'38%' }, { name:'铁观音', profitRate:'32%' }
])
const recentQuotations = computed(() => store.quotations.slice(0,10))

const viewedCount = computed(() => store.quotations.filter(q=>q.is_viewed).length)

const chartRef = ref(null)
onMounted(() => {
  const ctx = chartRef.value.getContext('2d')
  new Chart(ctx, {
    type: 'line',
    data: { labels:['1','2','3','4','5','6'], datasets:[{ label:'利润', data:[10,12,9,15,18,20], borderColor:'#16a34a' }] },
    options: { responsive:true, plugins:{ legend:{ display:false } } }
  })
})
</script>

<style scoped>
.app-container{ padding:24px }
.card{ text-align:center }
.kpi-title{ color:#6b7280 }
.kpi-num{ font-size:22px; font-weight:700 }
</style>


