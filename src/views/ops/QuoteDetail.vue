<template>
  <div class="whitepaper">
    <!-- 顶部固定导航（章节锚点） -->
    <nav class="wp-nav no-print">
      <div class="brand-mini">
        <span class="mark">茶智云</span>
        <span class="sub">TEA INTELLIGENCE CLOUD</span>
      </div>
      <ul>
        <li v-for="s in sections" :key="s.id">
          <button :class="['navlink', { active: currentSection===s.id }]" @click="goSection(s.id)">{{ s.title }}</button>
        </li>
      </ul>
      <div class="nav-actions">
        <button class="btn" @click="printPage"><i class="fa-solid fa-print"></i> 打印/保存 PDF</button>
      </div>
    </nav>

    <!-- 纸张容器（多页） -->
    <div class="wp-container" :class="{ turning: isTurning }" ref="paperRef">
      <!-- 封面页 -->
      <section id="cover" class="wp-page cover">
        <div class="cover-bg"></div>
        <div class="cover-content">
          <div class="cover-brand">
            <div class="logo">茶智云</div>
            <div class="badge">WHITEPAPER</div>
          </div>
          <h1 class="cover-title">产品报价单</h1>
          <div class="cover-sub">TEA INTELLIGENCE CLOUD QUOTATION</div>
          <div class="cover-illo">
            <img class="illo-main" src="https://images.unsplash.com/photo-1518675219903-c682c94d87ae?q=80&w=1600&auto=format&fit=crop" alt="远山茶园"/>
            <img class="illo-leaf" src="https://images.unsplash.com/photo-1567417602464-6fa4bf3a5015?q=80&w=1200&auto=format&fit=crop" alt="茶叶特写"/>
          </div>
          <div class="cover-meta">
            <span>茶智云 · TEA INTELLIGENCE CLOUD</span>
            <span>{{ formatDate(new Date()) }}</span>
          </div>
        </div>
        <div class="page-num">第 1 页 / 共 {{ totalPages }}</div>
      </section>

      <!-- 目录页 -->
      <section id="toc" class="wp-page toc">
        <h2 class="wp-h2">目录</h2>
        <ol class="toc-list">
          <li><span>1</span> 报价信息</li>
          <li><span>2</span> 产品详情</li>
          <li><span>3</span> 价格明细</li>
          <li><span>4</span> 服务说明</li>
          <li><span>5</span> 付款条款</li>
          <li><span>6</span> 企业文化</li>
          <li><span>7</span> 茶叶文化</li>
          <li><span>8</span> 生态种植</li>
          <li><span>9</span> 封底</li>
        </ol>
        <div class="toc-aside"></div>
        <div class="page-num">第 2 页 / 共 {{ totalPages }}</div>
      </section>

      <!-- 报价信息与明细 -->
      <section id="quote" class="wp-page quote">
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
          <div class="total gold"><span>总计</span><b>¥{{ grandTotal.toFixed(2) }}</b></div>
        </section>

        <div class="page-num">第 3 页 / 共 {{ totalPages }}</div>
      </section>

      <!-- 产品详情页 -->
      <section id="product" class="wp-page product">
        <h2 class="wp-h2">产品详情 · 明前特级龙井</h2>
        <div class="product-grid">
          <figure class="p-figure">
            <img class="p-img" :src="longjingImg" alt="明前特级龙井" />
            <figcaption>干茶特写 · 嫩绿扁平、形如雀舌</figcaption>
          </figure>
          <figure class="p-figure">
            <img class="p-img" src="https://images.unsplash.com/photo-1537746208474-77b0b0fbb8d0?q=80&w=1400&auto=format&fit=crop" alt="西湖茶园" />
            <figcaption>杭州西湖 · 云雾缭绕，昼夜温差大</figcaption>
          </figure>
          <figure class="p-figure">
            <img class="p-img" src="https://images.unsplash.com/photo-1512011213917-1c3e4b4b4a3a?q=80&w=1400&auto=format&fit=crop" alt="冲泡意境" />
            <figcaption>冲泡意境 · 杯中碧翠，清香高扬</figcaption>
          </figure>
        </div>
        <ul class="p-desc">
          <li><i class="fa-solid fa-leaf"></i> 采摘标准：明前单芽或一芽一叶初展，鲜嫩匀齐</li>
          <li><i class="fa-solid fa-mountain"></i> 产地环境：西湖群山环抱、酸性黄壤，富含有机质</li>
          <li><i class="fa-solid fa-wind"></i> 工艺特点：杀青及时、手工理条、文火烘焙，扁平挺直</li>
          <li><i class="fa-solid fa-mug-saucer"></i> 品饮口感：栗香清雅、鲜爽甘醇、回甘悠长</li>
        </ul>
        <div class="page-num">第 4 页 / 共 {{ totalPages }}</div>
      </section>

      <!-- 服务说明 / 付款条款页 -->
      <section id="service" class="wp-page service">
        <h2 class="wp-h2">服务说明</h2>
        <div class="service-cards">
          <div class="card">
            <div class="card-icn"><i class="fa-solid fa-headset"></i></div>
            <div class="card-ttl">售后支持</div>
            <div class="card-txt">7×12 小时响应；提供品控复检、仓储调拨、售后咨询。</div>
          </div>
          <div class="card">
            <div class="card-icn"><i class="fa-solid fa-handshake-angle"></i></div>
            <div class="card-ttl">技术对接</div>
            <div class="card-txt">电商/渠道系统价格同步、标签码溯源、数据联动与对账。</div>
          </div>
          <div class="card">
            <div class="card-icn"><i class="fa-solid fa-shield"></i></div>
            <div class="card-ttl">合规保障</div>
            <div class="card-txt">合同、发票、质检证明齐备；产地证与检验报告可溯源。</div>
          </div>
        </div>
        <h2 class="wp-h2 mt">付款条款</h2>
        <div class="terms-box">
          <p v-if="quote?.paymentTerms">{{ quote.paymentTerms }}</p>
          <p v-else>默认：30 天内付款，支持对公转账，分期与授信可洽谈。</p>
          <p v-if="quote?.notes" class="muted">备注：{{ quote.notes }}</p>
        </div>
        <div class="page-num">第 5 页 / 共 {{ totalPages }}</div>
      </section>

      <!-- 企业文化 -->
      <section id="culture" class="wp-page culture">
        <h2 class="wp-h2">企业文化</h2>
        <p>茶智云以“以数据与工艺，成就一杯好茶”为使命，秉承诚信、品质、共生的价值观，持续投入数字化与茶产业的深度融合。</p>
        <ul class="p-desc">
          <li><i class="fa-solid fa-seedling"></i> 可持续发展：坚持生态优先，推进绿色供应链与节能减排。</li>
          <li><i class="fa-solid fa-people-group"></i> 客户成功：与客户共同定义目标，长期陪伴式服务。</li>
          <li><i class="fa-solid fa-diagram-project"></i> 技术创新：以数据中台、AI 能力驱动品控与运营提升。</li>
        </ul>
        <div class="page-num">第 6 页 / 共 {{ totalPages }}</div>
      </section>

      <!-- 茶叶文化 -->
      <section id="tea-culture" class="wp-page tea-culture">
        <h2 class="wp-h2">茶叶文化</h2>
        <p>中国茶文化源远流长，以和、敬、清、寂为精神内涵，讲究品、赏、悟。我们在设计产品与服务时，将“雅致、节制、平衡”的东方美学融入全流程。</p>
        <div class="product-grid">
          <figure class="p-figure">
            <img class="p-img" src="https://images.unsplash.com/photo-1542736667-069246bdbc62?q=80&w=1400&auto=format&fit=crop" alt="茶器之美" />
            <figcaption>茶器之美 · 器随茶行，恰到好处</figcaption>
          </figure>
          <figure class="p-figure">
            <img class="p-img" src="https://images.unsplash.com/photo-1542996966-2e31c00bae80?q=80&w=1400&auto=format&fit=crop" alt="茶席之道" />
            <figcaption>茶席之道 · 起承转合，张弛有度</figcaption>
          </figure>
          <figure class="p-figure">
            <img class="p-img" src="https://images.unsplash.com/photo-1566125882515-d58f6f1f3e4c?q=80&w=1400&auto=format&fit=crop" alt="茶与四时" />
            <figcaption>茶与四时 · 顺时而饮，天地同频</figcaption>
          </figure>
        </div>
        <div class="page-num">第 7 页 / 共 {{ totalPages }}</div>
      </section>

      <!-- 生态种植 -->
      <section id="eco" class="wp-page eco">
        <h2 class="wp-h2">生态种植</h2>
        <p>推行“少干预、重土壤、护生物多样性”的生态种植理念，通过物联网监测、精准施策与自然农法结合，让茶园恢复生命力。</p>
        <ul class="p-desc">
          <li><i class="fa-solid fa-earth-asia"></i> 生物多样性：保留林间草木，建设鸟类与昆虫友好型茶园。</li>
          <li><i class="fa-solid fa-droplet"></i> 水土保持：覆盖作物、等高耕作，减少径流与侵蚀。</li>
          <li><i class="fa-solid fa-temperature-half"></i> 精准监管：气象、土壤、虫情监测与数据驱动的投入品管理。</li>
        </ul>
        <div class="page-num">第 8 页 / 共 {{ totalPages }}</div>
      </section>

      <!-- 封底页 -->
      <section id="back" class="wp-page back">
        <div class="back-grid">
          <div class="back-info">
            <div class="logo-lg">茶智云</div>
            <div class="slogan">以数据与工艺，成就一杯好茶</div>
            <div class="contact">
              <div><i class="fa-solid fa-location-dot"></i> 浙江省杭州市西湖区 · 茶智云数字产业园</div>
              <div><i class="fa-solid fa-phone"></i> 0571-1234 5678</div>
              <div><i class="fa-solid fa-envelope"></i> hello@teacloud.cn</div>
            </div>
          </div>
          <div class="back-qr">
            <div class="tea-cake">
              <div class="cake-inner">
                <qrcode-vue :value="shareUrl" :size="118" />
              </div>
            </div>
            <div class="qr-tip">茶饼样式 · 扫码在线查看报价</div>
          </div>
        </div>
        <div class="page-num">第 9 页 / 共 {{ totalPages }}</div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, nextTick } from 'vue'
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

