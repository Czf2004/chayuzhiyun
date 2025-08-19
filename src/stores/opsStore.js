import { defineStore } from 'pinia'

function uid(prefix = '') {
  return `${prefix}${Math.random().toString(16).slice(2, 10)}`
}

export const useOpsStore = defineStore('opsStore', {
  state: () => ({
    products: [], // {id,name,desc,basePrice,year,region,story,imageUrl,traceUrl}
    customers: [
      { id: 'c_001', name: '客户A(186****1234)' },
      { id: 'c_002', name: '客户B(WeChat: tea_buyer)' },
      { id: 'c_003', name: '客户C(189****5566)' }
    ],
    quotations: [], // {code, customer, items:[{productId,name,basePrice,finalPrice}], is_viewed, viewed_at}
    analytics: {
      salesThisMonth: 0,
      costThisMonth: 0,
      profitThisMonth: 0,
      productProfitRanking: [] // [{name, profitRate}]
    }
  }),
  actions: {
    addProduct(payload) {
      const id = uid('P_')
      const product = {
        id,
        name: payload.name,
        desc: payload.desc || '',
        basePrice: Number(payload.basePrice) || 0,
        year: payload.year || new Date().getFullYear(),
        region: payload.region || '未知产区',
        story: payload.story || '',
        imageUrl: payload.imageUrl || '',
        traceUrl: ''
      }
      this.products.unshift(product)
      return product
    },
    generateTrace(productId) {
      const p = this.products.find(x => x.id === productId)
      if (!p) throw new Error('产品不存在')
      p.traceUrl = `${location.origin}/trace/${productId}`
      return p.traceUrl
    },
    createQuotation({ customer, items }) {
      const code = uid('Q_')
      const normalized = items.map(it => ({
        productId: it.productId,
        name: it.name,
        basePrice: Number(it.basePrice) || 0,
        finalPrice: Number(it.finalPrice) || 0
      }))
      const quotation = {
        code,
        customer,
        items: normalized,
        is_viewed: false,
        viewed_at: null,
        link: `${location.origin}/api/quotations/${code}`
      }
      this.quotations.unshift(quotation)
      return quotation
    },
    markQuotationViewed(code) {
      const q = this.quotations.find(x => x.code === code)
      if (q) {
        q.is_viewed = true
        q.viewed_at = new Date().toISOString()
      }
    },
    updateAnalytics({ sales, cost, ranking }) {
      this.analytics.salesThisMonth = Number(sales) || 0
      this.analytics.costThisMonth = Number(cost) || 0
      this.analytics.profitThisMonth = this.analytics.salesThisMonth - this.analytics.costThisMonth
      this.analytics.productProfitRanking = Array.isArray(ranking) ? ranking : []
    }
  }
})


