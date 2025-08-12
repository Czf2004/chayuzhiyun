import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AuthView from '../views/AuthView.vue'
// 引入新页面组件
import ManageView from '../views/ManageView.vue'
import DashboardView from '../views/DashboardView.vue'
import MonitorView from '../views/MonitorView.vue' // 可选
import PersonView from '../components/personalCenter/PersonView.vue'

const routes = [
  {
    path: '/',
    name: 'auth',
    component: AuthView,
    meta: { showNavbar: false }
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView,
    meta: { showNavbar: true }
  },
  // 添加茶园管理路由
  {
    path: '/manage',
    name: 'manage',
    component: ManageView,
    meta: { showNavbar: true } // 显示导航栏
  },
  // 添加数据中枢路由
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: { showNavbar: true }
  },
  // 可选：添加历史监控路由
  {
    path: '/monitor',
    name: 'monitor',
    component: MonitorView,
    meta: { showNavbar: true }
  },
  {
    path: '/person',
    name: 'person',
    component: PersonView,
    meta: { showNavbar: true }
  },
  // 404路由
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router