// 章节导航
const sections = [
  { id: 'cover', title: '封面' },
  { id: 'toc', title: '目录' },
  { id: 'quote', title: '报价信息' },
  { id: 'product', title: '产品详情' },
  { id: 'service', title: '服务与条款' },
  { id: 'culture', title: '企业文化' },
  { id: 'tea-culture', title: '茶叶文化' },
  { id: 'eco', title: '生态种植' },
  { id: 'back', title: '封底' }
]
const currentSection = ref('cover')
const isTurning = ref(false)
const totalPages = sections.length

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

// 尝试从产品库中定位龙井图片
const longjingImg = computed(() => {
  const prod = store.products.find(p => (p.name || '').includes('龙井'))
  return prod?.imageUrl || 'https://images.unsplash.com/photo-1537746208474-77b0b0fbb8d0?q=80&w=1400&auto=format&fit=crop'
})

function formatDate(d) {
  if (!d) return '-'
  const dt = typeof d === 'string' ? new Date(d) : d
  return `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`
}

function printPage() {
  window.print()
}

function goBack() { router.push('/ops/quotations') }

function goSection(id) {
  currentSection.value = id
  isTurning.value = true
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  setTimeout(() => { isTurning.value = false }, 500)
}

onMounted(() => {
  if (route.query.print === '1') {
    setTimeout(() => window.print(), 300)
  }
  nextTick(() => goSection('cover'))
})
</script>

