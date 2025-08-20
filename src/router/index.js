import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AuthView from '../views/AuthView.vue'
// 引入新页面组件
import ManageView from '../views/ManageView.vue'
import DashboardView from '../views/DashboardView.vue'
import MonitorView from '../views/MonitorView.vue' // 可选
import PersonView from '../components/personalCenter/PersonView.vue'
import UserManagementView from '../views/UserManagementView.vue'
import DeviceManagementView from '../views/DeviceManagementView.vue'
import { useUserStore } from '@/stores/userStore'
import SystemSettingsView from '../views/SystemSettingsView.vue'
import OpsDashboard from '../views/ops/Dashboard.vue'
import ProductManagement from '../views/ops/ProductManagement.vue'
import QuotationCreation from '../views/ops/QuotationCreation.vue'
import { ElMessage } from 'element-plus'
import ToolkitView from '../views/ToolkitView.vue'
import ToolkitDocView from '../views/ToolkitDocView.vue'

const routes = [
  {
    path: '/',
    name: 'auth',
    component: AuthView,
    meta: { showNavbar: false, requiresAuth: false }
  },
  {
    path: '/toolkit',
    name: 'toolkit',
    component: ToolkitView,
    meta: { showNavbar: true, requiresAuth: true }
  },
  {
    path: '/toolkit/docs/:key',
    name: 'toolkit-docs',
    component: ToolkitDocView,
    meta: { showNavbar: true, requiresAuth: true }
  },
  {
    path: '/ops',
    name: 'ops-dashboard',
    component: OpsDashboard,
    meta: { showNavbar: true, requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/ops/products',
    name: 'ops-products',
    component: ProductManagement,
    meta: { showNavbar: true, requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/ops/quotations',
    name: 'ops-quotations',
    component: QuotationCreation,
    meta: { showNavbar: true, requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/auth',
    name: 'auth-alias',
    component: AuthView,
    meta: { showNavbar: false, requiresAuth: false }
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView,
    meta: { showNavbar: true, requiresAuth: true }
  },
  // 添加茶园管理路由
  {
    path: '/manage',
    name: 'manage',
    component: ManageView,
    meta: { showNavbar: true, requiresAuth: true } // 显示导航栏
  },
  // 添加数据中枢路由
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: { showNavbar: true, requiresAuth: true }
  },
  // 可选：添加历史监控路由
  {
    path: '/monitor',
    name: 'monitor',
    component: MonitorView,
    meta: { showNavbar: true, requiresAuth: true }
  },
  {
    path: '/person',
    name: 'person',
    component: PersonView,
    meta: { showNavbar: true, requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'settings',
    component: SystemSettingsView,
    meta: { showNavbar: true, requiresAuth: true }
  },
  {
    path: '/user-management',
    name: 'user-management',
    component: UserManagementView,
    meta: { showNavbar: true, requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/device-management',
    name: 'device-management',
    component: DeviceManagementView,
    meta: { showNavbar: true, requiresAuth: true, requiresAdmin: true }
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

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const isLoggedIn = userStore.isLoggedIn
  const userRole = userStore.getUserInfo.role
  
  // 如果路由需要认证
  if (to.meta.requiresAuth) {
    // 如果未登录，重定向到登录页
    if (!isLoggedIn) {
      next('/auth')
      return
    }
    
    // 如果路由需要管理员权限
    if (to.meta.requiresAdmin && userRole !== 'admin') {
      ElMessage.error('您没有权限访问此页面')
      next('/home')
      return
    }
  }
  
  // 如果已登录且访问登录页，重定向到首页
  if (to.name === 'auth' && isLoggedIn) {
    next('/home')
    return
  }
  
  next()
})

export default router