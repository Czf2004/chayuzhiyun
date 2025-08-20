<template>
  <div class="home-view">
    <!-- Hero区域 -->
    <section class="hero-section">
      <div class="hero-background" :style="{ backgroundImage: `url(${images.hero.main})` }"></div>
      <div class="hero-container">
        <div class="hero-content">
          <div class="hero-badge">
            <RocketLaunchIcon class="hero-badge-icon" />
            <span>用全网数据做决策，用AI搞推广</span>
          </div>
          <h1 class="hero-title">
            茶参谋
            <span class="gradient-text">一手行业数据 + 全自动私域运营</span>
          </h1>
          <p class="hero-subtitle">
            我们为您监控全网平台、各大渠道的精准行业数据，并基于数据，自动执行朋友圈种草、客户跟进、沉默唤醒，让您再也不愁卖货。
          </p>
          <div class="hero-buttons">
            <button class="primary-btn">获取我的行业数据报告</button>
            <button class="secondary-btn">观看私域自动化演示</button>
          </div>
        </div>
      </div>
    </section>

    <!-- 价值主张区域 -->
    <section class="value-section">
      <div class="container">
        <div class="value-header">
          <h2 class="section-title">茶行业老板的新困局：有货，但卖不出利润</h2>
          <p class="section-subtitle">不是茶不好，是打法落后了</p>
        </div>

        <div class="value-grid">
          <div class="value-card" v-motion-slide-visible-once-bottom>
            <div class="value-card-header">
              <div class="value-icon-wrapper">
                <ChartBarIcon class="value-icon" />
              </div>
              <h3>闭门造车，决策失灵</h3>
            </div>
            <p>不知道别家什么价、什么好卖。盲目定价，要么利润流失，要么直接滞销。缺乏行业数据，决策全靠猜。</p>
            <div class="value-impact">
              <span class="impact-label">后果：</span>
              <span class="impact-text">货不对路，高买低卖</span>
            </div>
          </div>

          <div class="value-card" v-motion-slide-visible-once-bottom>
            <div class="value-card-header">
              <div class="value-icon-wrapper">
                <FlagIcon class="value-icon" />
              </div>
              <h3>私域死寂，推广低效</h3>
            </div>
            <p>微信加了人，但朋友圈不会发，群也活跃不起来。营销全靠群发刷屏，客户反感，员工效率低下，成本极高。</p>
            <div class="value-impact">
              <span class="impact-label">后果：</span>
              <span class="impact-text">流量浪费，复购率低</span>
            </div>
          </div>

          <div class="value-card" v-motion-slide-visible-once-bottom>
            <div class="value-card-header">
              <div class="value-icon-wrapper">
                <BoltIcon class="value-icon" />
              </div>
              <h3>手工操作，规模瓶颈</h3>
            </div>
            <p>老板个人IP无法复制，销售流程全靠人工盯。客户一多就管不过来，服务标准下降，规模永远做不大。</p>
            <div class="value-impact">
              <span class="impact-label">后果：</span>
              <span class="impact-text">人效低下，增长乏力</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 数据优势区域 (新增) -->
    <section class="data-advantage-section">
      <div class="container">
        <div class="solution-header">
          <h2 class="section-title">「茶参谋」 ：用行业数据指挥，让AI自动执行</h2>
          <p class="section-subtitle">第一，给您一双看清行业的“天眼”。第二，给您一个自动赚钱的“私域机器”</p>
        </div>

        <div class="data-sources">
          <div class="sources-grid">
            <div class="source-card">
              <div class="source-icon">
                <ShoppingCartIcon class="source-icon-svg" />
              </div>
              <div class="source-body">
                <h4 class="source-title">电商平台</h4>
                <p class="source-desc">天猫/京东/抖音 实时售价、优惠强度、套餐组合、关键词口碑</p>
                <div class="source-badges">
                  <span class="badge">价格带</span>
                  <span class="badge">销量趋势</span>
                  <span class="badge">差评机会</span>
                </div>
              </div>
            </div>
            <div class="source-card">
              <div class="source-icon">
                <PresentationChartBarIcon class="source-icon-svg" />
              </div>
              <div class="source-body">
                <h4 class="source-title">大宗市场</h4>
                <p class="source-desc">芳村等批发市场 开盘价/成交价/流通热度，指导进出货时机</p>
                <div class="source-badges">
                  <span class="badge">开盘价</span>
                  <span class="badge">成交价</span>
                  <span class="badge">热度</span>
                </div>
              </div>
            </div>
            <div class="source-card">
              <div class="source-icon">
                <MegaphoneIcon class="source-icon-svg" />
              </div>
              <div class="source-body">
                <h4 class="source-title">社交平台</h4>
                <p class="source-desc">小红书/微博/视频号 热点话题与情绪趋势，抢占营销先机</p>
                <div class="source-badges">
                  <span class="badge">话题热度</span>
                  <span class="badge">情绪分析</span>
                  <span class="badge">爆点洞察</span>
                </div>
              </div>
            </div>
            <div class="source-card">
              <div class="source-icon">
                <CloudIcon class="source-icon-svg" />
              </div>
              <div class="source-body">
                <h4 class="source-title">产区情报</h4>
                <p class="source-desc">核心产区 天气预警/茶青指导价/政府报告，提前锁定成本</p>
                <div class="source-badges">
                  <span class="badge">天气</span>
                  <span class="badge">指导价</span>
                  <span class="badge">政策</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 四大功能模块展示区 -->
    <section class="features-section">
      <div class="container">
        <h2 class="section-title">四大系统，打通“行业数据”到“自动成交”的闭环</h2>
        <p class="section-subtitle">数据指导策略，系统自动化执行，规模化提升业绩</p>

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
            
            <!-- 【强化】行业数据应用 -->
            <div class="data-application" v-if="features[activeFeature].dataApplication">
              <h4>行业数据如何驱动本模块：</h4>
              <ul>
                <li v-for="(item, idx) in features[activeFeature].dataApplication" :key="idx">{{ item }}</li>
              </ul>
            </div>

            <!-- 【保留并强化】AI交互示例 -->
            <div class="ai-command-demo">
              <p class="command-prompt">尝试对AI说：</p>
              <div class="command-example">“{{ features[activeFeature].aiExample.question }}”</div>
              <p class="command-result">它将立刻为您：</p>
              <ul class="command-steps">
                <li v-for="(step, index) in features[activeFeature].aiExample.actions" :key="index">{{ step }}</li>
              </ul>
            </div>

            <!-- 【强化】自动化流程展示 -->
            <div class="automation-flow" v-if="features[activeFeature].automationFlow">
              <h4>自动化执行流程：</h4>
              <div class="flow-steps">
                <div class="flow-step" v-for="(step, sIndex) in features[activeFeature].automationFlow" :key="sIndex">
                  <span class="step-number">{{ sIndex + 1 }}</span>
                  <span class="step-text">{{ step }}</span>
                </div>
              </div>
            </div>

          </div>
          <div class="feature-visual" v-motion-slide-visible-once-right>
            <!-- 根据模块特性展示不同的可视化内容 -->
            <div class="visual-container">
              <img :src="features[activeFeature].image" :alt="features[activeFeature].title" v-if="features[activeFeature].image" />
              <div class="system-dashboard" v-if="features[activeFeature].dashboardData">
                <div class="dashboard-header">
                  <h4>{{ features[activeFeature].dashboardTitle }}</h4>
                  <span class="update-time">实时更新</span>
                </div>
                <div class="dashboard-content">
                  <div class="data-card" v-for="(data, dIndex) in features[activeFeature].dashboardData" :key="dIndex">
                    <div class="data-label">{{ data.label }}</div>
                    <div class="data-value" :class="data.trend">{{ data.value }}</div>
                    <div class="data-trend" v-if="data.trendValue">
                      <span class="trend-icon">{{ data.trend === 'up' ? '↗' : '↘' }}</span>
                      <span class="trend-value">{{ data.trendValue }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 私域自动化案例区域 (新增) -->
    <section class="automation-case-section">
      <div class="container">
        <h2 class="section-title">看看您的同行如何用「茶参谋」实现私域自动化</h2>
        <p class="section-subtitle">标准化流程，规模化复制，业绩持续增长</p>
        
        <div class="case-studies">
          <div class="case-study">
            <div class="case-content">
              <h3>案例：武夷山岩茶品牌</h3>
              <h4>【痛点】</h4>
              <p>复购率低、内容单一，难以树立专业形象；沉默客户多，几乎无法唤醒。</p>
              <h4>【茶参谋解决方案】</h4>
              <ol>
                <li>「朋友圈AI导演」全年剧本，自动发布品牌故事、岩茶科普、客户见证。</li>
                <li>「企业微信SOP」新客3天破冰，老客生日自动祝福+专属券。</li>
                <li>「沉默客户激活流水线」针对180天未购客户推送礼包，并引流直播专场。</li>
              </ol>
              <h4>【结果】</h4>
              <div class="results-grid">
                <div class="result-item">
                  <div class="result-value">78%</div>
                  <div class="result-label">复购率提升</div>
                </div>
                <div class="result-item">
                  <div class="result-value">2.5小时/天</div>
                  <div class="result-label">老板节省时间</div>
                </div>
                <div class="result-item">
                  <div class="result-value">+15%</div>
                  <div class="result-label">客单价提升</div>
                </div>
              </div>
            </div>
            <div class="case-visual">
              <img :src="images.cases.tieguanyin" alt="私域运营案例" />
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
            <p>决策失误减少</p>
          </div>
          <div class="stat-card" v-motion-slide-visible-once-bottom>
            <div class="stat-number">{{ stats.efficiency }}%</div>
            <p>管理效率提升</p>
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
        <h2 class="section-title">传统管理 vs 茶参谋AI管理</h2>
        <p class="section-subtitle">选择决定效率，效率决定利润</p>
        
        <div class="comparison-table">
          <div class="table-header">
            <div class="header-cell">管理场景</div>
            <div class="header-cell">传统方式</div>
            <div class="header-cell">茶参谋AI</div>
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
            <h2 class="cta-title">立即雇佣您的AI运营团队！</h2>
            <p class="cta-subtitle">第一个月，让AI总监为您免费工作</p>
            
            <div class="cta-benefits">
              <div class="benefit-item">
                <span class="benefit-icon">🚀</span>
                <span>7天免费体验全部AI总监能力</span>
              </div>
              <div class="benefit-item">
                <span class="benefit-icon">💰</span>
                <span>新用户专享8折优惠</span>
              </div>
              <div class="benefit-item">
                <span class="benefit-icon">🎁</span>
                <span>免费获得《2025茶业趋势与爆品预测》报告</span>
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
                <span class="stat-label">续费率</span>
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
                    <p class="floating-subtitle"><span class="count-number">{{ liveConsultationCount }}</span>位老板正在咨询</p>
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
              <h3>茶参谋</h3>
              <p>您的AI茶叶生意参谋</p>
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
            <h4>AI部门</h4>
            <ul class="footer-links">
              <li><a href="#">AI战略情报部（天眼）</a></li>
              <li><a href="#">AI精准营销部（印钞机）</a></li>
              <li><a href="#">AI品牌销售部（加速器）</a></li>
              <li><a href="#">AI供应链部（智慧园）</a></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h4>解决方案</h4>
            <ul class="footer-links">
              <li><a href="#">茶叶批发商方案</a></li>
              <li><a href="#">茶企品牌方案</a></li>
              <li><a href="#">茶园基地方案</a></li>
              <li><a href="#">茶艺馆方案</a></li>
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
              <p><EnvelopeIcon class="contact-icon" /> contact@chacanmou.com</p>
              <p><MapPinIcon class="contact-icon" /> 杭州市西湖区文三路</p>
            </div>
          </div>
        </div>
        
        <div class="footer-bottom">
          <div class="footer-bottom-content">
            <p>&copy; 2025 茶参谋. 保留所有权利.</p>
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
  MapPinIcon,
  ShoppingCartIcon,
  PresentationChartBarIcon,
  MegaphoneIcon,
  CloudIcon
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
    title: "AI战略情报部",
    badge: "茶界天眼Pro",
    slogan: "一眼看穿市场，决策快人一步",
    description: "避免决策失误，发现蓝海市场。全网监控竞品动态、渠道价格、舆情热点，让您的每次决策都有数据支撑。",
    points: [
      "全网竞品监控：天猫、京东、抖音价格与促销策略一览无余",
      "渠道动态监控：芳村等大宗市场开盘价、成交价实时掌握",
      "舆情热点挖掘：小红书、微博热点话题抢先布局",
      "原料行情预警：核心产区天气、茶青价格提前预判",
      "爆品拆解报告：AI自动生成爆款公式，复制成功模式"
    ],
    aiExample: {
      question: "下周一普洱该怎么进货？",
      actions: [
        "分析近期各平台普洱销售增速与利润率",
        "核查当前库存及未来一周预销量",
        "比对云南产区近期价格波动与天气预警",
        "生成建议采购量、参考单价及总预算",
        "询问您‘是否直接生成采购单？’"
      ]
    },
    image: images.products.monitoring,
    icon: EyeIcon
  },
  {
    title: "AI精准营销部",
    badge: "客户印钞机",
    slogan: "让每个客户都成为利润源泉",
    description: "提升客户终身价值，低成本激活沉默客户。AI客户画像、朋友圈自动化、企微SOP，把私域流量变成私域留量。",
    points: [
      "AI客户画像2.0：消费能力、人生阶段、兴趣偏好深度分析",
      "朋友圈AI导演：全年剧本库，自动定时发布，树立专业人设",
      "企业微信SOP：新客破冰、老客回购标准化流程，提升人效",
      "利润看板：客户终身利润排名、流失风险预警一目了然",
      "沉默客户激活流水线：全自动多渠道触达，变废为宝"
    ],
    aiExample: {
      question: "激活一下180天没买过的客户",
      actions: [
        "筛选出180天未购客户清单并分析特征",
        "自动执行‘专属福利券’推送",
        "3天后对未响应客户触发AI电话回访",
        "引流至视频号直播专场",
        "生成激活报告：已唤醒X人，预计创造Y元收益"
      ]
    },
    image: images.products.irrigation,
    icon: UserGroupIcon
  },
  {
    title: "AI品牌销售部",
    badge: "利润加速器",
    slogan: "不只是卖茶，更是卖价值",
    description: "打造品牌溢价，将产品卖出高价。区块链级溯源增加信任，AI卖点生成降低内容成本，智能报价单追踪意向。",
    points: [
      "区块链级溯源：物联网数据+官方认证，支撑品牌溢价",
      "AI卖点生成器：一键生成小红书爆文、抖音脚本、详情页文案",
      "智能报价单：带追踪的H5迷你网站，客户行为尽在掌握",
      "高客单价SOP：复杂销售流程标准化，普通销售也能成销冠",
      "动态利润看板：毛利率、资金周转等核心指标实时掌控"
    ],
    aiExample: {
      question: "给这批明前龙井生成营销文案",
      actions: [
        "读取产品参数：产地、等级、工艺、认证信息",
        "分析当前社交媒体茶叶热点话题",
        "生成3篇小红书风格文案，2个抖音视频脚本",
        "提炼5个核心卖点话术",
        "询问‘需要发布到预设的账号上吗？’"
      ]
    },
    image: images.products.growth,
    icon: ArrowTrendingUpIcon
  },
  {
    title: "AI供应链部",
    badge: "智慧茶园轻量版",
    slogan: "科技种茶，品质可控",
    description: "提升品质，稳定产量，降低农资浪费。无人机巡园及早发现风险，气象预警规避自然灾害，采茶规划优化人力成本。",
    points: [
      "无人机AI巡园：替代人工，早期发现病虫害、干旱缺肥",
      "气象与灾情预警：精准局地天气预报，提前采取防护措施",
      "采茶最优规划：基于茶叶成熟度分布，规划最优采摘路径",
      "农资成本分析：记录使用量与区域，优化投入产出比"
    ],
    aiExample: {
      question: "检查一下茶园最近有什么问题",
      actions: [
        "调取最近一次无人机巡园影像与AI分析报告",
        "核查近期气象预警历史",
        "生成茶园健康报告：东北区发现早期叶蝉危害迹象",
        "给出处理建议：建议三天内喷洒X药剂，用量Y升/亩",
        "询问‘需要联系合作的植保服务上门吗？’"
      ]
    },
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
    feature: "市场决策",
    traditional: "凭经验感觉，打听小道消息",
    modern: "全网数据支撑，AI给出建议采购单"
  },
  {
    feature: "客户管理",
    traditional: "Excel表格记录，朋友圈随缘发",
    modern: "AI自动画像，全年剧本自动化营销"
  },
  {
    feature: "销售过程",
    traditional: "老板亲自盯，销售各自为战",
    modern: "SOP标准化，智能报价单追踪意向"
  },
  {
    feature: "茶园管理",
    traditional: "老师傅凭经验，发现问题已晚",
    modern: "无人机AI巡园，及早预警风险"
  },
  {
    feature: "利润分析",
    traditional: "月末看报表，发现亏损已晚",
    modern: "动态利润看板，实时监控及时调整"
  }
]

