import { defineStore } from 'pinia'

let _pid = 1000
let _cid = 2000
let _qid = 3000

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const code = () => `QUO-${Math.random().toString(36).slice(2, 8).toUpperCase()}`

export const useOpsStore = defineStore('opsStore', {
  state: () => ({
    // 产品列表
    products: [
      {
        id: _pid++,
        name: '明前特级龙井',
        description: '明前头采，手工炒制，嫩香持久。',
        basePrice: 1280,
        costPrice: 720,
        imageUrl: 'https://picsum.photos/seed/longjing/200',
        origin: '浙江·杭州西湖',
        harvestTime: '2025-03-25'
      },
      {
        id: _pid++,
        name: '金骏眉',
        description: '金骏眉小种红茶，蜜香甜润。',
        basePrice: 980,
        costPrice: 520,
        imageUrl: 'https://picsum.photos/seed/jjm/200',
        origin: '福建·武夷山',
        harvestTime: '2025-04-10'
      }
    ],
    // 客户
    customers: [
      { id: _cid++, name: 'XX茶叶贸易公司', contact: '188****2233', note: '偏好龙井' },
      { id: _cid++, name: '杭州禅茶会馆', contact: 'WeChat: hzc_tea', note: '走高端礼盒' },
      { id: _cid++, name: '泉州供销社', contact: '0595-****8899', note: '' }
    ],
    // 报价单
    quotations: [
      {
        id: _qid++,
        uniqueCode: code(),
        customerId: 2000,
        items: [ { productId: 1000, quantity: 5, unitPrice: 1280 } ],
        createdAt: new Date().toISOString(),
        isViewed: false
      }
    ],
    // 仪表盘数据
    dashboardData: {
      totalRevenue: 0,
      totalCost: 0,
      profitTrend: [],
      productRanking: [],
      recentQuotations: []
    }
  }),
  getters: {
    allProducts: (state) => state.products,
    allCustomers: (state) => state.customers,
    productById: (state) => (id) => state.products.find(p => p.id === id),
    customerById: (state) => (id) => state.customers.find(c => c.id === id),
    // 兼容旧仪表盘页面的字段命名
    analytics: (state) => ({
      salesThisMonth: state.dashboardData.totalRevenue,
      costThisMonth: state.dashboardData.totalCost,
      profitThisMonth: state.dashboardData.totalRevenue - state.dashboardData.totalCost,
      productProfitRanking: state.dashboardData.productRanking.map(r => ({ name: r.productName, profitRate: r.profitMargin }))
    })
  },
  actions: {
    // 产品 CRUD
    addProduct(productData) {
      const p = {
        id: _pid++,
        name: productData.name,
        description: productData.description || '',
        basePrice: Number(productData.basePrice) || 0,
        costPrice: Number(productData.costPrice) || 0,
        imageUrl: productData.imageUrl || 'https://picsum.photos/200',
        origin: productData.origin || '未知产地',
        harvestTime: productData.harvestTime || new Date().toISOString().slice(0,10)
      }
      this.products.unshift(p)
      return p
    },
    updateProduct(id, productData) {
      const idx = this.products.findIndex(p => p.id === id)
      if (idx === -1) return false
      this.products[idx] = { ...this.products[idx], ...productData }
      return true
    },
    deleteProduct(id) {
      const idx = this.products.findIndex(p => p.id === id)
      if (idx !== -1) this.products.splice(idx, 1)
    },

    // 客户
    addCustomer(customerData) {
      const c = {
        id: _cid++,
        name: customerData.name,
        contact: customerData.contact || '',
        note: customerData.note || ''
      }
      this.customers.unshift(c)
      return c
    },

    // 报价
    createQuotation(quotationData) {
      const q = {
        id: _qid++,
        uniqueCode: code(),
        customerId: quotationData.customerId,
        items: (quotationData.items || []).map(it => ({
          productId: it.productId,
          quantity: Number(it.quantity || 1),
          unitPrice: Number(it.unitPrice || 0)
        })),
        // 结算与条款
        discountPercent: Number(quotationData.discountPercent || 0),
        taxRate: Number(quotationData.taxRate || 0),
        shippingFee: Number(quotationData.shippingFee || 0),
        validUntil: quotationData.validUntil || '',
        paymentTerms: quotationData.paymentTerms || '',
        notes: quotationData.notes || '',
        // 金额字段（可由前端传入或在此处计算）
        subtotal: Number(quotationData.subtotal || 0),
        discountAmount: Number(quotationData.discountAmount || 0),
        taxAmount: Number(quotationData.taxAmount || 0),
        grandTotal: Number(quotationData.grandTotal || (quotationData.items || []).reduce((s, it) => s + (Number(it.quantity||0) * Number(it.unitPrice||0)), 0)),
        createdAt: new Date().toISOString(),
        isViewed: false
      }
      this.quotations.unshift(q)
      // 兼容旧页面返回链接
      return { ...q, link: `${location.origin}/api/quotations/${q.uniqueCode}` }
    },
    findQuotationByCode(codeStr) {
      return this.quotations.find(x => x.uniqueCode === codeStr)
    },
    markQuotationAsViewed(uniqueCode) {
      const q = this.quotations.find(x => x.uniqueCode === uniqueCode)
      if (q) q.isViewed = true
    },

    // 仪表盘：基于现有数据简单计算
    async fetchDashboardData() {
      const revenue = this.quotations.reduce((sum, q) => sum + q.items.reduce((s, it) => s + it.quantity * it.unitPrice, 0), 0)
      const cost = this.quotations.reduce((sum, q) => sum + q.items.reduce((s, it) => {
        const p = this.products.find(x => x.id === it.productId)
        return s + it.quantity * (p?.costPrice || 0)
      }, 0), 0)
      const months = Array.from({ length: 6 }).map((_, i) => {
        const d = new Date(); d.setMonth(d.getMonth() - (5 - i))
        const label = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`
        return { month: label, profit: rand(10, 20) * 1000 }
      })
      // 利润率排行（基于基础价与成本）
      const ranking = this.products.map(p => ({
        productId: p.id,
        productName: p.name,
        profitMargin: p.basePrice > 0 ? Number(((p.basePrice - p.costPrice) / p.basePrice).toFixed(2)) : 0
      })).sort((a,b)=>b.profitMargin-a.profitMargin).slice(0,10)
      const recents = this.quotations.slice(0,5)

      this.dashboardData = {
        totalRevenue: revenue,
        totalCost: cost,
        profitTrend: months,
        productRanking: ranking,
        recentQuotations: recents
      }
      return Promise.resolve(this.dashboardData)
    },

    // 兼容旧页面的“生成溯源页”能力（非必需）
    generateTrace(productId) {
      return `${location.origin}/trace/${productId}`
    }
  }
})


