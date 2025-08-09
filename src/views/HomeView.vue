<template>
  <div class="home-view">
    <!-- 英雄区域 -->
    <section class="hero-section">
      <div class="hero-content">
        <h1>茶语智韵欢迎你！</h1>
        <p>重新定义智慧茶园管理方式，让每一片茶叶都茁壮成长</p>
        <div class="hero-buttons">
          <RouterLink class="primary-btn" to="/products">探索产品</RouterLink>
          <RouterLink class="secondary-btn" to="/technology">了解技术</RouterLink>
        </div>
      </div>
      <div class="hero-image">
        <img src="https://placeholder-for-hero-image.jpg" alt="智能茶园系统展示" />
      </div>
    </section>

    <!-- 核心优势 -->
    <section class="features-section">
      <div class="section-header">
        <h2>智慧茶园解决方案</h2>
        <p>融合物联网、人工智能与农业技术，打造现代化茶园管理体系</p>
      </div>
      
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">
            <img src="https://placeholder-for-sensing-icon.png" alt="智能感知" />
          </div>
          <h3>智能环境感知</h3>
          <p>24小时监测温度、湿度、光照、土壤养分等关键参数，数据精度达98%以上</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">
            <img src="https://placeholder-for-ai-icon.png" alt="AI分析" />
          </div>
          <h3>AI生长分析</h3>
          <p>基于机器学习的作物生长模型，精准预测生长周期，提前预警病虫害风险</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">
            <img src="https://placeholder-for-auto-icon.png" alt="自动控制" />
          </div>
          <h3>自动化管理</h3>
          <p>根据环境数据自动调节灌溉、施肥和遮阳，减少人工成本达70%以上</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">
            <img src="https://placeholder-for-data-icon.png" alt="数据管理" />
          </div>
          <h3>全周期数据管理</h3>
          <p>记录从种植到收获的全过程数据，生成生长报告和优化建议</p>
        </div>
      </div>
    </section>

    <!-- 产品展示区 -->
    <section class="product-showcase">
      <div class="section-header">
        <h2>特色产品系列</h2>
        <p>为不同规模茶园提供定制化智能解决方案</p>
      </div>
      
      <div class="product-grid">
        <div v-for="product in products" :key="product.id" class="product-card">
          <div class="product-image">
            <img :src="product.imageUrl" :alt="product.name" />
          </div>
          <div class="color-block" :style="{ background: product.color }"></div>
          <h3>{{ product.name }}</h3>
          <p>{{ product.description }}</p>
          <div class="product-features">
            <ul>
              <li v-for="(feature, index) in product.features" :key="index">{{ feature }}</li>
            </ul>
          </div>
          <RouterLink class="secondary-btn" :to="`/products/${product.id}`">查看详情</RouterLink>
        </div>
      </div>
    </section>

    <!-- 技术参数对比 -->
    <section class="specs-section">
      <div class="section-header">
        <h2>技术参数对比</h2>
        <p>选择最适合您茶园需求的智能系统</p>
      </div>
      
      <div class="specs-table-container">
        <table class="specs-table">
          <thead>
            <tr>
              <th>技术参数</th>
              <th>智能监测系统</th>
              <th>精准灌溉设备</th>
              <th>作物生长模型</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>监测范围</td>
              <td>温度、湿度、光照、CO₂</td>
              <td>土壤湿度、酸碱度</td>
              <td>生长周期、产量预测</td>
            </tr>
            <tr>
              <td>数据传输</td>
              <td>4G/5G/Wi-Fi</td>
              <td>4G/5G/Wi-Fi</td>
              <td>云端同步</td>
            </tr>
            <tr>
              <td>续航时间</td>
              <td>6-12个月</td>
              <td>持续供电</td>
              <td>无限制</td>
            </tr>
            <tr>
              <td>适用面积</td>
              <td>单设备覆盖500㎡</td>
              <td>单系统覆盖1000㎡</td>
              <td>无限制</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- 应用案例 -->
    <section class="cases-section">
      <div class="section-header">
        <h2>成功案例</h2>
        <p>来自全国各地茶园的应用反馈</p>
      </div>
      
      <div class="cases-grid">
        <div class="case-card">
          <img src="https://placeholder-for-case1.jpg" alt="案例图片" class="case-image" />
          <div class="case-content">
            <h3>西湖龙井茶园</h3>
            <p>应用智能监测系统后，茶叶品质提升15%，用水量减少30%，人力成本降低60%</p>
            <RouterLink to="/cases/1" class="case-link">查看详情 →</RouterLink>
          </div>
        </div>
        
        <div class="case-card">
          <img src="https://placeholder-for-case2.jpg" alt="案例图片" class="case-image" />
          <div class="case-content">
            <h3>安溪铁观音基地</h3>
            <p>全系列产品应用，实现亩产提升20%，病虫害发生率下降80%，能源消耗降低40%</p>
            <RouterLink to="/cases/2" class="case-link">查看详情 →</RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- 客户评价 -->
    <section class="testimonials-section">
      <div class="section-header">
        <h2>客户评价</h2>
        <p>听听他们怎么说</p>
      </div>
      
      <div class="testimonials-grid">
        <div class="testimonial-card">
          <div class="testimonial-text">
            "茶语智韵的智能系统彻底改变了我们的管理方式，现在即使不在茶园，也能实时掌握所有情况，决策更精准。"
          </div>
          <div class="testimonial-author">
            <img src="https://placeholder-for-user1.jpg" alt="用户头像" />
            <div>
              <h4>张经理</h4>
              <p>黄山毛峰茶园</p>
            </div>
          </div>
        </div>
        
        <div class="testimonial-card">
          <div class="testimonial-text">
            "精准灌溉设备帮我们节省了大量水资源，同时茶叶品质更加稳定，客户反馈非常好，值得投资。"
          </div>
          <div class="testimonial-author">
            <img src="https://placeholder-for-user2.jpg" alt="用户头像" />
            <div>
              <h4>李老板</h4>
              <p>武夷岩茶合作社</p>
            </div>
          </div>
        </div>
        
        <div class="testimonial-card">
          <div class="testimonial-text">
            "生长模型预测非常准确，让我们能够提前安排采摘和销售计划，经济效益提升明显。"
          </div>
          <div class="testimonial-author">
            <img src="https://placeholder-for-user3.jpg" alt="用户头像" />
            <div>
              <h4>王教授</h4>
              <p>茶叶研究所</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 咨询区域 -->
    <section class="contact-section">
      <div class="contact-content">
        <h2>获取专属茶园解决方案</h2>
        <p>填写下方表单，我们的技术顾问将为您提供定制化建议</p>
        <form class="contact-form">
          <div class="form-group">
            <label for="name">姓名</label>
            <input type="text" id="name" placeholder="请输入您的姓名" />
          </div>
          <div class="form-group">
            <label for="phone">电话</label>
            <input type="tel" id="phone" placeholder="请输入您的联系电话" />
          </div>
          <div class="form-group">
            <label for="茶园面积">茶园面积</label>
            <input type="text" id="茶园面积" placeholder="请输入您的茶园面积" />
          </div>
          <div class="form-group">
            <label for="需求">主要需求</label>
            <textarea id="需求" rows="4" placeholder="请描述您的主要需求"></textarea>
          </div>
          <button type="submit" class="primary-btn">提交咨询</button>
        </form>
      </div>
      <div class="contact-image">
        <img src="https://placeholder-for-contact-image.jpg" alt="专业咨询" />
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="app-footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3>关于我们</h3>
          <p>致力于发展智慧茶园，为茶叶产业提供全方位的智能化解决方案，推动传统农业向现代农业转型。</p>
          <div class="social-links">
            <a href="#"><img src="https://placeholder-for-weixin.png" alt="微信" /></a>
            <a href="#"><img src="https://placeholder-for-weibo.png" alt="微博" /></a>
            <a href="#"><img src="https://placeholder-for-youtube.png" alt="YouTube" /></a>
          </div>
        </div>
        
        <div class="footer-section">
          <h3>产品中心</h3>
          <ul>
            <li><RouterLink to="/products/1">智能监测系统</RouterLink></li>
            <li><RouterLink to="/products/2">精准灌溉设备</RouterLink></li>
            <li><RouterLink to="/products/3">作物生长模型</RouterLink></li>
            <li><RouterLink to="/products/4">茶园管理平台</RouterLink></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h3>技术支持</h3>
          <ul>
            <li><RouterLink to="/support/manual">用户手册</RouterLink></li>
            <li><RouterLink to="/support/video">教学视频</RouterLink></li>
            <li><RouterLink to="/support/faq">常见问题</RouterLink></li>
            <li><RouterLink to="/support/contact">联系客服</RouterLink></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h3>联系我们</h3>
          <p>地址：杭州市西湖区科技园A座15层</p>
          <p>电话：400-888-9999</p>
          <p>邮箱：info@chayuzhiyun.com</p>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy;{{ currentYear }} 茶语智韵. 保留所有权利.</p>
        <div class="footer-links">
          <RouterLink to="/privacy">隐私政策</RouterLink> | 
          <RouterLink to="/terms">使用条款</RouterLink> | 
          <RouterLink to="/sitemap">网站地图</RouterLink>
        </div>
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
    description: '实时监控茶园环境参数，为茶叶生长提供科学依据',
    color: '#8BC34A',
    imageUrl: 'https://placeholder-for-product1.jpg',
    features: [
      '多参数同步监测',
      '低功耗设计',
      'IP67防水等级',
      '云端数据存储'
    ]
  },
  {
    id: 2,
    name: '精准灌溉设备',
    description: '根据土壤湿度自动调节灌溉，节约用水提高效率',
    color: '#2196F3',
    imageUrl: 'https://placeholder-for-product2.jpg',
    features: [
      '智能流量控制',
      '分区独立管理',
      '用水量统计分析',
      '远程控制功能'
    ]
  },
  {
    id: 3,
    name: '作物生长模型',
    description: '预测作物生长周期和产量，优化种植计划',
    color: '#FF9800',
    imageUrl: 'https://placeholder-for-product3.jpg',
    features: [
      'AI产量预测',
      '病虫害预警',
      '采摘时间建议',
      '生长趋势分析'
    ]
  },
  {
    id: 4,
    name: '茶园管理平台',
    description: '整合所有设备数据，一站式管理茶园生产',
    color: '#9C27B0',
    imageUrl: 'https://placeholder-for-product4.jpg',
    features: [
      '数据可视化仪表盘',
      '多设备集中控制',
      '生产计划管理',
      '移动端实时查看'
    ]
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
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto 3rem;
}

