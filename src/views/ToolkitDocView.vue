<template>
  <div class="tk-doc">
    <header class="doc-hero">
      <div class="container">
        <div class="crumbs"><span @click="goBack" class="link">工具包</span> / 文档</div>
        <h1 class="title">{{ docTitle }}</h1>
        <p class="subtitle">{{ docDesc }}</p>
      </div>
    </header>

    <main class="container main">


      <section class="card">
        <div class="card-header">
          <h2>快速开始</h2>
          <button class="edit-btn" @click="showEditor = true">编辑</button>
        </div>
        <div class="card-content" v-html="renderedContent"></div>
      </section>
    </main>

    <!-- Markdown 编辑器弹层 -->
    <div v-if="showEditor" class="editor-modal">
      <div class="editor-mask" @click="showEditor = false"></div>
      <div class="editor-card">
        <div class="editor-head">
          <h3>编辑文档内容</h3>
          <button class="close" @click="showEditor = false">✕</button>
        </div>
        <div class="editor-body">
          <div class="md-editor">
            <textarea v-model="mdContent" placeholder="在这里编写 Markdown 内容..." class="md-textarea"></textarea>
            <div class="md-preview" v-html="renderedMd"></div>
          </div>
        </div>
        <div class="editor-foot">
          <button class="btn" @click="showEditor = false">取消</button>
          <button class="btn" @click="saveMdLocal">保存到本地</button>
          <button class="btn btn-dark" @click="saveMdRemote">提交到后端</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { computed, ref } from 'vue'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const routeKey = computed(() => route.params.key || 'tool')

// 编辑器相关
const showEditor = ref(false)
const mdContent = ref(localStorage.getItem(`tk-doc-${route.params.key}`) || `# 快速开始

## 安装依赖
\`\`\`bash
npm install @tea/web-sdk
\`\`\`

## 获取凭证
联系平台组开通沙箱 AK/SK

## 配置环境
在 .env 文件中配置网关地址与租户信息

## 调用示例
\`\`\`javascript
import { client } from '@tea/web-sdk'

const res = await client.get('/health')
console.log(res.data)
\`\`\``)

// Markdown 渲染
const renderedMd = computed(() => {
  return mdContent.value
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/`(.*)`/gim, '<code>$1</code>')
    .replace(/```(\w+)?\n([\s\S]*?)```/gim, '<pre class="code"><code>$2</code></pre>')
    .replace(/\n/gim, '<br>')
})

const renderedContent = computed(() => renderedMd.value)

const titles = {
  'base-request': '基础请求层（useRequest）',
  'table-query': '表格搜索套件（useTableQuery）',
  'openapi-gen': 'OpenAPI/Proto 客户端生成器',
  'uploader-sdk': '上传适配器（OSS/COS/S3）',
  'qr': '二维码生成服务',
  'oss-cos': 'OSS / COS 统一适配',
  'web-sdk': '前端 Web SDK',
  'webhook': 'Webhook 网关',
  'shortlink': '短链服务',
  'img-proxy': '图片代理与转码',
  'feature-flag': '配置中心与特性开关',
  'tracking': '统一日志/埋点',
  'form-builder': '表单构建器（Schema）',
  'validator': '通用校验库',
  'crypto': '加解密/签名工具',
  'idgen': 'ID/雪花号生成器',
  'perf': '性能采集（Web Vitals）',
  'data-mock': '可测试数据构造',
  'ci-templates': 'CI 模板',
  'iac': 'IaC 子模块',
  'release': '发布与版本脚本'
}

const descs = {
  'base-request': '统一拦截/超时/重试/熔断，错误码映射与兜底提示，暴露 Hook 与中间件。',
  'table-query': '查询状态化、URL 同步、分页导出集成，适配主流表格。',
  'openapi-gen': '一键生成强类型 Client 与 Mock，自动注入鉴权。',
  'uploader-sdk': '直传/分片/STS，断点续传与秒传，统一接口。',
}

const docTitle = computed(() => titles[routeKey.value] || '工具文档')
const docDesc = computed(() => descs[routeKey.value] || '内部工具的占位说明，详细内容由平台组补充。')

function goBack() {
  router.push('/toolkit')
}

function saveMdLocal() {
  localStorage.setItem(`tk-doc-${route.params.key}`, mdContent.value || '')
  alert('已保存到本地')
}

async function saveMdRemote() {
  try {
    await axios.post('/api/toolkit/docs/save', {
      key: route.params.key,
      content: mdContent.value
    })
    alert('已提交到后端')
  } catch {
    alert('提交失败，请检查网络或后端服务')
  }
}
</script>

