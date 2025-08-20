<template>
  <div class="home-view">
    <!-- Hero区域 -->
    <section class="hero-section">
      <div class="hero-background" :style="{ backgroundImage: `url(${images.hero.main})` }"></div>
      <div class="hero-container">
      <div class="hero-content">
          <div class="hero-badge">
            <RocketLaunchIcon class="hero-badge-icon" />
            <span>一句话，让AI替你打理茶园生意</span>
          </div>
          <h1 class="hero-title">
            茶智云
            <span class="gradient-text">AI驱动增长，重塑茶业利润空间</span>
          </h1>
          <p class="hero-subtitle">
            一站式智能运营系统，为您的茶园注入增长基因。告别凭经验决策、客户流失、营销低效的困境。
          </p>
        <div class="hero-buttons">
            <button class="primary-btn">立即体验</button>
            <button class="secondary-btn">观看视频</button>
        </div>
      </div>
      </div>
    </section>

    <!-- 价值主张区域 -->
    <section class="value-section">
      <div class="container">
        <div class="value-header">
          <h2 class="section-title">老板，您是否也曾为这些事头疼？</h2>
          <p class="section-subtitle">传统茶业经营中的三大痛点，我们深有体会</p>
        </div>
        
        <div class="value-grid">
          <div class="value-card" v-motion-slide-visible-once-bottom>
            <div class="value-card-header">
              <div class="value-icon-wrapper">
                <ChartBarIcon class="value-icon" />
              </div>
              <h3>报表太多看不懂</h3>
            </div>
            <p>采购、销售、库存报表一大堆，数据冰冷，看不出门道，更不知道下一步该干啥。</p>
            <div class="value-impact">
              <span class="impact-label">影响：</span>
              <span class="impact-text">决策滞后，错失商机</span>
            </div>
          </div>
          
          <div class="value-card" v-motion-slide-visible-once-bottom>
            <div class="value-card-header">
              <div class="value-icon-wrapper">
                <FlagIcon class="value-icon" />
              </div>
              <h3>决策全靠拍脑袋</h3>
            </div>
            <p>该进什么货？进多少？该给谁促销？库存怎么处理？每次决策都像一场赌博，心里没底。</p>
            <div class="value-impact">
              <span class="impact-label">影响：</span>
              <span class="impact-text">库存积压，资金浪费</span>
            </div>
          </div>
          
          <div class="value-card" v-motion-slide-visible-once-bottom>
            <div class="value-card-header">
              <div class="value-icon-wrapper">
                <BoltIcon class="value-icon" />
              </div>
              <h3>效率太低忙不过来</h3>
            </div>
            <p>每天时间都耗在琐事上：查数据、算利润、盯库存，根本没空思考发展、拜访客户。</p>
            <div class="value-impact">
              <span class="impact-label">影响：</span>
              <span class="impact-text">精力分散，发展受限</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 解决方案区域 -->
    <section class="solution-section">
      <div class="container">
        <div class="solution-header">
          <h2 class="section-title">「茶智云」如何解决？</h2>
          <p class="section-subtitle">不是简单的工具，而是您的智能商业伙伴</p>
        </div>
        
        <div class="solution-content">
          <div class="solution-main">
            <div class="solution-text">
              <h3>核心就一点：让数据为您工作</h3>
              <p>把您从"操作软件"中解放出来，直接"享用结果"。您动嘴，它动手。它不是新工具，是您大脑和双手的延伸。</p>
              
              <div class="solution-features">
                <div class="solution-feature">
                  <div class="feature-icon">
                    <SparklesIcon class="feature-svg" />
                  </div>
                  <div class="feature-content">
                    <h4>智能决策</h4>
                    <p>AI分析海量数据，为您提供精准的商业洞察</p>
                  </div>
                </div>
                
                <div class="solution-feature">
                  <div class="feature-icon">
                    <BoltIcon class="feature-svg" />
                  </div>
                  <div class="feature-content">
                    <h4>自动化运营</h4>
                    <p>减少重复性工作，让您专注于核心业务</p>
                  </div>
                </div>
                
                <div class="solution-feature">
                  <div class="feature-icon">
                    <ArrowTrendingUpIcon class="feature-svg" />
                  </div>
                  <div class="feature-content">
                    <h4>持续增长</h4>
                    <p>数据驱动的增长策略，让利润持续提升</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="solution-visual">
              <div class="solution-image-container">
                <img :src="images.hero.main" alt="茶智云解决方案" class="solution-image" />
                <div class="solution-overlay"></div>
                <div class="floating-stats">
                  <div class="stat-item">
                    <div class="stat-number">85%</div>
                    <div class="stat-label">决策效率提升</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-number">60%</div>
                    <div class="stat-label">运营成本降低</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="solution-cta">
            <div class="cta-content">
              <h3>准备好让您的茶园生意更上一层楼了吗？</h3>
              <p>立即体验茶智云，开启智能经营新时代</p>
              <div class="cta-buttons">
                <button class="primary-btn">免费试用</button>
                <button class="secondary-btn">预约演示</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 四大功能模块展示区 -->
    <section class="features-section">
      <div class="container">
        <h2 class="section-title">您的四大智能部门，全天候待命</h2>
        <p class="section-subtitle">不是简单的功能堆砌，而是四个专业团队24小时为您服务</p>
        
        <div class="features-nav">
          <button 
            v-for="(feature, index) in features" 
            :key="index"
            :class="['feature-nav-btn', { active: activeFeature === index }]"
            @click="activeFeature = index"
          >
            <component :is="feature.icon" class="feature-nav-icon" />
            {{ feature.title }}
          </button>
        </div>

        <div class="features-content">
          <div class="feature-details" v-motion-slide-visible-once-left>
            <div class="feature-badge">{{ features[activeFeature].badge }}</div>
            <h3 class="feature-title">{{ features[activeFeature].title }}</h3>
            <div class="feature-slogan">{{ features[activeFeature].slogan }}</div>
            <p class="feature-description">{{ features[activeFeature].description }}</p>
            <ul class="feature-points">
              <li v-for="point in features[activeFeature].points" :key="point">
                <CheckCircleIcon class="point-icon" />
                {{ point }}
              </li>
            </ul>
          </div>
          <div class="feature-visual" v-motion-slide-visible-once-right>
            <div class="feature-image-container">
              <img :src="features[activeFeature].image" :alt="features[activeFeature].title" />
              <div class="feature-overlay"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 数据驱动证明区域 -->
    <section class="stats-section">
      <div class="container">
        <h2 class="section-title">用数据说话，效果看得见</h2>
        <div class="stats-grid">
          <div class="stat-card" v-motion-slide-visible-once-bottom>
            <div class="stat-number">{{ stats.growth }}%</div>
            <p>平均利润提升</p>
      </div>
          <div class="stat-card" v-motion-slide-visible-once-bottom>
            <div class="stat-number">{{ stats.cost }}%</div>
            <p>运营成本降低</p>
          </div>
          <div class="stat-card" v-motion-slide-visible-once-bottom>
            <div class="stat-number">{{ stats.efficiency }}%</div>
            <p>决策效率提升</p>
        </div>
          <div class="stat-card" v-motion-slide-visible-once-bottom>
            <div class="stat-number">{{ stats.satisfaction }}%</div>
            <p>客户满意度</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 对比表格区域 -->
    <section class="comparison-section">
      <div class="container">
        <h2 class="section-title">传统方式 vs 茶智云，差距一目了然</h2>
        <p class="section-subtitle">数据不会说谎，选择决定未来</p>
        
        <div class="comparison-table">
          <div class="table-header">
            <div class="header-cell"></div>
            <div class="header-cell">传统方式</div>
            <div class="header-cell">茶智云</div>
          </div>
          
          <div class="table-row" v-for="(item, index) in comparisonData" :key="index">
            <div class="row-label">{{ item.feature }}</div>
            <div class="row-value traditional">
              <span class="status-icon">❌</span>
              {{ item.traditional }}
            </div>
            <div class="row-value modern">
              <span class="status-icon">✅</span>
              {{ item.modern }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 客户评价区域 -->
    <section class="testimonials-section">
      <div class="container">
        <h2 class="section-title">客户怎么说</h2>
        <p class="section-subtitle">真实客户，真实反馈</p>
        
        <div class="testimonials-grid">
          <div class="testimonial-card" v-for="(testimonial, index) in testimonials" :key="index" v-motion-slide-visible-once-bottom>
            <div class="testimonial-header">
              <img :src="testimonial.avatar" :alt="testimonial.name" class="testimonial-avatar" />
              <div class="testimonial-info">
                <h4 class="testimonial-name">{{ testimonial.name }}</h4>
                <p class="testimonial-title">{{ testimonial.title }}</p>
                <div class="testimonial-rating">
                  <StarIcon class="star-icon filled" />
                  <StarIcon class="star-icon filled" />
                  <StarIcon class="star-icon filled" />
                  <StarIcon class="star-icon filled" />
                  <StarIcon class="star-icon filled" />
                </div>
              </div>
            </div>
            <div class="testimonial-content">
              <p>"{{ testimonial.content }}"</p>
            </div>
            <div class="testimonial-stats">
              <div class="stat-item">
                <span class="stat-label">利润提升</span>
                <span class="stat-value">+{{ testimonial.profit }}%</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">效率提升</span>
                <span class="stat-value">+{{ testimonial.efficiency }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA区域 -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <div class="cta-left">
            <div class="cta-badge">
              <span>🎯 限时优惠</span>
            </div>
            <h2 class="cta-title">准备好让AI为您的茶业注入增长基因了吗？</h2>
            <p class="cta-subtitle">不再是梦想，而是现在就能实现的未来</p>
            
            <div class="cta-benefits">
              <div class="benefit-item">
                <span class="benefit-icon">🚀</span>
                <span>7天免费试用，零风险体验</span>
              </div>
              <div class="benefit-item">
                <span class="benefit-icon">💰</span>
                <span>新用户专享8折优惠</span>
              </div>
              <div class="benefit-item">
                <span class="benefit-icon">🎁</span>
                <span>免费获得价值5000元运营方案</span>
              </div>
              <div class="benefit-item">
                <span class="benefit-icon">📞</span>
                <span>专属顾问1对1服务</span>
              </div>
            </div>
            
            <div class="cta-buttons">
              <button class="cta-primary-btn">
                <span class="btn-icon">🎯</span>
                立即免费试用
              </button>
              <button class="cta-secondary-btn">
                <span class="btn-icon">📞</span>
                预约专家演示
              </button>
            </div>
            
            <div class="cta-stats">
              <div class="cta-stat">
                <span class="stat-number">5000+</span>
                <span class="stat-label">茶企信赖</span>
              </div>
              <div class="cta-stat">
                <span class="stat-number">98%</span>
                <span class="stat-label">客户满意度</span>
              </div>
              <div class="cta-stat">
                <span class="stat-number">24h</span>
                <span class="stat-label">响应时间</span>
              </div>
            </div>
          </div>
          
          <div class="cta-right">
            <div class="cta-visual">
              <div class="cta-image-container">
                <img :src="images.contact" alt="茶智云咨询" class="cta-image" />
                <div class="cta-overlay"></div>
              </div>
              <div class="cta-floating-card">
                <div class="floating-card-header">
                  <div class="avatar-group">
                    <img :src="images.avatars.user1" alt="客户1" class="mini-avatar" />
                    <img :src="images.avatars.user2" alt="客户2" class="mini-avatar" />
                    <img :src="images.avatars.user3" alt="客户3" class="mini-avatar" />
                  </div>
                  <div class="floating-card-text">
                    <p class="floating-title">实时咨询中</p>
                    <p class="floating-subtitle"><span class="count-number">{{ liveConsultationCount }}</span>位客户正在咨询</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="cta-bottom">
          <div class="trust-badges">
            <div class="trust-badge">
              <ShieldCheckIcon class="badge-icon" />
              <span>数据安全</span>
            </div>
            <div class="trust-badge">
              <BoltIcon class="badge-icon" />
              <span>快速部署</span>
            </div>
            <div class="trust-badge">
              <FlagIcon class="badge-icon" />
              <span>精准服务</span>
            </div>
            <div class="trust-badge">
              <StarIcon class="badge-icon" />
              <span>品质保证</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <div class="footer-logo">
              <h3>茶智云</h3>
              <p>AI驱动增长，重塑茶业利润空间</p>
            </div>
            <div class="footer-social">
              <a href="#" class="social-link">
                <img :src="images.social.weixin" alt="微信" class="social-icon" />
              </a>
              <a href="#" class="social-link">
                <img :src="images.social.weibo" alt="微博" class="social-icon" />
              </a>
              <a href="#" class="social-link">
                <img :src="images.social.youtube" alt="抖音" class="social-icon" />
              </a>
            </div>
          </div>
          
          <div class="footer-section">
            <h4>产品服务</h4>
            <ul class="footer-links">
              <li><a href="#">茶界天眼Pro</a></li>
              <li><a href="#">客户印钞机</a></li>
              <li><a href="#">利润加速器</a></li>
              <li><a href="#">智慧茶园</a></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h4>解决方案</h4>
            <ul class="footer-links">
              <li><a href="#">茶叶批发商</a></li>
              <li><a href="#">茶企品牌</a></li>
              <li><a href="#">茶园基地</a></li>
              <li><a href="#">茶艺馆</a></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h4>支持服务</h4>
            <ul class="footer-links">
              <li><a href="#">帮助中心</a></li>
              <li><a href="#">在线客服</a></li>
              <li><a href="#">培训课程</a></li>
              <li><a href="#">API文档</a></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h4>联系我们</h4>
            <div class="contact-info">
              <p><PhoneIcon class="contact-icon" /> 400-888-8888</p>
              <p><EnvelopeIcon class="contact-icon" /> contact@chayuzhiyun.com</p>
              <p><MapPinIcon class="contact-icon" /> 杭州市西湖区文三路</p>
            </div>
          </div>
        </div>
        
        <div class="footer-bottom">
          <div class="footer-bottom-content">
            <p>&copy; 2025 茶智云. 保留所有权利.</p>
            <div class="footer-bottom-links">
              <a href="#">隐私政策</a>
              <a href="#">服务条款</a>
              <a href="#">Cookie政策</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { images } from '@/assets/images.js'
import { 
  RocketLaunchIcon, 
  ChartBarIcon, 
  FlagIcon, 
  BoltIcon,
  ShieldCheckIcon,
  SparklesIcon,
  EyeIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  CpuChipIcon,
  CheckCircleIcon,
  StarIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon
} from '@heroicons/vue/24/outline'

const activeFeature = ref(0)
const liveConsultationCount = ref(3)

// 实时咨询数字随机变化
let consultationTimer = null

const updateConsultationCount = () => {
  // 在2-8之间随机变化
  const min = 2
  const max = 8
  const newCount = Math.floor(Math.random() * (max - min + 1)) + min
  
  // 避免连续相同的数字
  if (newCount !== liveConsultationCount.value) {
    liveConsultationCount.value = newCount
  }
}

onMounted(() => {
  // 每3-8秒随机更新一次数字
  const startTimer = () => {
    consultationTimer = setTimeout(() => {
      updateConsultationCount()
      startTimer() // 递归调用，确保每次间隔都不同
    }, Math.random() * 5000 + 3000) // 3-8秒随机间隔
  }
  
  startTimer()
})

onUnmounted(() => {
  if (consultationTimer) {
    clearInterval(consultationTimer)
  }
})

const features = [
  {
    title: "茶界天眼Pro",
    badge: "企业战略情报部",
    slogan: "一眼看穿市场，决策快人一步",
    description: "避免决策失误，发现蓝海市场。让您比竞争对手更早发现商机，更准确把握趋势。",
    points: [
      "全网竞品监控，竞争对手动态一目了然",
      "渠道动态监控，掌握市场变化先机",
      "舆情热点挖掘，抓住营销关键时机",
      "原料行情预警，采购时机精准把控",
      "爆品拆解报告，成功模式快速复制"
    ],
    image: images.products.monitoring,
    icon: EyeIcon
  },
  {
    title: "客户印钞机",
    badge: "企业精准营销部",
    slogan: "让每个客户都成为利润源泉",
    description: "提升客户终身价值，低成本激活沉默客户。把一次性买家变成终身顾客。",
    points: [
      "AI客户画像2.0，比客户更懂客户需求",
      "朋友圈AI导演，内容营销自动化",
      "企业微信SOP，客户跟进标准化",
      "利润看板，客户价值数字化",
      "沉默客户激活流水线，唤醒沉睡资产"
    ],
    image: images.products.irrigation,
    icon: UserGroupIcon
  },
  {
    title: "利润加速器",
    badge: "企业品牌与销售部",
    slogan: "不只是卖茶，更是卖价值",
    description: "打造品牌溢价，将产品卖出高价。让您的茶叶从商品变成艺术品。",
    points: [
      "区块链级溯源，产品故事数字化",
      "AI卖点生成器，产品文案自动优化",
      "智能报价单，定价策略科学化",
      "高客单价SOP，销售话术标准化",
      "动态利润看板，盈利状况实时监控"
    ],
    image: images.products.growth,
    icon: ArrowTrendingUpIcon
  },
  {
    title: "智慧茶园轻量版",
    badge: "企业供应链优化部",
    slogan: "科技种茶，品质可控",
    description: "提升品质，稳定产量，降低成本。让传统茶园插上科技翅膀。",
    points: [
      "无人机AI巡园，茶园状况全景掌控",
      "气象与灾情预警，风险管理自动化",
      "采茶最优规划，人力成本最小化",
      "农资成本分析，投入产出比优化"
    ],
    image: images.products.platform,
    icon: CpuChipIcon
  }
]

const stats = ref({
  growth: 0,
  cost: 0,
  efficiency: 0,
  satisfaction: 0
})

// 对比表格数据
const comparisonData = [
  {
    feature: "决策方式",
    traditional: "凭经验拍脑袋",
    modern: "AI数据分析驱动"
  },
  {
    feature: "客户管理",
    traditional: "手动记录，容易遗漏",
    modern: "AI智能画像，精准营销"
  },
  {
    feature: "库存管理",
    traditional: "人工盘点，误差大",
    modern: "智能预警，自动补货"
  },
  {
    feature: "营销效果",
    traditional: "广撒网，转化率低",
    modern: "精准投放，ROI提升300%"
  },
  {
    feature: "数据分析",
    traditional: "Excel表格，耗时费力",
    modern: "实时看板，一目了然"
  },
  {
    feature: "成本控制",
    traditional: "事后发现，损失已定",
    modern: "事前预警，主动优化"
  }
]

// 客户评价数据
const testimonials = [
  {
    name: "张总",
    title: "西湖龙井茶业 CEO",
    avatar: images.avatars.user1,
    content: "茶智云让我们的决策从拍脑袋变成了数据驱动，利润提升了45%，员工效率也大幅提升。",
    profit: 45,
    efficiency: 60
  },
  {
    name: "李女士",
    title: "碧螺春茶庄 创始人",
    avatar: images.avatars.user2,
    content: "客户印钞机功能太棒了！我们的复购率从30%提升到了78%，客户满意度也达到了98%。",
    profit: 52,
    efficiency: 75
  },
  {
    name: "王老板",
    title: "铁观音批发商",
    avatar: images.avatars.user3,
    content: "茶界天眼Pro帮我发现了新的市场机会，库存周转率提升了3倍，资金利用率大幅提高。",
    profit: 38,
    efficiency: 85
  }
]

// 模拟动态计数效果（当前模板中直接显示数值）

// 组件挂载后启动动画
onMounted(() => {
  // 滚动触发动画（实际项目中建议结合IntersectionObserver）
  setTimeout(() => {
    stats.value = {
      growth: 47,
      cost: 28,
      efficiency: 65,
      satisfaction: 96
    }
  }, 1000)
})
</script>

<style scoped>
/* 全局样式 */
.home-view {
  min-height: 100vh;
  background: #ffffff;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Hero区域 */
.hero-section {
  position: relative;
  height: 100vh;
  min-height: 600px;
  background: linear-gradient(135deg, #1e293b 0%, #334155 50%, #1e293b 100%);
  color: white;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: cover;
  background-position: center;
  opacity: 0.3;
}

.hero-background::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
}

.hero-container {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.hero-content {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 0.75rem 1.25rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #059669;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-decoration: none;
  cursor: default;
  line-height: 1;
}

.hero-badge-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #059669;
  margin-right: 0.5rem;
  flex-shrink: 0;
  display: inline-block;
  vertical-align: middle;
}

.hero-badge span {
  color: #059669;
  font-weight: 500;
  line-height: 1;
  vertical-align: middle;
}

.hero-title {
  font-size: 4rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;
}

.gradient-text {
  display: block;
  margin-top: 0.5rem;
  background: linear-gradient(135deg, #10b981, #0d9488);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 2.5rem;
  font-weight: 600;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: #e2e8f0;
  margin-bottom: 3rem;
  line-height: 1.6;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.primary-btn, .secondary-btn {
  padding: 16px 32px;
  border-radius: 50px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.primary-btn {
  background: linear-gradient(135deg, #059669, #0d9488);
  color: white;
  box-shadow: 0 8px 32px rgba(5, 150, 105, 0.3);
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(5, 150, 105, 0.4);
}

.secondary-btn {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.secondary-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

/* 价值主张区域 */
.value-section {
  padding: 100px 0;
  background: #f8fafc;
}

.value-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-title {
  font-size: 3rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(135deg, #059669, #0d9488);
  border-radius: 2px;
}

.section-subtitle {
  font-size: 1.2rem;
  color: #64748b;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.value-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.value-card {
  background: white;
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f5f9;
  transition: all 0.3s ease;
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.value-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
}

.value-card-header {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  color: #059669;
}

.value-icon-wrapper {
  background: #e0f2fe;
  border-radius: 15px;
  padding: 10px;
  margin-right: 15px;
  flex-shrink: 0;
}

.value-icon {
  width: 2.5rem;
  height: 2.5rem;
  color: #059669;
}

.value-card h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.75rem;
  line-height: 1.4;
}

.value-card p {
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.value-impact {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: #64748b;
  margin-top: 1rem;
}

.impact-label {
  margin-right: 8px;
  font-weight: 500;
}

.impact-text {
  font-weight: 600;
  color: #059669;
}

/* 解决方案区域 */
.solution-section {
  padding: 100px 0;
  background: #f8fafc;
}

.solution-header {
  text-align: center;
  margin-bottom: 4rem;
}

.solution-content {
  display: flex;
  flex-direction: column;
  gap: 4rem;
}

.solution-main {
  display: flex;
  gap: 4rem;
  align-items: center;
}

.solution-text {
  flex: 1;
}

.solution-text h3 {
  font-size: 2rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1.5rem;
}

.solution-text p {
  font-size: 1.1rem;
  color: #475569;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.solution-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.solution-feature {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.feature-icon {
  width: 40px;
  height: 40px;
  background: #e0f2fe;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.feature-svg {
  width: 24px;
  height: 24px;
  color: #059669;
}

.feature-content h4 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.feature-content p {
  font-size: 1rem;
  color: #64748b;
  line-height: 1.6;
}

.solution-visual {
  flex: 1;
  position: relative;
}

.solution-image-container {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.solution-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
}

.solution-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(5, 150, 105, 0.1), rgba(13, 148, 136, 0.1));
}

.floating-stats {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.2);
  padding: 10px 15px;
  border-radius: 15px;
  backdrop-filter: blur(5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 1.8rem;
  font-weight: 800;
  color: #10b981;
  line-height: 1;
}

.stat-label {
  font-size: 0.9rem;
  color: #64748b;
  margin-top: 0.5rem;
}

.solution-cta {
  background: linear-gradient(135deg, #059669, #0d9488);
  padding: 3rem;
  border-radius: 20px;
  text-align: center;
  color: white;
}

.solution-cta h3 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.solution-cta p {
  font-size: 1.3rem;
  margin-bottom: 3rem;
}

.solution-cta .cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.solution-cta .primary-btn, .solution-cta .secondary-btn {
  padding: 18px 36px;
  border-radius: 50px;
  font-size: 18px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.solution-cta .primary-btn {
  background: white;
  color: #059669;
  box-shadow: 0 8px 32px rgba(255, 255, 255, 0.3);
}

.solution-cta .primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(255, 255, 255, 0.4);
}

.solution-cta .secondary-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.solution-cta .secondary-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.solution-cta .btn-icon {
  font-size: 1.2rem;
}

/* 四大功能模块展示区 */
.features-section {
  padding: 100px 0;
  background: white;
}

.section-subtitle {
  text-align: center;
  font-size: 1.2rem;
  color: #64748b;
  margin-bottom: 4rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.features-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 3rem;
  justify-content: center;
}

.feature-nav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-right: 1rem;
  margin-bottom: 1rem;
}

.feature-nav-btn:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.feature-nav-btn.active {
  background: #059669;
  border-color: #059669;
  color: white;
}

.feature-nav-icon {
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.5rem;
  color: currentColor;
  flex-shrink: 0;
}

.features-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.feature-details {
  padding-right: 2rem;
}

.feature-badge {
  background: linear-gradient(135deg, #fef3c7, #fbbf24);
  color: #92400e;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 1rem;
}

.feature-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.feature-slogan {
  font-size: 1.3rem;
  color: #059669;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.feature-description {
  font-size: 1.1rem;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.feature-points {
  list-style: none;
  padding: 0;
  margin: 1.5rem 0;
}

.feature-points li {
  display: flex;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
  line-height: 1.6;
  color: #475569;
}

.point-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #059669;
  margin-right: 0.75rem;
  margin-top: 0.125rem;
  flex-shrink: 0;
}

.feature-visual {
  position: relative;
}

.feature-image-container {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.feature-image-container img {
  width: 100%;
  height: 400px;
  object-fit: cover;
}

.feature-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(5, 150, 105, 0.1), rgba(13, 148, 136, 0.1));
}

/* 数据统计区域 */
.stats-section {
  padding: 100px 0;
  background: linear-gradient(135deg, #1e293b, #334155);
  color: white;
}

.stats-section .section-title {
  color: white;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.stat-card {
  text-align: center;
  padding: 3rem 2rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.stat-card:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-4px);
}

.stat-number {
  font-size: 4rem;
  font-weight: 800;
  color: #10b981;
  margin-bottom: 1rem;
  line-height: 1;
}

.stat-card p {
  font-size: 1.1rem;
  color: #e2e8f0;
  font-weight: 500;
}

/* 对比表格区域 */
.comparison-section {
  padding: 100px 0;
  background: #f8fafc;
}

.comparison-table {
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  margin-top: 4rem;
}

.table-header {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  background: #e0f2fe;
  padding: 1.5rem 2rem;
  font-weight: 600;
  color: #1e293b;
}

.header-cell {
  text-align: center;
}

.table-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e0f2fe;
  align-items: center;
}

.table-row:last-child {
  border-bottom: none;
}

.row-label {
  font-size: 1.1rem;
  color: #64748b;
  font-weight: 500;
}

.row-value {
  text-align: center;
  font-size: 1.1rem;
  color: #1e293b;
  font-weight: 600;
}

.traditional .status-icon {
  color: #ef4444; /* Red for traditional */
}

.modern .status-icon {
  color: #10b981; /* Green for modern */
}

/* 客户评价区域 */
.testimonials-section {
  padding: 100px 0;
  background: #f8fafc;
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 4rem;
}

.testimonial-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.3s ease;
}

.testimonial-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
}

.testimonial-header {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.testimonial-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 15px;
  object-fit: cover;
  border: 2px solid #059669;
}

.testimonial-info {
  flex-grow: 1;
}

.testimonial-name {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.testimonial-title {
  font-size: 1rem;
  color: #64748b;
  margin-bottom: 0.5rem;
}

.testimonial-rating {
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
}

.star-icon {
  width: 1rem;
  height: 1rem;
  color: #fbbf24;
  margin-right: 0.125rem;
}

.testimonial-content {
  font-size: 1.1rem;
  color: #475569;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.testimonial-stats {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: baseline;
}

.stat-label {
  font-size: 0.9rem;
  color: #64748b;
  margin-right: 8px;
}

.stat-value {
  font-size: 1.2rem;
  font-weight: 700;
  color: #059669;
  line-height: 1;
}

/* CTA区域 */
.cta-section {
  padding: 100px 0;
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
  text-align: center;
}

.cta-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 4rem;
  margin-bottom: 4rem;
}

.cta-left {
  flex: 1;
  text-align: left;
}

.cta-badge {
  margin-bottom: 1rem;
}

.cta-badge span {
  display: inline-flex;
  align-items: center;
  padding: 12px 24px;
  background: linear-gradient(135deg, #059669, #0d9488);
  border-radius: 50px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 8px 32px rgba(5, 150, 105, 0.3);
  transition: all 0.3s ease;
}

.cta-badge span:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(5, 150, 105, 0.4);
}

.cta-title {
  font-size: 3rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
}

.cta-subtitle {
  font-size: 1.3rem;
  color: #64748b;
  margin-bottom: 3rem;
}

.cta-benefits {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 3rem;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #e0f2fe;
  padding: 12px 20px;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
  box-shadow: 0 8px 32px rgba(5, 150, 105, 0.1);
}

.benefit-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(5, 150, 105, 0.2);
}

.benefit-icon {
  font-size: 1.2rem;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-primary-btn, .cta-secondary-btn {
  padding: 18px 36px;
  border-radius: 50px;
  font-size: 18px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.cta-primary-btn {
  background: linear-gradient(135deg, #059669, #0d9488);
  color: white;
  box-shadow: 0 10px 40px rgba(5, 150, 105, 0.3);
}

.cta-primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 50px rgba(5, 150, 105, 0.4);
}

.cta-secondary-btn {
  background: white;
  color: #059669;
  border: 2px solid #059669;
}

.cta-secondary-btn:hover {
  background: #059669;
  color: white;
  transform: translateY(-2px);
}

.btn-icon {
  font-size: 1.2rem;
}

.cta-stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 3rem;
  flex-wrap: wrap;
}

.cta-stat {
  text-align: center;
}

.cta-stat .stat-number {
  font-size: 2.5rem;
  font-weight: 800;
  color: #10b981;
  line-height: 1;
}

.cta-stat .stat-label {
  font-size: 0.9rem;
  color: #64748b;
  margin-top: 0.5rem;
}

.cta-right {
  flex: 1;
  position: relative;
}

.cta-visual {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.cta-image-container {
  position: relative;
  width: 100%;
  height: 400px;
}

.cta-image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cta-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(5, 150, 105, 0.1), rgba(13, 148, 136, 0.1));
}

.cta-floating-card {
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.2);
  padding: 15px 20px;
  border-radius: 15px;
  backdrop-filter: blur(5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 10px;
}

.floating-card-header {
  display: flex;
  align-items: center;
}

.avatar-group {
  display: flex;
  gap: 5px;
}

.mini-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid #e0e0e0;
}

.floating-card-text {
  text-align: left;
}

.floating-title {
  font-size: 0.9rem;
  color: #1e293b;
  font-weight: 600;
  margin-bottom: 0.3rem;
}

.floating-subtitle {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
  transition: all 0.3s ease;
}

.floating-subtitle .count-number {
  font-weight: 600;
  color: #3b82f6;
  transition: all 0.3s ease;
}

.cta-bottom {
  text-align: center;
}

.trust-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.trust-badge {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.875rem;
  color: #475569;
}

.trust-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(255, 255, 255, 0.2);
}

.badge-icon {
  width: 1.125rem;
  height: 1.125rem;
  color: #059669;
  margin-right: 0.5rem;
  flex-shrink: 0;
}

/* 页脚 */
.footer {
  background: #1e293b;
  color: white;
  padding: 80px 0 40px;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 4rem;
  margin-bottom: 4rem;
}

.footer-logo {
  max-width: 250px;
}

.footer-logo h3 {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1rem;
}

.footer-logo p {
  font-size: 1.1rem;
  color: #e2e8f0;
  line-height: 1.6;
}

.footer-social {
  display: flex;
  gap: 1.5rem;
}

.social-link {
  display: inline-block;
}

.social-icon {
  width: 30px;
  height: 30px;
  object-fit: contain;
}

.footer-section h4 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 2rem;
}

.footer-links {
  list-style: none;
  padding: 0;
}

.footer-links li {
  margin-bottom: 1rem;
}

.footer-links a {
  color: #e2e8f0;
  text-decoration: none;
  font-size: 1.1rem;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: #059669;
}

.contact-info {
  font-size: 1.1rem;
  color: #e2e8f0;
  line-height: 1.6;
}

.contact-info p {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: #64748b;
}

.contact-icon {
  width: 1rem;
  height: 1rem;
  color: #64748b;
  margin-right: 0.5rem;
  flex-shrink: 0;
}

.footer-bottom {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-bottom-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.footer-bottom-links {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.footer-bottom-links a {
  color: #e2e8f0;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.footer-bottom-links a:hover {
  color: #059669;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .gradient-text {
    font-size: 1.8rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .features-nav {
    flex-direction: column;
    align-items: center;
  }
  
  .feature-nav-btn {
    width: 100%;
    max-width: 300px;
    margin-right: 0;
  }

  .features-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .feature-details {
    padding-right: 0;
  }

  .cta-content {
    flex-direction: column;
    text-align: center;
  }

  .cta-left, .cta-right {
    width: 100%;
  }

  .cta-visual {
    width: 100%;
    height: 300px; /* Adjust height for smaller screens */
  }

  .cta-image-container img {
    height: 100%;
  }

  .cta-floating-card {
    position: static;
    margin-top: 20px;
    width: 100%;
    max-width: 300px;
    margin-left: auto;
    margin-right: auto;
  }

  .floating-card-header {
    justify-content: center;
  }

  .avatar-group {
    display: none; /* Hide avatar group on small screens */
  }

  .floating-card-text {
    text-align: center;
  }

  .cta-stats {
    flex-direction: column;
    gap: 1rem;
  }

  .cta-stat {
    width: 100%;
    text-align: center;
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .footer-logo {
    max-width: 100%;
  }

  .footer-social {
    justify-content: center;
  }

  .footer-bottom-content {
    flex-direction: column;
    text-align: center;
  }

  .footer-bottom-links {
    justify-content: center;
  }

  .trust-badges {
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }
  
  .trust-badge {
    width: 100%;
    max-width: 200px;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .gradient-text {
    font-size: 1.8rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .section-subtitle {
    font-size: 1rem;
  }
  
  .value-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .value-card {
    padding: 1.5rem;
  }
  
  .value-card-header {
    flex-direction: column;
    text-align: center;
    margin-bottom: 1rem;
  }
  
  .value-icon-wrapper {
    margin-right: 0;
    margin-bottom: 1rem;
  }
  
  .value-card h3 {
    font-size: 1.25rem;
    text-align: center;
  }
  
  .value-impact {
    justify-content: center;
  }
  
  .solution-main {
    flex-direction: column;
    gap: 2rem;
  }

  .solution-text {
    text-align: center;
  }

  .solution-features {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .solution-feature {
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
  }

  .feature-icon {
    width: 50px;
    height: 50px;
    margin-bottom: 0.5rem;
  }

  .feature-svg {
    width: 30px;
    height: 30px;
  }

  .solution-visual {
    width: 100%;
    height: 300px; /* Adjust height for smaller screens */
  }

  .solution-image-container img {
    height: 100%;
  }

  .solution-cta {
    padding: 2rem;
  }

  .solution-cta h3 {
    font-size: 2rem;
  }

  .solution-cta p {
    font-size: 1.2rem;
  }

  .cta-buttons {
    flex-direction: column;
    gap: 0.75rem;
  }

  .cta-buttons .primary-btn, .cta-buttons .secondary-btn {
    width: 100%;
    max-width: 300px;
  }
}
</style>