.hero-content h1 {
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.hero-content p {
  font-size: 1.3rem;
  margin-bottom: 2.5rem;
  font-weight: 300;
  line-height: 1.6;
}

.hero-buttons {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
}

.hero-image img {
  max-width: 100%;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  max-height: 500px;
  object-fit: cover;
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
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.primary-btn:hover {
  background-color: #3d8b40;
  transform: translateY(-2px);
}

/* 特性区域样式 */
.features-section {
  padding: 6rem 5%;
  background-color: #f9f9f9;
}

.features-grid {
  display: grid;: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 3rem;
  margin-top: 4rem;
}

.feature-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s, box-shadow 0.3s;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  width: 100px;
  height: 100px;
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(76, 175, 80, 0.1);
  border-radius: 50%;
}

.feature-icon img {
  max-width: 60px;
  max-height: 60px;
}

.feature-card h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #333;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
}

/* 产品展示区 */
.product-showcase {
  padding: 6rem 5%;
  background-color: #fff;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-header h2 {
  font-size: 2.5rem;
  margin-bottom: 0.8rem;
  position: relative;
  display: inline-block;
}

.section-header h2:after {
  content: "";
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 3px;
  background-color: #4caf50;
}

.section-header p {
  font-size: 1.2rem;
  font-weight: 300;
  color: #666;
  max-width: 700px;
  margin: 0 auto;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
}