// 客户评价数据
const testimonials = [
  {
    name: "张总",
    title: "西湖龙井茶业 CEO",
    avatar: images.avatars.user1,
    content: "茶参谋的天眼Pro让我再也不怕进货压错宝了，去年光避免决策失误就省了30多万，利润提升了45%。",
    profit: 45,
    efficiency: 60
  },
  {
    name: "李女士",
    title: "碧螺春茶庄 创始人",
    avatar: images.avatars.user2,
    content: "客户印钞机功能太棒了！我们的复购率从30%提升到了78%，朋友圈自动化让我每天省下2小时，客户满意度98%。",
    profit: 52,
    efficiency: 75
  },
  {
    name: "王老板",
    title: "铁观音批发商",
    avatar: images.avatars.user3,
    content: "以前最头疼库存，现在茶参谋主动预警，库存周转率提升了3倍，资金利用率大幅提高，利润率增加了38%。",
    profit: 38,
    efficiency: 85
  }
]

// 组件挂载后启动动画
onMounted(() => {
  // 滚动触发动画
  setTimeout(() => {
    stats.value = {
      growth: 47,
      cost: 62, // 决策失误减少
      efficiency: 65,
      satisfaction: 96
    }
  }, 1000)
})
</script>

<style scoped>
/* 新增AI交互示例样式 */
.ai-command-demo {
  background: #f8fafc;
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1.5rem 0;
  border-left: 4px solid #8b5cf6;
}

