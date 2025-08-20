<template>
  <div class="toolkit-view">
    <header class="tk-header">
      <div class="tk-container">
        <div class="tk-breadcrumb">工具包</div>
        <h1 class="tk-h1">内部工具空间</h1>
        <p class="tk-h1-sub">二维码生成 · 对象存储适配（OSS / COS）· 前端 SDK · Webhook 网关 · 短链 · 图片代理 · 特性开关 · SSO</p>
      </div>
    </header>

    <div class="tk-container tk-layout">
      <aside class="tk-aside">
        <div class="tk-aside-title">类目</div>
        <nav class="tk-nav">
          <button
            v-for="cat in categories"
            :key="cat.value"
            :class="['tk-nav-item', { active: selectedCategory === cat.value }]"
            @click="selectedCategory = cat.value"
          >
            <span class="dot" :style="{ background: cat.color }"></span>
            {{ cat.label }}
          </button>
        </nav>
      </aside>

      <main class="tk-main">
        <div class="tk-toolbar">
          <div class="tk-search">
            <input v-model="query" type="text" placeholder="搜索工具、SDK 或能力…" />
          </div>
          <div class="tk-chips">
            <button
              v-for="chip in chips"
              :key="chip"
              :class="['tk-chip', { selected: activeChips.includes(chip) }]"
              @click="toggleChip(chip)"
            >{{ chip }}</button>
          </div>
          <div class="tk-actions">
            <button class="btn btn-dark" @click="showAdd = true">新增工具</button>
            <button class="btn" @click="router.push({ name: 'toolkit-docs', params: { key: 'review' } })">审核列表</button>
          </div>
        </div>

        <section class="tk-grid">
          <article
            v-for="tool in filteredTools"
            :key="tool.key"
            class="tk-card"
            @click="goDoc(tool.key, 'guide')"
          >
            <div class="tk-card-head">
              <div class="tk-card-icon" :style="{ background: tool.tint }">{{ tool.icon }}</div>
              <div class="tk-card-meta">
                <h3 class="tk-card-title">{{ tool.title }}</h3>
                <div class="tk-tags">
                  <span class="tk-tag" v-for="t in tool.tags" :key="t">{{ t }}</span>
                </div>
              </div>
            </div>
            <p class="tk-card-desc">{{ tool.desc }}</p>
            <div class="auto-poster-btn" @click.stop="generateAutoPoster(tool)">
              <PhotoIcon class="poster-heroicon" aria-hidden="true" />
              <span>生成海报</span>
            </div>
          </article>
        </section>


      </main>
    </div>

    <!-- 新增工具弹层 -->
    <div v-if="showAdd" class="tk-modal">
      <div class="tk-modal-mask" @click="showAdd = false"></div>
      <div class="tk-modal-card">
        <div class="tk-modal-head">
          <h3>新增工具</h3>
          <button class="close" @click="showAdd = false">✕</button>
        </div>
        <div class="tk-modal-body">
          <div class="form-row">
            <label>标题</label>
            <input v-model="draft.title" placeholder="例如：基础请求层（useRequest）" />
          </div>
          <div class="form-row">
            <label>Key（英文字母/短横线）</label>
            <input v-model="draft.key" placeholder="例如：base-request" />
          </div>
          <div class="form-row">
            <label>描述</label>
            <textarea v-model="draft.desc" rows="3" placeholder="一句话描述能力与价值"></textarea>
          </div>
          <div class="form-row inline">
            <div>
              <label>分类</label>
              <select v-model="draft.cat">
                <option v-for="c in categories" :key="c.value" :value="c.value">{{ c.label }}</option>
              </select>
            </div>
            <div>
              <label>标签（逗号分隔）</label>
              <input v-model="draft.tagsText" placeholder="SDK, Auth" />
            </div>
            <div>
              <label>图标</label>
              <input v-model="draft.icon" placeholder="例如：⌘" />
            </div>
          </div>
        </div>
        <div class="tk-modal-foot">
          <button class="btn" @click="showAdd = false">取消</button>
          <button class="btn btn-dark" @click="confirmAdd">保存</button>
        </div>
      </div>
    </div>

    <!-- 海报预览弹窗 -->
    <div v-if="showPosterModal" class="poster-modal">
      <div class="poster-modal-mask" @click="showPosterModal = false"></div>
      <div class="poster-modal-card">
        <div class="poster-modal-head">
          <h3>工具分享海报</h3>
          <button class="close" @click="showPosterModal = false">✕</button>
        </div>
        <div class="poster-modal-body">
          <div class="poster-preview" ref="posterPreview">
            <div class="poster-card">
              <div class="poster-header">
                <div class="poster-logo">
                  <span class="logo-icon">☕</span>
                  <span class="logo-text">茶智云</span>
                </div>
                <div class="poster-badge">内部工具</div>
              </div>
              
              <div class="poster-content">
                <h2 class="poster-title">{{ share.title || '工具名称' }}</h2>
                <p class="poster-desc">{{ share.subtitle || '工具描述信息' }}</p>
                
                <div class="poster-features">
                  <div class="feature-item">
                    <span class="feature-icon">⚡</span>
                    <span>快速接入</span>
                  </div>
                  <div class="feature-item">
                    <span class="feature-icon">🛡️</span>
                    <span>安全可靠</span>
                  </div>
                  <div class="feature-item">
                    <span class="feature-icon">📚</span>
                    <span>详细文档</span>
                  </div>
                </div>
              </div>
              
              <div class="poster-footer">
                <div class="qr-section">
                  <canvas ref="qrCanvas" width="80" height="80"></canvas>
                  <span class="qr-text">扫码查看</span>
                </div>
                <div class="poster-info">
                  <div class="info-item">
                    <span class="info-label">分类：</span>
                    <span class="info-value">{{ share.category || 'SDK' }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">版本：</span>
                    <span class="info-value">v1.0.0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="poster-modal-foot">
          <button class="btn" @click="showPosterModal = false">关闭</button>
          <button class="btn btn-dark" @click="downloadPoster">下载海报</button>
        </div>
      </div>
    </div>
  </div>
  </template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { PhotoIcon } from '@heroicons/vue/24/outline'
import html2canvas from 'html2canvas'
import QRCode from 'qrcode'
import { useRouter } from 'vue-router'
import { createTool } from '@/api/toolkit'
const router = useRouter()

const categories = [
  { value: 'all', label: '全部', color: '#10b981' },
  { value: 'media', label: '多媒体/生成', color: '#6366f1' },
  { value: 'storage', label: '对象存储', color: '#0ea5e9' },
  { value: 'sdk', label: '前端 SDK', color: '#f59e0b' },
  { value: 'infra', label: '平台/接入', color: '#ef4444' },
  { value: 'security', label: '安全/合规', color: '#14b8a6' },
  { value: 'devops', label: 'DevOps/IaC', color: '#a855f7' }
]

const baseTools = [
  // P0 优先落地
  {
    key: 'base-request',
    title: '基础请求层（useRequest）',
    desc: '统一拦截/超时/重试/熔断，错误码映射与兜底提示，暴露 Hook 与中间件。',
    tags: ['Hook', 'Retry', 'CircuitBreaker'],
    icon: '↯',
    tint: '#ecfeff',
    cat: 'sdk'
  },
  {
    key: 'table-query',
    title: '表格搜索套件（useTableQuery）',
    desc: '查询条件状态化，URL 同步，分页/导出一体化，适配常见表格组件。',
    tags: ['Filter', 'Pagination', 'Export'],
    icon: '≣',
    tint: '#f0fdf4',
    cat: 'sdk'
  },
  {
    key: 'openapi-gen',
    title: 'OpenAPI/Proto 客户端生成器',
    desc: '一键生成强类型 API Client 与 Mock Server，内置鉴权与错误处理模板。',
    tags: ['OpenAPI', 'Proto', 'Mock'],
    icon: '∮',
    tint: '#fef3c7',
    cat: 'infra'
  },
  {
    key: 'uploader-sdk',
    title: '上传适配器（OSS/COS/S3）',
    desc: '直传/分片/STS，断点续传与秒传，MD5 去重与 CDN 刷新，统一接口。',
    tags: ['OSS', 'COS', 'S3'],
    icon: '⇪',
    tint: '#eef2ff',
    cat: 'storage'
  },
  {
    key: 'qr',
    title: '二维码生成服务',
    desc: '文本/URL/带 Logo 的品牌二维码，支持 PNG/SVG/PDF 导出，批量与异步渲染。',
    tags: ['REST', '前端SDK', '模板'],
    icon: '◼︎',
    tint: '#ecfeff',
    cat: 'media'
  },
  {
    key: 'oss-cos',
    title: 'OSS / COS 统一适配',
    desc: '统一协议层与签名策略，直传/分片/STS，断点续传与秒传，CDN 刷新。',
    tags: ['存储', '签名', 'CDN'],
    icon: '☁︎',
    tint: '#eef2ff',
    cat: 'storage'
  },
  {
    key: 'web-sdk',
    title: '前端 Web SDK',
    desc: '请求封装、鉴权中间件、错误上报与埋点，支持多租户与灰度。',
    tags: ['Hook', 'Auth', 'Track'],
    icon: '⌘',
    tint: '#fef3c7',
    cat: 'sdk'
  },
  {
    key: 'webhook',
    title: 'Webhook 网关',
    desc: '签名校验、重试策略、死信队列；回调重放、规则路由、速率限制。',
    tags: ['HMAC', 'DLQ', 'Router'],
    icon: '↻',
    tint: '#fee2e2',
    cat: 'infra'
  },
  {
    key: 'shortlink',
    title: '短链服务',
    desc: '可配置域名/有效期/Utm，支持 A/B 实验与访问统计。',
    tags: ['Link', 'ABTest'],
    icon: '⤻',
    tint: '#f0fdf4',
    cat: 'infra'
  },
  {
    key: 'img-proxy',
    title: '图片代理与转码',
    desc: '裁剪/水印/格式转换，WebP/AVIF 动态自适应，支持防盗链。',
    tags: ['Transcode', 'CDN'],
    icon: '▣',
    tint: '#f5f3ff',
    cat: 'media'
  },
  // P1
  {
    key: 'feature-flag',
    title: '配置中心与特性开关',
    desc: '远程配置、灰度开关、按租户/环境切流，支持实时拉取与缓存。',
    tags: ['Config', 'Flag'],
    icon: '⚑',
    tint: '#ecfccb',
    cat: 'infra'
  },
  {
    key: 'tracking',
    title: '统一日志/埋点',
    desc: '页面/接口/性能三类埋点，采样策略与错误上报聚合，接入大盘。',
    tags: ['Log', 'Analytics'],
    icon: '✦',
    tint: '#e0e7ff',
    cat: 'infra'
  },
  {
    key: 'form-builder',
    title: '表单构建器（Schema）',
    desc: 'JSON Schema 转自动表单，内置校验、联动、异步选项与布局。',
    tags: ['Form', 'Schema'],
    icon: '▤',
    tint: '#ffe4e6',
    cat: 'sdk'
  },
  // P2
  {
    key: 'validator',
    title: '通用校验库',
    desc: '手机号/企业税号/金额/精度处理、XSS 安全过滤与常用正则封装。',
    tags: ['Validate', 'Sanitize'],
    icon: '✓',
    tint: '#dcfce7',
    cat: 'security'
  },
  {
    key: 'crypto',
    title: '加解密/签名工具',
    desc: 'HMAC、RSA、时间戳校准、请求签名与验签工具，内置时钟偏移处理。',
    tags: ['HMAC', 'RSA'],
    icon: '🔐',
    tint: '#cffafe',
    cat: 'security'
  },
  {
    key: 'idgen',
    title: 'ID/雪花号生成器',
    desc: '跨服务唯一、按业务维度分片，支持可回溯结构与时间序列。',
    tags: ['UID', 'Snowflake'],
    icon: '#',
    tint: '#faf5ff',
    cat: 'infra'
  },
  {
    key: 'perf',
    title: '性能采集（Web Vitals）',
    desc: 'LCP/FID/CLS/INP 采集与上报，长任务/资源错误捕获，采样可配。',
    tags: ['Vitals', 'RUM'],
    icon: '⏱',
    tint: '#e5e7eb',
    cat: 'infra'
  },
  {
    key: 'data-mock',
    title: '可测试数据构造',
    desc: 'Mock/造数脚本、固定种子随机器与数据生成模板，支持回放。',
    tags: ['Mock', 'Fixture'],
    icon: '⚙︎',
    tint: '#fff7ed',
    cat: 'infra'
  },
  {
    key: 'ci-templates',
    title: 'CI 模板',
    desc: 'Lint/TypeCheck/单测/预览部署，变更集 Changelog 自动化流水线。',
    tags: ['CI', 'Changelog'],
    icon: '⇅',
    tint: '#f1f5f9',
    cat: 'devops'
  },
  {
    key: 'iac',
    title: 'IaC 子模块',
    desc: 'OSS/COS、CDN、网关、消息队列等资源的 Terraform 子模块与基准。',
    tags: ['Terraform', 'IaC'],
    icon: '⌂',
    tint: '#eef2ff',
    cat: 'devops'
  },
  {
    key: 'release',
    title: '发布与版本脚本',
    desc: '版本号策略、Tag/Release、源图同步（内网 NPM/Git 包）与回滚模板。',
    tags: ['Release', 'Semver'],
    icon: '⇪',
    tint: '#f3f4f6',
    cat: 'devops'
  }
]
const userTools = ref([])

const chips = ['REST API', 'SDK', 'Mock', '签名', '可观测性', 'OSS', 'COS', 'S3', 'OpenAPI']
const activeChips = ref([])
const selectedCategory = ref('all')
const query = ref('')

const toggleChip = (chip) => {
  const i = activeChips.value.indexOf(chip)
  if (i >= 0) activeChips.value.splice(i, 1)
  else activeChips.value.push(chip)
}

const mergedTools = computed(() => [...baseTools, ...userTools.value])

const filteredTools = computed(() => {
  return mergedTools.value.filter(t => {
    const byCat = selectedCategory.value === 'all' || t.cat === selectedCategory.value
    const byQuery = !query.value || (t.title + t.desc + t.tags.join(' ')).toLowerCase().includes(query.value.toLowerCase())
    const byChip = !activeChips.value.length || activeChips.value.every(c => (t.title + t.desc + t.tags.join(' ')).includes(c.replace(/\s/g,'')))
    return byCat && byQuery && byChip
  })
})

function goDoc(key, tab) {
  router.push({ name: 'toolkit-docs', params: { key }, query: { tab } })
}

// 新增工具
const showAdd = ref(false)
const draft = reactive({ title: '', key: '', desc: '', cat: 'sdk', tagsText: '', icon: '⌘', tint: '#f9fafb' })

async function confirmAdd() {
  if (!draft.title || !draft.key) return alert('请填写标题与 Key')
  const tool = {
    key: draft.key.trim(),
    title: draft.title.trim(),
    desc: draft.desc.trim(),
    tags: (draft.tagsText || '').split(',').map(s => s.trim()).filter(Boolean),
    icon: draft.icon || '⌘',
    tint: draft.tint,
    cat: draft.cat
  }
  try {
    await createTool(tool)
    userTools.value = [...userTools.value, tool]
    localStorage.setItem('toolkit-user-tools', JSON.stringify(userTools.value))
    showAdd.value = false
    alert('已提交创建，进入审核流程')
    // 清空草稿
    draft.title = draft.key = draft.desc = draft.tagsText = ''
  } catch (e) {
    alert('后端创建失败，已暂存到本地（离线模式）')
    userTools.value = [...userTools.value, tool]
    localStorage.setItem('toolkit-user-tools', JSON.stringify(userTools.value))
    showAdd.value = false
    // 清空草稿
    draft.title = draft.key = draft.desc = draft.tagsText = ''
  }
}

onMounted(() => {
  try {
    const saved = JSON.parse(localStorage.getItem('toolkit-user-tools') || '[]')
    if (Array.isArray(saved)) userTools.value = saved
  } catch (e) {
    console.error('Failed to load user tools:', e)
  }
})

// 海报制作工具
const share = reactive({ title: '', subtitle: '', url: '', category: 'SDK' })
const qrCanvas = ref(null)
const posterPreview = ref(null)
const showPosterModal = ref(false)

function generateQR() {
  const canvas = qrCanvas.value
  if (!canvas || !share.url) return
  QRCode.toCanvas(canvas, share.url, { width: 80, margin: 2, color: { dark: '#000000', light: '#ffffff' } }, (err) => {
    if (err) console.error('二维码生成失败:', err)
  })
}

function generateAutoPoster(tool) {
  // 自动填充工具信息
  share.title = tool.title
  share.subtitle = tool.desc
  share.category = tool.cat === 'sdk' ? 'SDK' : 
                   tool.cat === 'api' ? 'API' : 
                   tool.cat === 'storage' ? '服务' : '工具'
  share.url = `${window.location.origin}/toolkit/docs/${tool.key}`
  
  // 显示海报弹窗
  showPosterModal.value = true
  
  // 在弹窗显示后生成二维码
  setTimeout(() => {
    generateQR()
  }, 100)
}

function downloadPoster() {
  if (!posterPreview.value) return
  html2canvas(posterPreview.value, { 
    backgroundColor: '#ffffff', 
    scale: 2,
    useCORS: true,
    allowTaint: true
  }).then(canvas => {
    const url = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = `poster-${share.title || 'tool'}.png`
    a.click()
  })
}
</script>

<style scoped>
.tk-header { background: #0b1220; color: #fff; padding: 48px 0 36px; }
.tk-container { max-width: 1320px; margin: 0 auto; padding: 0 24px; }
.tk-breadcrumb { opacity: .7; font-size: 13px; margin-bottom: 8px; }
.tk-h1 { font-size: 32px; font-weight: 800; margin: 0 0 8px; letter-spacing: -0.02em; }
.tk-h1-sub { margin: 0; opacity: .9; line-height: 1.7; }

.tk-layout { display: grid; grid-template-columns: 240px 1fr; gap: 32px; padding: 32px 0 64px; }
.tk-aside { position: sticky; top: 76px; height: fit-content; }
.tk-aside-title { font-size: 13px; color: #6b7280; margin-bottom: 12px; font-weight: 600; }
.tk-nav { display: flex; flex-direction: column; gap: 8px; }
.tk-nav-item { text-align: left; padding: 12px 16px; border-radius: 12px; border: 1px solid #e5e7eb; background: #fff; color: #111827; cursor: pointer; transition: all .2s ease; display: flex; align-items: center; gap: 10px; font-size: 14px; }
.tk-nav-item:hover { border-color: #d1d5db; background: #f9fafb; }
.tk-nav-item.active { border-color: #111827; background: #111827; color: #fff; }
.tk-nav-item .dot { width: 8px; height: 8px; border-radius: 999px; display: inline-block; }

.tk-main { min-height: 400px; }
.tk-toolbar { display: flex; gap: 16px; align-items: center; margin-bottom: 24px; flex-wrap: wrap; }
.tk-actions { display: flex; gap: 12px; align-items: center; }
.tk-search input { width: 320px; padding: 12px 16px; border: 1px solid #e5e7eb; border-radius: 12px; outline: none; font-size: 14px; }
.tk-search input:focus { border-color: #111827; box-shadow: 0 0 0 3px rgba(17,24,39,.1); }
.tk-chips { display: flex; gap: 10px; flex-wrap: wrap; }
.tk-chip { padding: 10px 16px; border: 1px solid #e5e7eb; border-radius: 999px; background: #fff; cursor: pointer; font-size: 13px; transition: all .2s ease; }
.tk-chip:hover { border-color: #d1d5db; background: #f9fafb; }
.tk-chip.selected { border-color: #111827; background: #111827; color: #fff; }

.tk-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }
.tk-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 20px; box-shadow: 0 4px 12px rgba(17,24,39,.06); display: flex; flex-direction: column; gap: 12px; transition: transform .15s ease, box-shadow .15s ease; cursor: pointer; position: relative; }
.tk-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(17,24,39,.1); border-color: #d1d5db; }
.tk-card-head { display: flex; gap: 14px; align-items: center; }
.tk-card-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #111827; font-weight: 700; font-size: 18px; }
.tk-card-meta { display: flex; flex-direction: column; gap: 6px; }
.tk-card-title { margin: 0; font-size: 17px; font-weight: 700; color: #111827; }
.tk-tags { display: flex; gap: 8px; flex-wrap: wrap; }
.tk-tag { padding: 4px 10px; border-radius: 999px; background: #f3f4f6; color: #374151; font-size: 12px; border: 1px solid #e5e7eb; }
.tk-card-desc { margin: 6px 0 0; color: #4b5563; line-height: 1.6; font-size: 14px; }
.auto-poster-btn { position: absolute; bottom: 6px; right: 16px; display: flex; align-items: center; gap: 4px; padding: 6px 10px; color: #6b7280; font-size: 12px; cursor: pointer; transition: all .2s ease; }
.auto-poster-btn:hover { color: #111827; transform: translateY(-1px); }
.poster-heroicon { width: 16px; height: 16px; color: #6b7280; }
.btn { padding: 10px 16px; border-radius: 12px; border: 1px solid #e5e7eb; background: #fff; cursor: pointer; font-weight: 600; font-size: 14px; transition: all .2s ease; }
.btn:hover { border-color: #d1d5db; background: #f9fafb; }
.btn-dark { background: #111827; color: #fff; border-color: #111827; }
.btn-dark:hover { background: #1f2937; border-color: #1f2937; }
.btn-light { background: #f9fafb; }
.btn-ghost { background: #fff; }
.poster-preview { display: flex; justify-content: center; }
.poster-card { width: 400px; height: 600px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 20px; padding: 32px; color: white; position: relative; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,.2); }
.poster-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>'); pointer-events: none; }

.poster-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
.poster-logo { display: flex; align-items: center; gap: 8px; }
.logo-icon { font-size: 24px; }
.logo-text { font-size: 18px; font-weight: 700; }
.poster-badge { background: rgba(255,255,255,.2); backdrop-filter: blur(10px); padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }

.poster-content { flex: 1; }
.poster-title { font-size: 28px; font-weight: 800; margin: 0 0 16px; line-height: 1.2; }
.poster-desc { font-size: 16px; line-height: 1.6; margin: 0 0 32px; opacity: 0.9; }

.poster-features { display: flex; flex-direction: column; gap: 16px; margin-bottom: 40px; }
.feature-item { display: flex; align-items: center; gap: 12px; }
.feature-icon { font-size: 20px; }
.feature-item span:last-child { font-size: 16px; font-weight: 500; }

.poster-footer { display: flex; justify-content: space-between; align-items: flex-end; }
.qr-section { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.qr-text { font-size: 12px; font-weight: 500; opacity: 0.8; }
.poster-info { display: flex; flex-direction: column; gap: 8px; }
.info-item { display: flex; gap: 8px; font-size: 14px; }
.info-label { opacity: 0.7; }
.info-value { font-weight: 600; }

/* 海报弹窗 */
.poster-modal { position: fixed; inset: 0; z-index: 1000; display: grid; place-items: center; }
.poster-modal-mask { position: fixed; inset: 0; background: rgba(17,24,39,.4); backdrop-filter: blur(4px); }
.poster-modal-card { position: relative; width: 90vw; max-width: 800px; max-height: 90vh; background: #fff; border: 1px solid #e5e7eb; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,.2); z-index: 1001; display: flex; flex-direction: column; }
.poster-modal-head { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid #e5e7eb; }
.poster-modal-head h3 { margin: 0; font-size: 20px; font-weight: 700; color: #111827; }
.poster-modal-head .close { border: 1px solid #e5e7eb; background: #fff; border-radius: 10px; padding: 8px 12px; cursor: pointer; font-size: 16px; transition: all .2s ease; }
.poster-modal-head .close:hover { border-color: #d1d5db; background: #f9fafb; }
.poster-modal-body { flex: 1; padding: 24px; overflow: auto; display: flex; justify-content: center; }
.poster-modal-foot { display: flex; justify-content: flex-end; gap: 12px; padding: 16px 24px; border-top: 1px solid #e5e7eb; }

/* 新增工具弹层 */
.tk-modal { position: fixed; inset: 0; z-index: 1000; display: grid; place-items: center; }
.tk-modal-card { position: relative; width: 800px; max-width: calc(100% - 48px); background: #fff; border: 1px solid #e5e7eb; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,.2); z-index: 1001; }
.tk-modal-head { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid #e5e7eb; }
.tk-modal-head h3 { margin: 0; font-size: 20px; font-weight: 700; color: #111827; }
.tk-modal-head .close { border: 1px solid #e5e7eb; background: #fff; border-radius: 10px; padding: 8px 12px; cursor: pointer; font-size: 16px; transition: all .2s ease; }
.tk-modal-head .close:hover { border-color: #d1d5db; background: #f9fafb; }
.tk-modal-body { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
.tk-modal-body .form-row { display: flex; flex-direction: column; gap: 8px; }
.tk-modal-body .form-row.inline { flex-direction: row; gap: 16px; }
.tk-modal-body label { font-size: 14px; color: #374151; font-weight: 600; }
.tk-modal-body input, .tk-modal-body textarea, .tk-modal-body select { border: 1px solid #e5e7eb; border-radius: 12px; padding: 12px 16px; outline: none; width: 100%; font-size: 14px; transition: all .2s ease; }
.tk-modal-body input:focus, .tk-modal-body textarea:focus, .tk-modal-body select:focus { border-color: #111827; box-shadow: 0 0 0 3px rgba(17,24,39,.1); }
.tk-modal-body textarea { min-height: 100px; resize: vertical; }
.tk-modal-foot { display: flex; justify-content: flex-end; gap: 12px; padding: 16px 24px; border-top: 1px solid #e5e7eb; }
.tk-modal-mask { position: fixed; inset: 0; background: rgba(17,24,39,.4); backdrop-filter: blur(4px); }

@media (max-width: 992px) {
  .tk-layout { grid-template-columns: 1fr; }
  .tk-aside { position: static; }
}
</style>

