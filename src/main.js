import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// 引入Tailwind CSS
import './assets/main.css'
// 引入VueUse Motion
import { MotionPlugin } from '@vueuse/motion'
// 引入Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
// 引入Element Plus图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 引入中文语言包
import zhCn from 'element-plus/es/locale/lang/zh-cn'
// 引入Pinia
import { createPinia } from 'pinia'
import { useUiSettingsStore } from '@/stores/uiSettingsStore'

const app = createApp(App)
const pinia = createPinia()

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// .use() 顺序：pinia → router → motion → ElementPlus
app.use(pinia)
app.use(router)
app.use(MotionPlugin)
app.use(ElementPlus, {
  locale: zhCn // 配置中文
})

app.mount('#app')

// 应用 UI 设置（在挂载后调用以读取并应用）
const ui = useUiSettingsStore()
ui.load()