.product-card {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s, box-shadow 0.3s;
  padding: 1.5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.12);
}

.product-image {
  margin-bottom: 1.5rem;
  border-radius: 6px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.5s;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.color-block {
  width: 100%;
  height: 180px;
  border-radius: 6px;
  margin-bottom: 1.5rem;
}

.product-features {
  margin: 1rem 0 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.product-features ul {
  list-style: none;
  padding: 0;
  text-align: left;
  margin: 0 auto;
  max-width: 250px;
}

.product-features li {
  margin-bottom: 0.5rem;
  padding-left: 1.5rem;
  position: relative;
  color: #666;
}

.product-features li:before {
  content: "•";
  position: absolute;
  left: 0;
  color: #4caf50;
  font-weight: bold;
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
  margin-top: auto;
}

.secondary-btn:hover {
  background-color: #e0e0e0;
  color: #333;
}

/* 技术参数区域 */
.specs-section {
  padding: 6rem 5%;
  background-color: #f9f9f9;
  overflow-x: auto;
}

.specs-table-container {
  max-width: 1200px;
  margin: 0 auto;
}

.specs-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.specs-table th, .specs-table td {
  padding: 1.2rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.specs-table th {
  background-color: #f5f5f5;
  font-weight: 600;
}

.specs-table tr:last-child td {
  border-bottom: none;
}

.specs-table tr:hover {
  background-color: #f9f9f9;
}

/* 案例区域 */
.cases-section {
  padding: 6rem 5%;
  background-color: #fff;
}

.cases-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 3rem;
}

.case-card {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s;
}

.case-card:hover {
  transform: translateY(-5px);
}

.case-image {
  height: 220px;
  overflow: hidden;
}

.case-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.case-card:hover .case-image img {
  transform: scale(1.05);
}

.case-content {
  padding: 1.8rem;
}

.case-content h3 {
  font-size: 1.4rem;
  margin-bottom: 1rem;
  color: #333;
}

.case-content p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.case-link {
  color: #4caf50;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.case-link:hover {
  color: #3d8b40;
  text-decoration: underline;
}

/* 客户评价区域 */
.testimonials-section {
  padding: 6rem 5%;
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.05), rgba(33, 150, 243, 0.05));
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2.5rem;
  margin-top: 4rem;
}