<style scoped>
/* 主题色与变量 */
:root { 
  --tea-green: #2C5F2D; 
  --tea-light: #4A7C59;
  --rice: #F8F4E3; 
  --rice-dark: #F0E6D3;
  --brown: #97724F; 
  --gold: #D4AF37;
  --ink: #1A1A1A;
  --paper: #FEFCF8;
}

.whitepaper { 
  background: linear-gradient(135deg, var(--rice) 0%, var(--rice-dark) 100%);
  min-height: 100vh;
  position: relative;
}

/* 背景装饰 */
.whitepaper::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(2px 2px at 20px 30px, rgba(44,95,45,.1), transparent),
    radial-gradient(2px 2px at 40px 70px, rgba(151,114,79,.1), transparent),
    radial-gradient(1px 1px at 90px 40px, rgba(44,95,45,.1), transparent),
    radial-gradient(1px 1px at 130px 80px, rgba(151,114,79,.1), transparent);
  background-size: 200px 100px;
  pointer-events: none;
  z-index: 0;
}

/* 顶部导航 */
.wp-nav { 
  position: sticky; 
  top: 0; 
  z-index: 50; 
  display: flex; 
  align-items: center; 
  justify-content: space-between; 
  gap: 16px; 
  padding: 12px 20px; 
  background: rgba(248,244,227,.95); 
  backdrop-filter: blur(12px); 
  border-bottom: 1px solid rgba(44,95,45,.1);
  box-shadow: 0 2px 20px rgba(0,0,0,.05);
}
.brand-mini { 
  display: flex; 
  flex-direction: column; 
  line-height: 1; 
  position: relative;
}
.brand-mini .mark { 
  font-weight: 900; 
  color: var(--tea-green); 
  letter-spacing: 1px; 
  font-size: 18px;
  text-shadow: 0 1px 2px rgba(0,0,0,.1);
}
.brand-mini .sub { 
  font-size: 9px; 
  color: var(--brown); 
  letter-spacing: 1.5px;
  margin-top: 2px;
}
.wp-nav ul { 
  display: flex; 
  gap: 6px; 
  margin: 0; 
  padding: 0; 
  list-style: none; 
}
.navlink { 
  padding: 10px 16px; 
  border-radius: 20px; 
  border: 1px solid rgba(44,95,45,.2); 
  background: rgba(255,255,255,.8); 
  color: var(--ink); 
  cursor: pointer; 
  font-size: 13px;
  font-weight: 500;
  transition: all .3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}
