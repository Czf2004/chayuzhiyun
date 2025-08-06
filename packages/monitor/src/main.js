import { createApp } from 'vue'
import App from './App.vue'
// 引入 Element Plus 组件库
import ElementPlus from 'element-plus'
// 引入 Element Plus 样式
import 'element-plus/dist/index.css'
// 引入 Element Plus 中文语言包
import zhCn from 'element-plus/es/locale/lang/zh-cn'

const app = createApp(App)
// 全局注册 Element Plus，配置中文语言
app.use(ElementPlus, {
    locale: zhCn
})
app.mount('#app')