.testimonial-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 2.5rem 2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  position: relative;
}

.testimonial-card:before {
  position: absolute;
  top: 20px;
  left: 20px;
  font-size: 5rem;
  color: rgba(76, 175, 80, 0.1);
  font-family: Georgia, serif;
  line-height: 1;
}

.testimonial-text {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #555;
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
  padding-left: 1rem;
}

.testimonial-author {
  display: flex;
  align-items: center;
}

.testimonial-author img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 1.2rem;
}

.testimonial-author h4 {
  font-size: 1.1rem;
  margin: 0 0 0.2rem;
  color: #333;
}

.testimonial-author p {
  font-size: 0.9rem;
  color: #777;
  margin: 0;
}

/* 咨询区域 */
.contact-section {
  --max-width: 1200px;   /* 自己定一个值 */
  max-width: var(--max-width);
  margin: 0 auto;        /* 水平居中关键 */
  padding: 6rem 5%;
  background-color: #fff;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.contact-content h2 {
  font-size: 2.2rem;
  margin-bottom: 1.5rem;
  color: #333;
}

.contact-content p {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2.5rem;
  line-height: 1.6;
}

.contact-form {
  max-width: 500px;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #4caf50;
  outline: none;
}

.contact-image img {
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

/* 页脚样式 */
.app-footer {
  background-color: #333;
  color: #fff;
  padding: 5rem 5% 2rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
  margin-bottom: 3rem;
}

.footer-section h3 {
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
  color: #4caf50;
  position: relative;
  padding-bottom: 0.8rem;
}

.footer-section h3:after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 2px;
  background-color: #4caf50;
}

.footer-section p {
  color: #ccc;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section ul li {
  margin-bottom: 0.8rem;
}

.footer-section a {
  color: #ccc;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-section a:hover {
  color: #4caf50;
}

.social-links {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.social-links img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  transition: transform 0.3s;
}

.social-links img:hover {
  transform: scale(1.1);
}

.footer-bottom {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid #444;
  color: #999;
}

.footer-links {
  margin-top: 1rem;
}

.footer-links a {
  color: #999;
  margin: 0 0.5rem;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-links a:hover {
  color: #4caf50;
}

/* 响应式调整 */
@media (max-width: 992px) {
  .contact-section {
    grid-template-columns: 1fr;
  }
  
  .hero-content h1 {
    font-size: 2.8rem;
  }
  
  .section-header h2 {
    font-size: 2.2rem;
  }
}

@media (max-width: 768px) {
  .navbar {
    flex-wrap: wrap;
    height: auto;
    padding: 1rem 5%;
  }
  
  .nav-links {
    margin-top: 1rem;
    width: 100%;
    justify-content: center;
    gap: 1.5rem;
  }
  
  .hero-content h1 {
    font-size: 2.2rem;
  }
  
  .hero-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .features-grid,
  .cases-grid,
  .testimonials-grid {
    grid-template-columns: 1fr;
  }
}
</style>
