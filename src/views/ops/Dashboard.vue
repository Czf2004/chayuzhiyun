<template>
  <div class="app-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">运营总览</h1>
      <p class="page-subtitle">实时监控关键业务指标与趋势</p>
    </div>

    <!-- KPI 区域 -->
    <el-row :gutter="24" class="kpi-row">
      <el-col :span="6" :xs="12">
        <el-card class="kpi-card" hoverable>
          <div class="kpi-card__header">
            <div class="kpi-title">总销售收入</div>
            <el-icon class="kpi-icon"><TrendingUp /></el-icon>
          </div>
          <div class="kpi-card__value">¥{{ totalRevenue.toLocaleString() }}</div>
          <div class="kpi-card__trend" :class="revenueTrendClass">
            <el-icon :size="14"><ArrowUp /></el-icon>
            <span>{{ revenueTrend }} 环比上月</span>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6" :xs="12">
        <el-card class="kpi-card" hoverable>
          <div class="kpi-card__header">
            <div class="kpi-title">总成本</div>
            <el-icon class="kpi-icon"><TrendingDown /></el-icon>
          </div>
          <div class="kpi-card__value">¥{{ totalCost.toLocaleString() }}</div>
          <div class="kpi-card__trend" :class="costTrendClass">
            <el-icon :size="14"><ArrowUp /></el-icon>
            <span>{{ costTrend }} 环比上月</span>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6" :xs="12">
        <el-card class="kpi-card" hoverable>
          <div class="kpi-card__header">
            <div class="kpi-title">总利润</div>
            <el-icon class="kpi-icon"><Dollar /></el-icon>
          </div>
          <div class="kpi-card__value profit">¥{{ totalProfit.toLocaleString() }}</div>
          <div class="kpi-card__trend" :class="profitTrendClass">
            <el-icon :size="14"><ArrowUp /></el-icon>
            <span>{{ profitTrend }} 环比上月</span>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6" :xs="12">
        <el-card class="kpi-card" hoverable>
          <div class="kpi-card__header">
            <div class="kpi-title">平均利润率</div>
            <el-icon class="kpi-icon"><Percentage /></el-icon>
          </div>
          <div class="kpi-card__value">{{ avgMargin }}</div>
          <div class="kpi-card__trend" :class="marginTrendClass">
            <el-icon :size="14"><ArrowUp /></el-icon>
            <span>{{ marginTrend }} 环比上月</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表与表格区域 -->
    <el-row :gutter="24" class="content-row">
      <!-- 利润趋势图 -->
      <el-col :span="14" :xs="24">
        <el-card class="content-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">近半年利润趋势</span>
              <el-select 
                v-model="chartTimeRange" 
                size="small" 
                class="range-select"
                @change="handleTimeRangeChange"
              >
                <el-option label="近3个月" value="3" />
                <el-option label="近6个月" value="6" />
                <el-option label="近12个月" value="12" />
              </el-select>
            </div>
          </template>
          <div class="chart-container">
            <canvas ref="chartRef" height="280"></canvas>
          </div>
        </el-card>
      </el-col>

      <!-- 产品利润率排行 -->
      <el-col :span="10" :xs="24">
        <el-card class="content-card">
          <template #header>
            <span class="card-title">产品利润率排行</span>
          </template>
          <div class="ranking-container">
            <el-table 
              :data="productRanking" 
              border
              :show-header="false"
              class="ranking-table"
            >
              <el-table-column 
                prop="productName" 
                label="产品" 
                width="160"
                align="left"
              >
                <template #default="{row, $index}">
                  <div class="product-item">
                    <div class="product-rank">{{ $index + 1 }}</div>
                    <div class="product-name">{{ row.productName }}</div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="利润率" align="right">
                <template #default="{row}">
                  <div class="progress-container">
                    <div 
                      class="progress-bar" 
                      :style="{ 
                        width: `${row.profitMargin * 100}%`,
                        backgroundColor: getProgressColor(row.profitMargin)
                      }"
                    ></div>
                    <span class="progress-label">
                      {{ (row.profitMargin * 100).toFixed(0) }}%
                    </span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 最近报价单 -->
    <el-row class="content-row">
      <el-col :span="24">
        <el-card class="content-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">最近报价单</span>
              <el-button 
                type="text" 
                class="view-all-btn"
                size="small"
              >
                查看全部 <el-icon :size="14"><ArrowRight /></el-icon>
              </el-button>
            </div>
          </template>
          <el-table 
            :data="recentQuotes" 
            border
            class="quotes-table"
            highlight-current-row
          >
            <el-table-column 
              label="报价单ID" 
              prop="id" 
              width="120" 
              align="center"
            />
            <el-table-column 
              label="客户" 
              prop="customerName" 
              width="200"
            />
            <el-table-column 
              label="创建时间" 
              prop="createdAt" 
              width="180"
            />
            <el-table-column 
              label="总金额" 
              align="right"
            >
              <template #default="{row}">¥{{ row.total.toFixed(2) }}</template>
            </el-table-column>
            <el-table-column 
              label="状态" 
              width="120"
              align="center"
            >
              <template #default="{row}">
                <el-tag 
                  :type="row.isViewed ? 'success' : 'info'"
                  effect="light"
                >
                  {{ row.isViewed ? '已查看' : '未查看' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column 
              label="操作" 
              width="120"
              align="center"
            >
              <template #default>
                <el-button 
                  type="text" 
                  size="small"
                  class="action-btn"
                >
                  详情
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { TrendingUp, TrendingDown, Dollar, Percentage, ArrowUp, ArrowRight } from '@element-plus/icons-vue'
export default { 
  name: 'OpsDashboardView',
  components: { TrendingUp, TrendingDown, Dollar, Percentage, ArrowUp, ArrowRight }
}
</script>

<script setup>
import { onMounted, onUnmounted, ref, computed, watch } from 'vue'
import { useOpsStore } from '@/stores/opsStore'
import Chart from 'chart.js/auto'

const store = useOpsStore()
const chartRef = ref(null)
let chartInstance = null
const chartTimeRange = ref('6')

// 模拟趋势数据（实际项目中可从接口获取）
const revenueTrend = ref('+5.2%')
const costTrend = ref('+2.1%')
const profitTrend = ref('+8.7%')
const marginTrend = ref('+1.3%')

// 计算趋势样式
const revenueTrendClass = computed(() => revenueTrend.value.startsWith('+') ? 'trend-up' : 'trend-down')
const costTrendClass = computed(() => costTrend.value.startsWith('+') ? 'trend-up' : 'trend-down')
const profitTrendClass = computed(() => profitTrend.value.startsWith('+') ? 'trend-up' : 'trend-down')
const marginTrendClass = computed(() => marginTrend.value.startsWith('+') ? 'trend-up' : 'trend-down')

// 核心数据计算
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

// 根据利润率获取进度条颜色
const getProgressColor = (margin) => {
  if (margin >= 0.5) return 'var(--el-color-success)'
  if (margin >= 0.3) return 'var(--el-color-warning)'
  return 'var(--el-color-danger)'
}

// 处理时间范围变更
const handleTimeRangeChange = () => {
  store.fetchDashboardData(chartTimeRange.value).then(() => {
    updateChart()
  })
}

// 更新图表数据
const updateChart = () => {
  const labels = (store.dashboardData.profitTrend || []).map(i => i.month)
  const values = (store.dashboardData.profitTrend || []).map(i => i.profit)
  
  if (chartInstance) {
    chartInstance.data.labels = labels
    chartInstance.data.datasets[0].data = values
    chartInstance.update()
    return
  }

  const canvas = chartRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  chartInstance = new Chart(ctx, {
    type: 'line',
    data: { 
      labels, 
      datasets: [{ 
        label: '利润', 
        data: values, 
        borderColor: '#16a34a',
        backgroundColor: 'rgba(22, 163, 74, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#16a34a',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }] 
    },
    options: { 
      responsive: true,
      maintainAspectRatio: false,
      parsing: false,
      // 显式指定事件，避免 undefined.includes 异常
      events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove', 'touchend'],
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          titleColor: '#1f2937',
          bodyColor: '#4b5563',
          borderColor: 'rgba(229, 231, 235, 0.8)',
          borderWidth: 1,
          padding: 12,
          boxPadding: 6,
          usePointStyle: true,
          callbacks: {
            label: function(context) {
              return `利润: ¥${context.raw.toLocaleString()}`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#9ca3af' }
        },
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(229, 231, 235, 0.6)' },
          ticks: { 
            color: '#9ca3af',
            callback: function(value) {
              return '¥' + value.toLocaleString();
            }
          }
        }
      },
      animation: {
        duration: 1000,
        easing: 'easeOutQuart'
      }
    }
  })
}

onMounted(async () => {
  await store.fetchDashboardData(chartTimeRange.value)
  updateChart()
})

// 监听数据变化更新图表
watch(() => store.dashboardData.profitTrend, () => {
  updateChart()
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
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

/* KPI 区域 */
.kpi-row {
  margin-bottom: 24px;
}

.kpi-card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  transition: all 0.2s ease;
  overflow: hidden;
  background: linear-gradient(145deg, #ffffff, #f5f7fa);
}

.kpi-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04);
}

.kpi-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.kpi-title {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.kpi-icon {
  color: #9ca3af;
  width: 20px;
  height: 20px;
}

.kpi-card__value {
  font-size: 28px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 8px;
  line-height: 1.2;
}

.kpi-card__value.profit {
  color: #16a34a;
}

.kpi-card__trend {
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.trend-up {
  color: #16a34a;
}

.trend-down {
  color: #dc2626;
}

/* 内容区域 */
.content-row {
  margin-bottom: 24px;
}

.content-card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  background-color: #fff;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

/* 图表容器 */
.chart-container {
  width: 100%;
  height: 100%;
  padding-top: 8px;
}

.range-select {
  width: 120px;
}

/* 排行榜样式 */
.ranking-container {
  padding: 8px 0;
}

.ranking-table {
  border: none;
}

.ranking-table th,
.ranking-table td {
  border: none !important;
  padding: 12px 16px;
}

.product-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.product-rank {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #f3f4f6;
  color: #6b7280;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.product-name {
  font-size: 14px;
  color: #374151;
}

.progress-container {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.progress-bar {
  height: 6px;
  border-radius: 3px;
  flex-grow: 1;
  transition: width 1s ease-out;
}

.progress-label {
  font-size: 14px;
  font-weight: 500;
  min-width: 40px;
  text-align: right;
}

/* 报价单表格 */
.quotes-table {
  border-top: 1px solid #f3f4f6;
}

.quotes-table th {
  background-color: #f9fafb;
  font-weight: 600;
  color: #6b7280;
  font-size: 13px;
}

.quotes-table th,
.quotes-table td {
  padding: 14px 16px;
  border-color: #f3f4f6;
}

.quotes-table .el-table__row:hover > td {
  background-color: #f9fafb;
}

.view-all-btn {
  color: #3b82f6;
  padding: 0;
  height: auto;
  display: flex;
  align-items: center;
  gap: 4px;
}

.action-btn {
  color: #3b82f6;
  padding: 0;
  height: auto;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .app-container {
    padding: 16px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .kpi-card__value {
    font-size: 24px;
  }
  
  .content-row {
    margin-bottom: 16px;
  }
}
</style>