.navlink::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(44,95,45,.1), transparent);
  transition: left .5s ease;
}
.navlink:hover::before {
  left: 100%;
}
.navlink.active, .navlink:hover { 
  border-color: var(--tea-green); 
  color: var(--tea-green); 
  background: rgba(44,95,45,.05);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(44,95,45,.15);
}
.nav-actions .btn { 
  border: 1px solid var(--tea-green); 
  background: var(--tea-green); 
  color: white;
  padding: 10px 16px; 
  border-radius: 20px; 
  cursor: pointer; 
  font-weight: 600;
  transition: all .3s ease;
  box-shadow: 0 2px 8px rgba(44,95,45,.2);
}
.nav-actions .btn:hover {
  background: var(--tea-light);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(44,95,45,.3);
}

/* 页面容器与翻页动效（左右开合小册子 A4 双页） */
.wp-container { 
  display: grid;
  grid-template-columns: repeat(2, 210mm);
  grid-auto-rows: 297mm;
  gap: 15mm;
  justify-content: center;
  margin: 16mm auto;
  transition: transform .6s cubic-bezier(0.4, 0, 0.2, 1);
  perspective: 1200px;
  position: relative;
  z-index: 1;
}
.wp-container.turning { 
  transform: rotateY(8deg) translateZ(0) scale(1.01); 
}

