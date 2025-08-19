<template>
  <div class="app-container">
    <!-- KPI 区域 -->
    <el-row :gutter="12">
      <el-col :span="6"><el-card class="card card-modern"><div class="kpi-title">总销售收入</div><div class="kpi-num">¥{{ totalRevenue.toLocaleString() }}</div></el-card></el-col>
      <el-col :span="6"><el-card class="card card-modern"><div class="kpi-title">总成本</div><div class="kpi-num">¥{{ totalCost.toLocaleString() }}</div></el-card></el-col>
      <el-col :span="6"><el-card class="card card-modern"><div class="kpi-title">总利润</div><div class="kpi-num profit">¥{{ totalProfit.toLocaleString() }}</div></el-card></el-col>
      <el-col :span="6"><el-card class="card card-modern"><div class="kpi-title">平均利润率</div><div class="kpi-num">{{ avgMargin }}</div></el-card></el-col>
    </el-row>

    <!-- 利润趋势图 -->
    <el-card class="card-modern" style="margin-top:12px">
      <template #header><span>近半年利润趋势</span></template>
      <canvas ref="chartRef" height="120"></canvas>
    </el-card>

    <!-- 产品利润率排行 -->
    <el-card class="card-modern" style="margin-top:12px">
      <template #header><span>产品利润率排行</span></template>
      <el-table :data="productRanking" stripe>
        <el-table-column prop="productName" label="产品" />
        <el-table-column label="利润率">
          <template #default="{row}">
            <el-tag :type="row.profitMargin >= 0.5 ? 'success' : (row.profitMargin >= 0.3 ? 'warning' : 'danger')">
              {{ (row.profitMargin * 100).toFixed(0) }}%
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 最近报价单 -->
    <el-card class="card-modern" style="margin-top:12px">
      <template #header><span>最近报价单</span></template>
      <el-table :data="recentQuotes" stripe>
        <el-table-column label="报价单ID" prop="id" width="120" />
        <el-table-column label="客户" prop="customerName" />
        <el-table-column label="创建时间" prop="createdAt" />
        <el-table-column label="总金额">
          <template #default="{row}">¥{{ row.total.toFixed(2) }}</template>
        </el-table-column>
        <el-table-column label="状态" width="120">
          <template #default="{row}"><el-tag :type="row.isViewed ? 'success' : 'info'">{{ row.isViewed ? '已查看' : '未查看' }}</el-tag></template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
  
</template>

<script>
export default { name: 'OpsDashboardView' }
</script>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useOpsStore } from '@/stores/opsStore'
import Chart from 'chart.js/auto'

const store = useOpsStore()
const dataReady = ref(false)
const totalRevenue = computed(() => store.dashboardData.totalRevenue || 0)
const totalCost = computed(() => store.dashboardData.totalCost || 0)
const totalProfit = computed(() => Math.max(0, totalRevenue.value - totalCost.value))
const avgMargin = computed(() => totalRevenue.value > 0 ? `${Math.round((totalProfit.value/totalRevenue.value)*100)}%` : '0%')

const productRanking = computed(() => store.dashboardData.productRanking || [])
const recentQuotes = computed(() => (store.dashboardData.recentQuotations || []).map(q => ({
  id: q.id,
  customerName: (store.customerById && store.customerById(q.customerId)?.name) || q.customerId,
  createdAt: q.createdAt?.replace('T',' ').slice(0,16),
  total: (q.items || []).reduce((s,it)=> s + it.quantity*it.unitPrice, 0),
  isViewed: !!q.isViewed
})))

const chartRef = ref(null)

onMounted(async () => {
  await store.fetchDashboardData()
  dataReady.value = true
  const ctx = chartRef.value.getContext('2d')
  const labels = (store.dashboardData.profitTrend || []).map(i => i.month)
  const values = (store.dashboardData.profitTrend || []).map(i => i.profit)
  new Chart(ctx, {
    type: 'line',
    data: { labels, datasets:[{ label:'利润', data: values, borderColor:'var(--app-accent)', borderWidth:2, tension:0.35, pointRadius:0 }] },
    options: {
      responsive:true,
      plugins:{ legend:{ display:false } },
      scales:{
        x:{ grid:{ color:'rgba(0,0,0,0.05)' } },
        y:{ grid:{ color:'rgba(0,0,0,0.05)' } }
      },
      animation:{ duration: 280, easing: 'easeOutCubic' }
    }
  })
})
</script>

<style scoped>
.app-container{ padding:24px }
.card{ text-align:center }
.kpi-title{ color:#6b7280 }
.kpi-num{ font-size:22px; font-weight:700 }
.kpi-num.profit{ color:#16a34a }
</style>