<style scoped>
.container { max-width: 1320px; margin: 0 auto; padding: 0 24px; }
.doc-hero { background: #0b1220; color: #fff; padding: 48px 0 36px; }
.crumbs { opacity: .7; font-size: 13px; margin-bottom: 8px; }
.crumbs .link { cursor: pointer; text-decoration: underline; }
.title { font-size: 32px; font-weight: 800; margin: 0 0 8px; }
.subtitle { margin: 0; opacity: .9; line-height: 1.6; }
.main { padding: 32px 0 64px; }
.tabs { display: flex; gap: 10px; margin-bottom: 24px; flex-wrap: wrap; }
.tab { padding: 12px 20px; border-radius: 12px; border: 1px solid #e5e7eb; background: #fff; cursor: pointer; font-size: 14px; font-weight: 500; transition: all .2s ease; }
.tab:hover { border-color: #d1d5db; background: #f9fafb; }
.tab.active { background: #111827; color: #fff; border-color: #111827; }
.card { background: #fff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 24px; box-shadow: 0 4px 12px rgba(17,24,39,.06); margin-bottom: 24px; }
.code { background: #0b1220; color: #e5e7eb; border-radius: 12px; padding: 16px; overflow: auto; font-family: 'Monaco', 'Menlo', 'Consolas', monospace; font-size: 13px; line-height: 1.6; }
.save-row { display: flex; gap: 12px; margin-top: 16px; }
.btn { padding: 10px 16px; border-radius: 12px; border: 1px solid #e5e7eb; background: #fff; cursor: pointer; font-weight: 600; font-size: 14px; transition: all .2s ease; }
.btn:hover { border-color: #d1d5db; background: #f9fafb; }
.btn.btn-dark { background: #111827; color: #fff; border-color: #111827; }
.btn.btn-dark:hover { background: #1f2937; border-color: #1f2937; }

.md-editor { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin: 24px 0; }
.md-textarea { width: 100%; min-height: 400px; padding: 16px; border: 1px solid #e5e7eb; border-radius: 12px; font-family: 'Monaco', 'Menlo', 'Consolas', monospace; font-size: 14px; line-height: 1.6; resize: vertical; outline: none; }
.md-textarea:focus { border-color: #111827; box-shadow: 0 0 0 3px rgba(17,24,39,.1); }
.md-preview { padding: 16px; border: 1px solid #e5e7eb; border-radius: 12px; background: #f9fafb; min-height: 400px; overflow-y: auto; line-height: 1.6; }
.md-preview h1 { font-size: 24px; font-weight: 700; margin: 16px 0 12px; color: #111827; }
.md-preview h2 { font-size: 20px; font-weight: 600; margin: 14px 0 10px; color: #111827; }
.md-preview h3 { font-size: 18px; font-weight: 600; margin: 12px 0 8px; color: #111827; }
.md-preview p { margin: 8px 0; color: #374151; }
.md-preview code { background: #e5e7eb; padding: 3px 6px; border-radius: 6px; font-family: 'Monaco', 'Menlo', 'Consolas', monospace; font-size: 13px; }
.md-preview strong { font-weight: 600; color: #111827; }
.md-preview em { font-style: italic; }

.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.edit-btn { padding: 8px 16px; border: 1px solid #e5e7eb; border-radius: 8px; background: #fff; cursor: pointer; font-size: 14px; font-weight: 500; transition: all .2s ease; }
.edit-btn:hover { border-color: #d1d5db; background: #f9fafb; }

.card h2 { font-size: 20px; font-weight: 700; margin: 0 0 16px; color: #111827; }
.card h3 { font-size: 18px; font-weight: 600; margin: 20px 0 12px; color: #111827; }
.card p { margin: 12px 0; line-height: 1.6; color: #374151; }
.card ul { margin: 12px 0; padding-left: 20px; }
.card li { margin: 6px 0; line-height: 1.6; color: #374151; }

/* 编辑器弹层 */
.editor-modal { position: fixed; inset: 0; z-index: 1000; display: grid; place-items: center; }
.editor-mask { position: fixed; inset: 0; background: rgba(17,24,39,.4); backdrop-filter: blur(4px); }
.editor-card { position: relative; width: 90vw; max-width: 1200px; max-height: 90vh; background: #fff; border: 1px solid #e5e7eb; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,.2); z-index: 1001; display: flex; flex-direction: column; }
.editor-head { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid #e5e7eb; }
.editor-head h3 { margin: 0; font-size: 20px; font-weight: 700; color: #111827; }
.editor-head .close { border: 1px solid #e5e7eb; background: #fff; border-radius: 10px; padding: 8px 12px; cursor: pointer; font-size: 16px; transition: all .2s ease; }
.editor-head .close:hover { border-color: #d1d5db; background: #f9fafb; }
.editor-body { flex: 1; padding: 24px; overflow: hidden; }
.editor-foot { display: flex; justify-content: flex-end; gap: 12px; padding: 16px 24px; border-top: 1px solid #e5e7eb; }
</style>