/* 单页固定 A4 尺寸 */
.wp-page { 
  position: relative; 
  width: 210mm;
  min-height: 297mm;
  background: var(--paper); 
  border: 1px solid rgba(44,95,45,.1); 
  border-radius: 6px; 
  padding: 14mm; 
  box-shadow: 
    0 8px 20px rgba(0,0,0,.08),
    0 3px 8px rgba(44,95,45,.05),
    inset 0 1px 0 rgba(255,255,255,.8); 
  transition: all .3s ease;
  overflow: hidden;
}
.wp-page:hover { transform: translateY(-1mm); }

.wp-h2 { 
  margin: 0 0 6mm; 
  font-weight: 900; 
  color: var(--tea-green); 
  letter-spacing: 1px; 
  font-size: 6mm;
  position: relative;
}
.wp-h2::after {
  content: '';
  position: absolute;
  bottom: -2mm;
  left: 0;
  width: 12mm;
  height: 1mm;
  background: linear-gradient(90deg, var(--tea-green), var(--brown));
  border-radius: 2px;
}
.page-num { 
  position: absolute; 
  right: 8mm; 
  bottom: 6mm; 
  font-size: 3mm; 
  color: var(--brown); 
  font-weight: 500;
  background: rgba(44,95,45,.05);
  padding: 1.5mm 3mm;
  border-radius: 6mm;
}

/* 宣纸与水墨纹理 */
.wp-page::before { 
  content:''; 
  position:absolute; 
  inset:0; 
  background: 
    radial-gradient(1200px 400px at 20% 0%, rgba(44,95,45,.04), transparent 60%), 
    radial-gradient(800px 300px at 80% 100%, rgba(151,114,79,.04), transparent 60%),
    linear-gradient(45deg, transparent 49%, rgba(44,95,45,.02) 50%, transparent 51%);
  background-size: 100% 100%, 100% 100%, 20px 20px;
  pointer-events:none; 
  border-radius:6px;
  opacity: 0.6;
}

