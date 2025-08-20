<template>
  <div class="quote-page">
    <div class="quote-paper" ref="paperRef">
      <header class="q-header">
        <div class="brand">
          <div class="brand-mark">茶智云</div>
          <div class="brand-sub">QUOTE</div>
        </div>
        <div class="q-meta">
          <div><span class="label">报价单号：</span>{{ quote?.uniqueCode }}</div>
          <div><span class="label">创建时间：</span>{{ formatDate(quote?.createdAt) }}</div>
          <div v-if="quote?.validUntil"><span class="label">有效期：</span>{{ formatDate(quote?.validUntil) }}</div>
        </div>
      </header>

      <section class="q-customer">
        <div><span class="label">客户：</span>{{ customerName }}</div>
        <div v-if="customer?.contact"><span class="label">联系方式：</span>{{ customer?.contact }}</div>
      </section>

      <section class="q-items">
        <table>
          <thead>
            <tr>
              <th>产品</th>
              <th>单价(¥)</th>
              <th>数量</th>
              <th>小计(¥)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in viewItems" :key="row.productId">
              <td>
                <div class="p-name">{{ row.name }}</div>
                <div class="p-origin" v-if="row.origin">{{ row.origin }}</div>
              </td>
              <td class="num">{{ row.unitPrice.toFixed(2) }}</td>
              <td class="num">{{ row.quantity }}</td>
              <td class="num">{{ (row.quantity * row.unitPrice).toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section class="q-summary">
        <div class="line"><span>小计</span><b>¥{{ subtotal.toFixed(2) }}</b></div>
        <div class="line" v-if="quote?.discountPercent && quote.discountPercent>0"><span>折扣 ({{ quote.discountPercent }}%)</span><b>-¥{{ discountAmount.toFixed(2) }}</b></div>
        <div class="line" v-if="quote?.taxRate && quote.taxRate>0"><span>税费 ({{ quote.taxRate }}%)</span><b>¥{{ taxAmount.toFixed(2) }}</b></div>
        <div class="line" v-if="quote?.shippingFee && quote.shippingFee>0"><span>运费</span><b>¥{{ Number(quote.shippingFee).toFixed(2) }}</b></div>
        <div class="total"><span>总计</span><b>¥{{ grandTotal.toFixed(2) }}</b></div>
      </section>

      <section class="q-terms" v-if="quote?.paymentTerms || quote?.notes">
        <div v-if="quote?.paymentTerms"><span class="label">付款条款：</span>{{ quote.paymentTerms }}</div>
        <div v-if="quote?.notes"><span class="label">备注：</span>{{ quote.notes }}</div>
      </section>

      <footer class="q-footer">
        <div class="qr">
          <qrcode-vue :value="shareUrl" :size="112" />
          <div class="qr-tip">扫码在线查看</div>
        </div>
        <div class="ops">
          <button class="btn" @click="printPage">打印/保存为PDF</button>
          <button class="btn" @click="goBack">返回</button>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOpsStore } from '@/stores/opsStore'
import QrcodeVue from 'qrcode.vue'

const route = useRoute()
const router = useRouter()
const store = useOpsStore()
const paperRef = ref(null)

const code = computed(() => route.params.code)
const quote = computed(() => store.findQuotationByCode(code.value))
const customer = computed(() => quote.value ? store.customerById(quote.value.customerId) : null)
const customerName = computed(() => customer.value?.name || quote.value?.customerId || '-')
const shareUrl = computed(() => location.href)

const viewItems = computed(() => {
  if (!quote.value) return []
  return (quote.value.items || []).map(it => {
    const p = store.productById(it.productId)
    return {
      productId: it.productId,
      name: p?.name || it.productId,
      origin: p?.origin,
      unitPrice: Number(it.unitPrice || 0),
      quantity: Number(it.quantity || 0)
    }
  })
})

const subtotal = computed(() => Number(quote.value?.subtotal || viewItems.value.reduce((s, r) => s + r.quantity * r.unitPrice, 0)))
const discountAmount = computed(() => Number(quote.value?.discountAmount || subtotal.value * (Number(quote.value?.discountPercent || 0) / 100)))
const taxable = computed(() => Math.max(subtotal.value - discountAmount.value, 0))
const taxAmount = computed(() => Number(quote.value?.taxAmount || taxable.value * (Number(quote.value?.taxRate || 0) / 100)))
const grandTotal = computed(() => Number(quote.value?.grandTotal || (taxable.value + taxAmount.value + Number(quote.value?.shippingFee || 0))))

function formatDate(d) {
  if (!d) return '-'
  const dt = typeof d === 'string' ? new Date(d) : d
  return `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`
}

function printPage() {
  window.print()
}

function goBack() {
  router.push('/ops/quotations')
}

onMounted(() => {
  if (route.query.print === '1') {
    setTimeout(() => window.print(), 300)
  }
})
</script>

<style scoped>
.quote-page { background: #f3f4f6; padding: 24px; min-height: 100vh; }
.quote-paper { width: 900px; margin: 0 auto; background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px 28px; box-shadow: 0 10px 30px rgba(0,0,0,.06); }
.q-header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 16px; border-bottom: 2px solid #111827; }
.brand { display: flex; align-items: baseline; gap: 12px; }
.brand-mark { font-size: 22px; font-weight: 800; color: #111827; letter-spacing: .5px; }
.brand-sub { font-size: 12px; color: #6b7280; border: 1px solid #e5e7eb; padding: 2px 6px; border-radius: 6px; }
.q-meta { text-align: right; color: #374151; font-size: 14px; }
.label { color: #6b7280; }
.q-customer { padding: 16px 0; color: #374151; }

.q-items table { width: 100%; border-collapse: collapse; }
.q-items thead th { text-align: left; background: #f9fafb; color: #6b7280; padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600; }
.q-items tbody td { padding: 12px; border-bottom: 1px solid #f3f4f6; }
.q-items .p-name { font-weight: 600; color: #111827; }
.q-items .p-origin { color: #6b7280; font-size: 12px; margin-top: 2px; }
.q-items .num { text-align: right; }

.q-summary { width: 320px; margin-left: auto; margin-top: 16px; }
.q-summary .line { display: flex; justify-content: space-between; align-items: center; padding: 6px 0; color: #374151; }
.q-summary .total { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-top: 2px dashed #e5e7eb; margin-top: 6px; font-size: 18px; font-weight: 700; color: #111827; }

.q-terms { margin-top: 16px; color: #374151; }
.q-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 20px; }
.qr { text-align: center; }
.qr-tip { font-size: 12px; color: #6b7280; margin-top: 6px; }
.ops { display: flex; gap: 12px; }
.btn { border: 1px solid #e5e7eb; background: #fff; padding: 8px 12px; border-radius: 8px; cursor: pointer; }

@media print {
  .quote-page { padding: 0; background: #fff; }
  .ops { display: none; }
  .quote-paper { width: auto; margin: 0; border: none; box-shadow: none; border-radius: 0; }
}
</style>

<style>
@media print {
  @page { size: A4; margin: 12mm; }
  html, body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}
</style>


