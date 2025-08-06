<template>
  <div class="home-view">
    <section class="hero-section">
      <div class="hero-content">
        <h1>茶语智韵欢迎你！</h1>
        <p>智能茶园系统为你服务</p>
        <RouterLink class="primary-btn" to="/products">探索产品</RouterLink>
      </div>
    </section>

    <!-- 产品展示区 -->
    <section class="product-showcase">
      <div class="section-header">
        <h2>特色产品</h2>
        <p>探索我们的优质农业产品</p>
      </div>
      
      <div class="product-grid">
        <div v-for="product in products" :key="product.id" class="product-card">
          <div class="color-block" :style="{ background: product.color }"></div>
          <h3>{{ product.name }}</h3>
          <p>{{ product.description }}</p>
          <RouterLink class="secondary-btn" :to="`/products/${product.id}`">查看详情</RouterLink>
        </div>
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="app-footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3>关于我们</h3>
          <p>致力于发展智慧茶园</p>
        </div>
        <div class="footer-section">
          <h3>快速链接</h3>
          <ul>
            <li><RouterLink to="/privacy">隐私政策</RouterLink></li>
            <li><RouterLink to="/terms">使用条款</RouterLink></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy;{{ currentYear }} 茶语智韵. 保留所有权利.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'

// 响应式数据
const isAuthenticated = ref(false)
const user = ref({ name: '用户' })
const currentYear = computed(() => new Date().getFullYear())

// 产品数据
const products = ref([
  {
    id: 1,
    name: '智能监测系统',
    description: '实时监控茶园环境参数',
    color: '#8BC34A'
  },
  {
    id: 2,
    name: '精准灌溉设备',
    description: '根据土壤湿度自动调节灌溉',
    color: '#2196F3'
  },
  {
    id: 3,
    name: '作物生长模型',
    description: '预测作物生长周期和产量',
    color: '#FF9800'
  }
])

// 方法
const handleLogout = () => {
  isAuthenticated.value = false
}
</script>

<style scoped>
/* 全局样式 */
.agriculture-system {
  font-family: Segoe UI, Tahoma, Geneva, Verdana, sans-serif;
  background-size: cover;
  background-position: 50%;
  background-attachment: fixed;
  color:#333;
  min-height: 40vh;
}

/* 导航栏样式 */
.navbar {
  display: flex;
  justify-content: space-between;
  padding: 1.5rem 5%;
  background-color: hsla(0, 0%, 100%, 0.9);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  height: 20px;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
}

.logo-img {
  height: 40px;
  margin-right: 10px;
}

.logo-text {
  font-size: 1.4rem;
  font-weight: 700;
  margin-left: 40px;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 2rem;
}

.nav-link {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  transition: color 0.3s;
  padding: 0.5rem 0;
  position: relative;
}

.nav-link:after {
  content: "";
  position: absolute;
  width: 0;
  height: 2px;
  bottom: 0;
  left: 0;
  background-color: #4caf50;
  transition: width 0.3s;
}

.nav-link:hover:after {
  width: 100%;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-name {
  font-weight: 500;
}

.login-btn, .register-btn {
  padding: 0.5rem 1.2rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s;
}

.login-btn {
  color: #2196f3;
  border: 1px solid #2196f3;
}

.register-btn {
  background-color: #4caf50;
  color: #fff;
}

.login-btn:hover {
  background-color: rgba(33, 150, 243, 0.1);
}

.register-btn:hover {
  background-color: #3d8b40;
}

.logout-btn {
  padding: 0.5rem 1.2rem;
  background-color: #f44336;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s;
}

.logout-btn:hover {
  background-color: #d32f2f;
}

/* 主要内容区样式 */
.hero-section {
  padding: 5rem 5%;
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(33, 150, 243, 0.1));
  text-align: center;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-content h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.hero-content p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  font-weight: 300;
}

.primary-btn {
  display: inline-block;
  padding: 0.8rem 2rem;
  background-color: #4caf50;
  color: #fff;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 500;
  transition: background-color 0.3s, transform 0.3s;
}

.primary-btn:hover {
  background-color: #3d8b40;
  transform: translateY(-2px);
}

/* 产品展示区 */
.product-showcase {
  padding: 4rem 5%;
  background-color: #fff;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-header h2 {
  font-size: 2.2rem;
  margin-bottom: 0.5rem;
}

.section-header p {
  font-size: 1.2rem;
  font-weight: 300;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.product-card {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  padding: 1.5rem;
  text-align: center;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.color-block {
  width: 100%;
  height: 180px;
  border-radius: 6px;
  margin-bottom: 1.2rem;
}

.secondary-btn {
  display: inline-block;
  padding: 0.6rem 1.5rem;
  background-color: #f5f5f5;
  color: #333;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 500;
  transition: background-color 0.3s, color 0.3s;
}

.secondary-btn:hover {
  background-color: #e0e0e0;
  color: #333;
}

/* 页脚样式 */
.app-footer {
  background-color: #333;
  color: #fff;
  padding: 3rem 5% 1rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section h3 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #4caf50;
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section ul li {
  margin-bottom: 0.5rem;
}

.footer-section a {
  color: #ccc;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-section a:hover {
  color: #fff;
}

.footer-bottom {
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid #444;
  color: #999;
}
</style>