/* 封面 */
.cover { 
  overflow: hidden; 
  background: linear-gradient(135deg, #f7f3e6 0%, #faf8f0 50%, #f5f1e0 100%);
}
.cover-bg { 
  position:absolute; 
  inset:0; 
  background: 
    radial-gradient(ellipse at 20% 20%, rgba(44,95,45,.08) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 80%, rgba(151,114,79,.08) 0%, transparent 50%);
}
.cover-content { 
  position: relative; 
  display: grid; 
  gap: 20px; 
  place-items: center; 
  text-align: center; 
  padding-top: 40px;
}
.cover-brand { 
  display:flex; 
  align-items:center; 
  gap: 12px;
  margin-bottom: 10px;
}
.cover-brand .logo { 
  font-size: 24px; 
  font-weight: 900; 
  color: var(--tea-green); 
  text-shadow: 0 2px 4px rgba(0,0,0,.1);
  letter-spacing: 2px;
}
.cover-brand .badge { 
  font-size: 10px; 
  color: var(--brown); 
  border: 1px solid rgba(151,114,79,.3); 
  padding: 4px 8px; 
  border-radius: 12px;
  background: rgba(255,255,255,.6);
  letter-spacing: 1px;
}
.cover-title { 
  font-family: 'Times New Roman', serif; 
  font-weight: 900; 
  letter-spacing: 3px; 
  font-size: 48px; 
  color: var(--ink); 
  margin: 20px 0 0;
  text-shadow: 0 2px 4px rgba(0,0,0,.1);
  background: linear-gradient(135deg, var(--tea-green), var(--brown));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.cover-sub { 
  letter-spacing: 3px; 
  color: var(--brown); 
  font-size: 14px;
  font-weight: 500;
}
.cover-illo { 
  display:flex; 
  gap: 16px; 
  margin: 20px 0;
  max-width: 600px;
}
.cover-illo .illo-main { 
  width: 60%; 
  height: 240px; 
  object-fit: cover; 
  border-radius: 16px; 
  filter: saturate(1.1) contrast(1.1) brightness(1.05);
  box-shadow: 0 8px 24px rgba(0,0,0,.15);
  transition: transform .3s ease;
}
.cover-illo .illo-main:hover {
  transform: scale(1.02);
}
.cover-illo .illo-leaf { 
  width: 35%; 
  height: 240px; 
  object-fit: cover; 
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0,0,0,.15);
  transition: transform .3s ease;
}
.cover-illo .illo-leaf:hover {
  transform: scale(1.02);
}
.cover-meta { 
  display:flex; 
  gap: 16px; 
  color: var(--brown); 
  font-size: 13px;
  font-weight: 500;
  margin-top: 10px;
}

/* 目录 */
.toc { 
  background: var(--paper);
}
.toc-list { 
  columns: 2; 
  gap: 32px; 
  list-style: none; 
  padding: 0; 
  margin: 0;
}
.toc-list li { 
  display:flex; 
  align-items:center; 
  gap:12px; 
  padding: 8px 0; 
  border-bottom: 1px dashed rgba(151,114,79,.3);
  transition: all .3s ease;
}
.toc-list li:hover {
  transform: translateX(4px);
  color: var(--tea-green);
}
.toc-list li span { 
  display:inline-flex; 
  width: 28px; 
  height:28px; 
  align-items:center; 
  justify-content:center; 
  background: linear-gradient(135deg, var(--tea-green), var(--tea-light)); 
  color:#fff; 
  border-radius: 8px; 
  font-weight: 800; 
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(44,95,45,.3);
}
.toc-aside { 
  position:absolute; 
  right: 0; 
  top: 0; 
  bottom: 0; 
  width: 100px; 
  background: linear-gradient(180deg, rgba(44,95,45,.03), transparent); 
  mask: radial-gradient(100px 300px at 50% 20%, #000, transparent 70%); 
  opacity:.8; 
  border-top-right-radius:16px; 
  border-bottom-right-radius:16px; 
}

/* 报价信息复用原有样式并增强 */
.q-header { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  padding-bottom: 20px; 
  border-bottom: 2px solid var(--tea-green);
  margin-bottom: 20px;
}
.brand { 
  display: flex; 
  align-items: baseline; 
  gap: 12px; 
}
.brand-mark { 
  font-size: 24px; 
  font-weight: 900; 
  color: var(--tea-green); 
  letter-spacing: 1px;
  text-shadow: 0 1px 2px rgba(0,0,0,.1);
}
.brand-sub { 
  font-size: 12px; 
  color: var(--brown); 
  border: 1px solid rgba(151,114,79,.3); 
  padding: 4px 8px; 
  border-radius: 8px;
  background: rgba(255,255,255,.6);
}
.q-meta { 
  text-align: right; 
  color: var(--ink); 
  font-size: 14px;
  font-weight: 500;
}
.label { 
  color: var(--brown); 
  font-weight: 600;
}
.q-customer { 
  padding: 20px 0; 
  color: var(--ink);
  font-size: 16px;
  line-height: 1.6;
}

.q-items table { 
  width: 100%; 
  border-collapse: collapse;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0,0,0,.08);
}
.q-items thead th { 
  text-align: left; 
  background: linear-gradient(135deg, var(--tea-green), var(--tea-light)); 
  color: white; 
  padding: 16px; 
  border-bottom: 1px solid rgba(255,255,255,.2); 
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 0.5px;
}
.q-items tbody td { 
  padding: 16px; 
  border-bottom: 1px solid rgba(44,95,45,.1);
  background: rgba(255,255,255,.5);
  transition: background .3s ease;
}
.q-items tbody tr:hover td {
  background: rgba(44,95,45,.05);
}
.q-items .p-name { 
  font-weight: 700; 
  color: var(--ink);
  font-size: 15px;
}
.q-items .p-origin { 
  color: var(--brown); 
  font-size: 13px; 
  margin-top: 4px;
  font-style: italic;
}
.q-items .num { 
  text-align: right; 
  font-weight: 600;
  color: var(--ink);
}

.q-summary { 
  width: 380px; 
  margin-left: auto; 
  margin-top: 20px;
  background: linear-gradient(135deg, rgba(44,95,45,.05), rgba(151,114,79,.05));
  padding: 20px;
  border-radius: 12px;
  border: 1px solid rgba(44,95,45,.1);
}
.q-summary .line { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  padding: 8px 0; 
  color: var(--ink);
  font-size: 15px;
}
.q-summary .total { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  padding: 12px 0; 
  border-top: 2px dashed rgba(44,95,45,.3); 
  margin-top: 8px; 
  font-size: 20px; 
  font-weight: 800; 
  color: var(--ink);
}
.q-summary .gold b { 
  background: linear-gradient(135deg, var(--gold), #F4E4A6); 
  -webkit-background-clip: text; 
  background-clip: text; 
  color: transparent; 
  text-shadow: 0 2px 4px rgba(0,0,0,.1);
  font-size: 24px;
}

/* 产品详情 */
.product-grid { 
  display:grid; 
  grid-template-columns: repeat(3, 1fr); 
  gap: 20px;
  margin-bottom: 24px;
}
.p-figure { 
  margin: 0;
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0,0,0,.12);
  transition: all .3s ease;
}
.p-figure:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0,0,0,.18);
}
.p-img { 
  width: 100%; 
  height: 200px; 
  border-radius: 16px; 
  object-fit: cover; 
  transition: transform .3s ease;
  filter: brightness(1.05) contrast(1.05);
}
.p-img:hover { 
  transform: scale(1.05); 
}
.p-figure figcaption { 
  font-size: 13px; 
  color: var(--brown); 
  margin-top: 8px;
  font-weight: 500;
  text-align: center;
  font-style: italic;
}
.p-desc { 
  margin: 20px 0 0; 
  padding: 20px; 
  list-style: none; 
  display: grid; 
  gap: 12px;
  background: linear-gradient(135deg, rgba(44,95,45,.03), rgba(151,114,79,.03));
  border-radius: 12px;
  border: 1px solid rgba(44,95,45,.1);
}
.p-desc li { 
  display:flex; 
  align-items:center; 
  gap: 12px; 
  color: var(--ink);
  font-size: 15px;
  line-height: 1.5;
}
.p-desc i { 
  color: var(--tea-green); 
  font-size: 16px;
  width: 20px;
  text-align: center;
}

