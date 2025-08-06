import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'  // 引入组件库
import 'element-plus/dist/index.css'    // 引入样式
import App from './App.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue' //导入 ElementPlus 组件库中的所有图标
import zhCn from 'element-plus/es/locale/lang/zh-cn';
const app = createApp(App)
//注册 ElementPlus 组件库中的所有图标到全局 Vue 应用中
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
        app.component(key, component)
    }
app.use(ElementPlus)  // 全局注册
app.use(createPinia())
app.use(ElementPlus, {
  locale: zhCn // 配置使用中文语言包
})
app.mount('#app')
