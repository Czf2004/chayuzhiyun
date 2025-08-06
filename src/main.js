import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// 引入Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 引入Element Plus图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 引入中文语言包
import zhCn from 'element-plus/es/locale/lang/zh-cn'
// 引入Pinia
import { createPinia } from 'pinia'

const app = createApp(App)
const pinia = createPinia()

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// .use() 顺序：pinia → router → ElementPlus
app.use(pinia)
app.use(router)
app.use(ElementPlus, {
  locale: zhCn // 配置中文
})

app.mount('#app')