/* 服务与条款 */
.service-cards { 
  display:grid; 
  grid-template-columns: repeat(3, 1fr); 
  gap: 20px;
  margin-bottom: 24px;
}
.service-cards .card { 
  border: 1px solid rgba(44,95,45,.1); 
  border-radius: 16px; 
  padding: 20px; 
  background: var(--paper);
  transition: all .3s ease;
  position: relative;
  overflow: hidden;
}
.service-cards .card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--tea-green), var(--brown));
  transform: scaleX(0);
  transition: transform .3s ease;
}
.service-cards .card:hover::before {
  transform: scaleX(1);
}
.service-cards .card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0,0,0,.12);
  border-color: rgba(44,95,45,.2);
}
.card-icn { 
  color: var(--tea-green); 
  font-size: 24px; 
  margin-bottom: 12px;
  text-shadow: 0 2px 4px rgba(44,95,45,.2);
}
.card-ttl { 
  font-weight: 800; 
  margin-bottom: 8px;
  color: var(--ink);
  font-size: 16px;
}
.card-txt { 
  color: var(--brown); 
  line-height: 1.6;
  font-size: 14px;
}
.terms-box { 
  margin-top: 16px; 
  padding: 20px; 
  border: 1px dashed rgba(44,95,45,.3); 
  border-radius: 16px; 
  background: linear-gradient(135deg, rgba(44,95,45,.02), rgba(151,114,79,.02));
  position: relative;
}
.terms-box::before {
  content: '📋';
  position: absolute;
  top: -10px;
  left: 20px;
  background: var(--paper);
  padding: 0 8px;
  font-size: 16px;
}
.terms-box .muted { 
  color: var(--brown); 
  margin-top: 12px;
  font-style: italic;
}
.service .mt { 
  margin-top: 24px; 
}