.command-prompt {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 0.5rem;
}

.command-example {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  margin-bottom: 1rem;
  font-weight: 500;
  color: #7c3aed;
}

.command-result {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 0.5rem;
}

.command-steps {
  list-style-type: none;
  padding: 0;
}

.command-steps li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.875rem;
  color: #475569;
}

.command-steps li:last-child {
  border-bottom: none;
}

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
  text-align: center;
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
  text-align: center;
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
  bottom: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 140px;
}

.stat-item {
  text-align: center;
  padding: 0.5rem;
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
  border-radius: 12px;
  border: 1px solid #bae6fd;
}

.stat-number {
  font-size: 2rem;
  font-weight: 800;
  color: #059669;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.75rem;
  color: #475569;
  font-weight: 500;
  line-height: 1.2;
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
  white-space: nowrap;
  min-width: fit-content;
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
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 1rem;
  display: inline-block;
  white-space: nowrap;
  min-width: fit-content;
}

.feature-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
  text-align: center;
}

.feature-slogan {
  font-size: 1.3rem;
  color: #059669;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: center;
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
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-visual img {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
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

/* 行业数据来源 */
.data-sources { margin-top: 2rem; }
.sources-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem; }
.source-card { display: flex; gap: 12px; padding: 16px; border: 1px solid #e2e8f0; border-radius: 12px; background: #fff; }
.source-icon { width: 40px; height: 40px; border-radius: 10px; background: #f1f5f9; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.source-icon-svg { width: 22px; height: 22px; color: #059669; }
.source-title { font-weight: 600; color: #1f2937; margin: 0 0 4px 0; }
.source-desc { margin: 0 0 8px 0; color: #64748b; font-size: 0.9rem; }
.source-badges { display: flex; flex-wrap: wrap; gap: 6px; }
.badge { padding: 2px 8px; font-size: 12px; border-radius: 999px; background: #ecfeff; color: #0ea5e9; border: 1px solid #e0f2fe; }

/* 私域自动化案例 */
.automation-case-section { padding: 80px 0; background: #ffffff; }
.case-studies { display: grid; grid-template-columns: 1fr; gap: 2rem; }
.case-study { display: grid; grid-template-columns: 1.2fr 1fr; gap: 2rem; align-items: center; }
.case-content h3 { font-size: 1.5rem; color: #1e293b; margin-bottom: 1rem; }
.case-content h4 { font-size: 1.1rem; color: #0f172a; margin: 1rem 0 0.5rem; text-align: center; }
.case-content p { color: #475569; line-height: 1.6; }
.case-content ol { padding-left: 1.1rem; color: #475569; }
.case-content ol li { margin: 0.3rem 0; }
.results-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; margin-top: 1rem; }
.result-item { text-align: center; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1rem; }
.result-value { font-size: 1.25rem; font-weight: 800; color: #059669; }
.result-label { font-size: 0.9rem; color: #64748b; }
.case-visual { display: flex; align-items: center; justify-content: center; }
.case-visual img { width: 100%; height: 320px; object-fit: cover; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); }

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
    width: auto;
    max-width: 100%;
    margin-right: 0;
    margin-bottom: 0.75rem;
    padding: 0.75rem 1.25rem;
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

@media (max-width: 768px) {
  .floating-stats {
    position: relative;
    bottom: auto;
    left: auto;
    margin-top: 1rem;
    width: 100%;
    flex-direction: row;
    justify-content: space-around;
    min-width: auto;
  }
  
  .stat-item {
    flex: 1;
    max-width: 120px;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
  
  .stat-label {
    font-size: 0.7rem;
  }
}
</style>