/* 封底与茶饼二维码 */
.back-grid { 
  display:grid; 
  grid-template-columns: 1.1fr .9fr; 
  gap: 32px; 
  align-items:center;
}
.logo-lg { 
  font-weight: 900; 
  font-size: 32px; 
  color: var(--tea-green); 
  letter-spacing: 1px;
  text-shadow: 0 2px 4px rgba(0,0,0,.1);
}
.slogan { 
  color: var(--brown); 
  margin: 12px 0 20px;
  font-size: 16px;
  font-style: italic;
  letter-spacing: 0.5px;
}
.contact { 
  color: var(--ink); 
  display:grid; 
  gap: 8px;
  font-size: 15px;
}
.contact i { 
  color: var(--tea-green); 
  margin-right: 8px;
  width: 16px;
  text-align: center;
}
.tea-cake { 
  width: 220px; 
  height: 220px; 
  border-radius: 50%; 
  background: radial-gradient(circle at 50% 40%, #f5f5f5 0, #e8e8e8 55%, #d4d4d4 100%); 
  box-shadow: 
    inset 0 12px 24px rgba(0,0,0,.1), 
    0 12px 32px rgba(0,0,0,.15),
    0 0 0 1px rgba(44,95,45,.1);
  display:grid; 
  place-items:center; 
  position: relative;
  transition: all .3s ease;
}
.tea-cake:hover {
  transform: scale(1.05) rotate(2deg);
  box-shadow: 
    inset 0 12px 24px rgba(0,0,0,.1), 
    0 16px 40px rgba(0,0,0,.2),
    0 0 0 1px rgba(44,95,45,.2);
}
.tea-cake::after { 
  content: ''; 
  position:absolute; 
  inset: 16px; 
  border-radius:50%; 
  border: 10px dotted rgba(44,95,45,.3); 
  pointer-events:none;
  animation: rotate 20s linear infinite;
}
@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.cake-inner { 
  width: 130px; 
  height: 130px; 
  border-radius: 50%; 
  display:grid; 
  place-items:center; 
  background: white; 
  box-shadow: inset 0 4px 12px rgba(0,0,0,.1);
  border: 2px solid rgba(44,95,45,.1);
}
.back .qr-tip { 
  font-size: 13px; 
  color: var(--brown); 
  margin-top: 12px;
  font-weight: 500;
  text-align: center;
}

/* 页脚细纹水印 */
.wp-page::after { 
  content:''; 
  position:absolute; 
  left: 20px; 
  right: 20px; 
  bottom: 12px; 
  height: 24px; 
  background: repeating-linear-gradient(45deg, rgba(44,95,45,.04) 0 4px, transparent 4px 8px); 
  border-bottom-left-radius:16px; 
  border-bottom-right-radius:16px; 
  pointer-events:none;
  opacity: 0.6;
}

/* 打印 */
@media print {
  .no-print { display: none !important; }
  .whitepaper { background: #fff !important; }
  .whitepaper::before { display: none !important; }
  .wp-container { width: auto; margin: 0; display: block; }
  .wp-page { page-break-after: always; border: none; box-shadow: none; border-radius: 0; margin: 0; width: auto; min-height: auto; padding: 12mm; }
  .wp-page::after, .wp-page::before { display: none; }
  .tea-cake::after { animation: none !important; }
}
</style>

<style>
@media print {
  @page { size: A4; margin: 12mm; }
  html, body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}
/* 引入 Font Awesome（CDN） */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');
</style>


