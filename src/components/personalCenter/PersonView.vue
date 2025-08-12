<template>
  <div class="profile-container">
    <!-- Skeleton -->
    <div v-if="loading" class="skeleton-container">
      <!-- Hero Section Skeleton -->
      <div class="skeleton-hero">
        <div class="skeleton-hero-bg"></div>
        <div class="skeleton-hero-content">
          <div class="skeleton-avatar-large"></div>
          <div class="skeleton-hero-text">
            <div class="skeleton-name"></div>
            <div class="skeleton-title"></div>
            <div class="skeleton-stats">
              <div v-for="i in 3" :key="i" class="skeleton-stat"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Skeleton -->
      <div class="skeleton-main">
        <div class="skeleton-sidebar">
          <div class="skeleton-profile-card">
            <div class="skeleton-card-header"></div>
            <div class="skeleton-info-list">
              <div v-for="i in 4" :key="i" class="skeleton-info-row"></div>
            </div>
          </div>
        </div>

        <div class="skeleton-content">
          <div class="skeleton-stats-grid">
            <div v-for="i in 4" :key="i" class="skeleton-stat-card"></div>
          </div>
          <div class="skeleton-plantations-grid">
            <div v-for="i in 6" :key="i" class="skeleton-plantation-card"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 实际内容 -->
    <div v-else class="profile-content">
      <!-- 头部区域 -->
      <section class="hero-section">
        <div class="hero-background">...</div>
        <div class="hero-content">
          <!-- 头像上传区域 -->
          <div class="hero-avatar">
            <img :src="userInfo.avatar || defaultAvatar" alt="用户头像" class="user-avatar-large"
              @error="handleAvatarError" />
            <div class="avatar-status" :class="userInfo.onlineStatus"></div>
            <label class="avatar-upload-btn">
              <input type="file" accept="image/*" class="avatar-upload-input" @change="handleAvatarSelect" />
              <span class="upload-icon">📷</span>
            </label>
          </div>

          <!-- 用户信息与角色切换 -->
          <div class="hero-info">
            <h1 class="hero-name">{{ userInfo.nickname }}</h1>
            <p class="hero-title">{{ roleMap[userInfo.currentRole] }}</p>
            <p class="hero-subtitle">@{{ userInfo.username }}</p>

            <!-- 多角色切换 -->
            <div class="role-switcher">
              <select v-model="userInfo.currentRole" @change="handleRoleChange">
                <option v-for="role in userInfo.roles" :key="role.code" :value="role.code">{{ role.name }}</option>
              </select>
            </div>

            <div class="hero-stats">
              <div class="stat-item">
                <span class="stat-number">{{ userInfo.plantations.length }}</span>
                <span class="stat-label">种植园</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ totalDrones }}</span>
                <span class="stat-label">无人机</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ totalSensors }}</span>
                <span class="stat-label">传感器</span>
              </div>
            </div>
          </div>

          <div class="hero-actions">
            <button class="btn-primary">编辑资料</button>
            <button class="btn-secondary">导出数据</button>
          </div>
        </div>
      </section>

      <!-- 主内容区 -->
      <div class="main-layout">
        <!-- 侧边栏 -->
        <aside class="sidebar">
          <div class="profile-card">
            <div class="card-header">
              <h3>个人信息</h3>
              <span class="last-update">最近更新：{{ formatDate(userInfo.updatedAt) }}</span>
            </div>
            <div class="profile-info">
              <div class="info-row">
                <span class="info-label">用户ID</span>
                <span class="info-value">{{ userInfo.userId }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">手机号码</span>
                <span class="info-value">{{ userInfo.phone || '未设置' }}</span>
              </div>

              <!-- 实名认证状态 -->
              <div class="info-row">
                <span class="info-label">实名认证</span>
                <span class="info-value">
                  <span :class="authStatusClass">{{ authStatusText }}</span>
                  <span class="auth-type">({{ userInfo.auth.type || '未认证' }})</span>
                </span>
              </div>

              <!-- 审核进度 -->
              <div class="info-row" v-if="userInfo.auth.status === 'pending'">
                <span class="info-label">审核进度</span>
                <span class="info-value">{{ userInfo.auth.progress }}%</span>
              </div>

              <!-- 过期提醒 -->
              <div class="info-row" v-if="userInfo.auth.expireWarning">
                <span class="info-label">过期提醒</span>
                <span class="info-value expire-warning">
                  证件将在{{ userInfo.auth.expireDays }}天后过期
                </span>
              </div>

              <!-- 登录安全信息 -->
              <div class="info-row">
                <span class="info-label">最近登录</span>
                <span class="info-value">
                  {{ formatDate(userInfo.lastLogin.time) }}
                  <br>{{ userInfo.lastLogin.location }}
                </span>
              </div>
            </div>
          </div>

          <!-- 设备管理 -->
          <div class="profile-card security-card">
            <div class="card-header">
              <h3>登录设备</h3>
            </div>
            <div class="device-list">
              <div v-for="device in userInfo.loginDevices" :key="device.id" class="device-item">
                <span class="device-info">{{ device.name }}（{{ device.os }}）</span>
                <button class="force-logout" v-if="!device.isCurrent" @click="handleForceLogout(device.id)">
                  强制下线
                </button>
              </div>
            </div>
          </div>
        </aside>

        <!-- 主内容 -->
        <main class="main-content">
          <!-- 数据概览 -->
          <section class="stats-section">
            <div class="section-header">
              <h2 class="section-title">数据概览</h2>
            </div>
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path
                      d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                  </svg>
                </div>
                <div class="stat-content">
                  <h4>今日作业面积</h4>
                  <div class="stat-number">{{ todayWorkArea }}亩</div>
                  <div class="stat-trend positive">+12% 较昨日</div>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                  </svg>
                </div>
                <div class="stat-content">
                  <h4>异常事件</h4>
                  <div class="stat-number">{{ abnormalEvents }}</div>
                  <div class="stat-trend negative">+3 今日</div>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <div class="stat-content">
                  <h4>在线传感器</h4>
                  <div class="stat-number">{{ onlineSensors }}</div>
                  <div class="stat-trend neutral">98% 在线率</div>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path
                      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <div class="stat-content">
                  <h4>运行中无人机</h4>
                  <div class="stat-number">{{ runningDrones }}</div>
                  <div class="stat-trend positive">+5% 本周</div>
                </div>
              </div>
            </div>
          </section>

          <!-- 作物生长曲线（嵌入小图） -->
          <section class="chart-section">
            <div class="section-header">
              <h2 class="section-title">作物生长曲线</h2>
            </div>
            <div class="chart-container">
              <canvas ref="growthChart" width="800" height="200"></canvas>
            </div>
          </section>

          <!-- 种植园列表（带图片） -->
          <section class="plantations-section">
            <div class="section-header">
              <h2 class="section-title">我的种植园</h2>
              <div class="header-actions">
                <button class="btn-filter">筛选</button>
                <button class="btn-add">新建种植园</button>
              </div>
            </div>

            <div class="plantations-grid">
              <div v-for="p in userInfo.plantations" :key="p.id" class="plantation-card">
                <div class="card-image">
                  <img :src="p.imageUrl" alt="种植园图片" class="plantation-img"
                    @error="e => e.target.src = defaultPlantationImg" />
                  <div class="status-overlay">
                    <span class="status-badge" :class="badgeClass(p.status, 'deploy')">
                      {{ deployStatusText(p.status) }}
                    </span>
                  </div>
                </div>
                <div class="card-content">
                  <h3 class="plantation-name">{{ p.name }}</h3>
                  <p class="plantation-location">{{ p.province }} {{ p.city }}</p>

                  <div class="plantation-metrics">
                    <div class="metric">
                      <span class="metric-value">{{ p.droneCount }}</span>
                      <span class="metric-label">无人机</span>
                    </div>
                    <div class="metric">
                      <span class="metric-value">{{ p.sensorCount }}</span>
                      <span class="metric-label">传感器</span>
                    </div>
                    <div class="metric">
                      <span class="metric-value">{{ p.area }}亩</span>
                      <span class="metric-label">面积</span>
                    </div>
                  </div>

                  <div class="pest-status">
                    <span class="pest-label">虫害状态：</span>
                    <span class="pest-badge" :class="badgeClass(p.pestStatus, 'pest')">
                      {{ pestStatusText(p.pestStatus) }}
                    </span>
                  </div>
                </div>
                <div class="card-actions">
                  <button class="btn-view">查看详情</button>
                  <button class="btn-manage">管理</button>
                </div>
              </div>
            </div>
          </section>
          <!-- 资产总览-设备池（优化部分） -->
          <section class="devices-section">
            <div class="section-header">
              <h2 class="section-title">设备池</h2>
              <div class="header-actions">
                <!-- 查看所有茶园按钮 -->
                <button class="btn-view-all" @click="handleViewAllPlantations">
                  查看所有茶园
                </button>
              </div>
            </div>

            <!-- 按茶园分组的设备列表 -->
            <div class="plantation-device-groups">
              <!-- 循环每个茶园 -->
              <div v-for="plantation in userInfo.plantations" :key="plantation.id" class="plantation-device-group">
                <div class="group-title">
                  {{ plantation.name }}（无人机: {{ plantation.droneCount }} | 传感器: {{ plantation.sensorCount }}）
                </div>

                <!-- 该茶园的设备列表 -->
                <div class="devices-grid">
                  <div v-for="device in getDevicesByPlantation(plantation.id)" :key="device.id" class="device-card">
                    <div class="device-type">
                      {{ device.type === 'drone' ? '无人机' : device.type === 'sensor' ? '传感器' : '网关' }}
                    </div>
                    <div class="device-name">{{ device.name }}</div>
                    <div class="device-status" :class="device.status">
                      {{ device.status === 'online' ? '在线' : '离线' }}
                    </div>
                    <div class="device-firmware">
                      固件：{{ device.firmwareVersion }}
                      <button v-if="device.needsUpgrade" class="upgrade-btn">升级</button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 无设备时显示 -->
              <div v-if="userInfo.plantations.length === 0" class="empty-state">
                <p>暂无设备数据</p>
              </div>
            </div>
          </section>

          <!-- 库存与农资 -->
          <section class="inventory-section">
            <div class="section-header">
              <h2 class="section-title">库存与农资</h2>
            </div>
            <div class="inventory-table">
              <div class="inventory-header">
                <div>类型</div>
                <div>数量</div>
                <div>阈值</div>
                <div>状态</div>
              </div>
              <div v-for="item in userInfo.inventory" :key="item.id" class="inventory-row">
                <div>{{ item.type }}</div>
                <div>{{ item.quantity }}</div>
                <div>{{ item.threshold }}</div>
                <div :class="item.quantity < item.threshold ? 'warning' : 'normal'">
                  {{ item.quantity < item.threshold ? '库存不足' : '正常' }} </div>
                </div>
              </div>
          </section>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, nextTick } from 'vue';
import Chart from 'chart.js/auto'; // 引入图表库

export default {
  setup() {
    // 状态管理
    const loading = ref(true);
    const userInfo = ref({});
    const defaultAvatar = 'https://i.pravatar.cc/300';
    const defaultPlantationImg = 'https://picsum.photos/400/200?grayscale';
    const growthChart = ref(null); // 添加canvas ref

    // 角色映射表
    const roleMap = {
      'group': '集团管理员',
      'subcompany': '子公司经理',
      'farmer': '农场主'
    };

    // 计算属性 - 设备统计
    const totalDrones = computed(() => {
      return userInfo.value.plantations?.reduce((sum, p) => sum + p.droneCount, 0) || 0;
    });

    const totalSensors = computed(() => {
      return userInfo.value.plantations?.reduce((sum, p) => sum + p.sensorCount, 0) || 0;
    });

    const onlineSensors = computed(() => {
      return userInfo.value.plantations?.reduce((sum, p) => sum + p.onlineSensors, 0) || 0;
    });

    const runningDrones = computed(() => {
      return userInfo.value.plantations?.reduce((sum, p) => sum + p.runningDrones, 0) || 0;
    });

    // 实名认证状态文本
    const authStatusText = computed(() => {
      const status = userInfo.value.auth?.status;
      const map = {
        'verified': '已认证',
        'pending': '审核中',
        'rejected': '未通过',
        'expired': '已过期'
      };
      return map[status] || '未认证';
    });

    // 实名认证状态样式
    const authStatusClass = computed(() => {
      const status = userInfo.value.auth?.status;
      const map = {
        'verified': 'auth-success',
        'pending': 'auth-pending',
        'rejected': 'auth-failed',
        'expired': 'auth-expired'
      };
      return map[status] || 'auth-none';
    });

    // 新增：根据茶园ID筛选设备
    const getDevicesByPlantation = (plantationId) => {
      return userInfo.value.devices?.filter(device => device.plantationId === plantationId) || [];
    };

    // 新增：查看所有茶园按钮事件（跳转逻辑由您已实现的页面处理）
    const handleViewAllPlantations = () => {
      // 此处仅作为跳转入口，实际跳转逻辑由您现有页面实现
      console.log('跳转至所有茶园页面');
      // 示例：this.$router.push('/all-plantations');
    };

    // 模拟数据加载
    const fetchData = async () => {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 填充模拟数据
      userInfo.value = {
        userId: 'AGR2025001',
        nickname: '智慧茶园主',
        username: 'tea_farmer',
        avatar: 'https://i.pravatar.cc/300?img=23',
        phone: '138****6789',
        onlineStatus: 'online',
        updatedAt: '2025-08-10T14:30:00',
        lastLogin: {
          time: '2025-08-12T08:45:00',
          location: '杭州市-移动网络'
        },
        loginDevices: [
          { id: 'd1', name: 'Chrome浏览器', os: 'Windows 10', isCurrent: true },
          { id: 'd2', name: 'iPhone客户端', os: 'iOS 17', isCurrent: false }
        ],
        roles: [
          { code: 'group', name: '集团管理员' },
          { code: 'farmer', name: '农场主' }
        ],
        currentRole: 'farmer',
        auth: {
          status: 'verified',
          type: '个人证件',
          progress: 100,
          expireWarning: true,
          expireDays: 30
        },
        todayWorkArea: 256,
        abnormalEvents: 3,
        plantations: [
          {
            id: 'p1',
            name: '西湖龙井茶园',
            imageUrl: 'https://picsum.photos/400/200?random=1',
            province: '浙江省',
            city: '杭州市',
            droneCount: 3,
            runningDrones: 2,
            sensorCount: 12,
            onlineSensors: 11,
            area: 150,
            status: 2, // 已部署
            pestStatus: 0 // 无虫害
          },
          {
            id: 'p2',
            name: '安溪铁观音基地',
            imageUrl: 'https://picsum.photos/400/200?random=2',
            province: '福建省',
            city: '泉州市',
            droneCount: 2,
            runningDrones: 1,
            sensorCount: 8,
            onlineSensors: 8,
            area: 200,
            status: 2,
            pestStatus: 1 // 轻微虫害
          }
        ],
        devices: [
          {
            id: 'dev1',
            type: 'drone',
            name: 'DJI T60',
            status: 'online',
            firmwareVersion: 'v2.3.0',
            needsUpgrade: false,
            plantationId: 'p1' // 关联西湖龙井茶园
          },
          {
            id: 'dev2',
            type: 'sensor',
            name: '土壤湿度传感器',
            status: 'online',
            firmwareVersion: 'v1.5.2',
            needsUpgrade: true,
            plantationId: 'p1' // 关联西湖龙井茶园
          },
          {
            id: 'dev3',
            type: 'gateway',
            name: '数据网关',
            status: 'offline',
            firmwareVersion: 'v3.1.0',
            needsUpgrade: false,
            plantationId: 'p2' // 关联安溪铁观音基地
          },
          {
            id: 'dev4',
            type: 'drone',
            name: 'DJI M300',
            status: 'online',
            firmwareVersion: 'v2.1.0',
            needsUpgrade: true,
            plantationId: 'p2' // 关联安溪铁观音基地
          }
        ],
        inventory: [
          { id: 'i1', type: '龙井种子', quantity: 50, threshold: 30, unit: 'kg' },
          { id: 'i2', type: '有机化肥', quantity: 25, threshold: 40, unit: '袋' },
          { id: 'i3', type: '绿色农药', quantity: 8, threshold: 10, unit: '瓶' }
        ]
      };

      loading.value = false;
      // 等待DOM渲染完成后再初始化图表
      await nextTick();
      initGrowthChart();
    };

    // 初始化作物生长曲线图表
    const initGrowthChart = () => {
      console.log('Initializing growth chart...');
      console.log('growthChart ref:', growthChart.value);

      if (!growthChart.value) {
        console.warn('Canvas element not found, retrying in 100ms...');
        setTimeout(initGrowthChart, 100);
        return;
      }

      try {
        const ctx = growthChart.value.getContext('2d');
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
            datasets: userInfo.value.plantations.map((p, index) => ({
              label: p.name,
              data: [
                Math.random() * 30 + 50,
                Math.random() * 30 + 60,
                Math.random() * 30 + 70,
                Math.random() * 30 + 80,
                Math.random() * 30 + 85,
                Math.random() * 30 + 90
              ],
              borderColor: index === 0 ? '#3e95cd' : '#8e5ea2',
              tension: 0.3,
              fill: false
            }))
          },
          options: {
            responsive: true,
            plugins: {
              legend: { position: 'top' },
              title: { display: true, text: '作物生长指数趋势' }
            },
            scales: {
              y: { beginAtZero: false, min: 50 }
            }
          }
        });
      } catch (error) {
        console.error('Failed to initialize chart:', error);
      }
    };

    // 方法 - 头像错误处理
    const handleAvatarError = (e) => {
      e.target.src = defaultAvatar;
    };

    // 方法 - 头像选择处理
    const handleAvatarSelect = (e) => {
      const file = e.target.files[0];
      if (file) {
        // 这里可集成裁剪组件，示例仅做简单预览
        const reader = new FileReader();
        reader.onload = (event) => {
          userInfo.value.avatar = event.target.result;
          // 实际项目中需调用上传接口：uploadAvatar(file)
        };
        reader.readAsDataURL(file);
      }
    };

    // 方法 - 角色切换
    const handleRoleChange = async (e) => {
      const newRole = e.target.value;
      // 调用角色切换API（JWT+Redis更新）
      // await api.switchRole(newRole);
      userInfo.value.currentRole = newRole;
    };

    // 方法 - 强制下线
    const handleForceLogout = async (deviceId) => {
      if (confirm('确定要强制该设备下线吗？')) {
        // 调用强制下线API
        // await api.forceLogout(deviceId);
        userInfo.value.loginDevices = userInfo.value.loginDevices.filter(d => d.id !== deviceId);
      }
    };

    // 方法 - 日期格式化
    const formatDate = (dateStr) => {
      if (!dateStr) return '';
      return new Date(dateStr).toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    // 方法 - 部署状态文本
    const deployStatusText = (status) => {
      return ['未部署', '部署中', '已部署'][status] || '未知';
    };

    // 方法 - 虫害状态文本
    const pestStatusText = (status) => {
      return ['无', '轻微', '中等', '严重'][status] || '未知';
    };

    // 方法 - 状态徽章样式
    const badgeClass = (status, type) => {
      if (type === 'deploy') {
        return ['status-pending', 'status-processing', 'status-success'][status] || '';
      }
      return ['pest-none', 'pest-minor', 'pest-medium', 'pest-severe'][status] || '';
    };

    // 初始化
    onMounted(fetchData);

    return {
      loading,
      userInfo,
      defaultAvatar,
      defaultPlantationImg,
      growthChart, // 添加canvas ref
      roleMap,
      totalDrones,
      totalSensors,
      onlineSensors,
      runningDrones,
      authStatusText,
      authStatusClass,
      handleAvatarError,
      handleAvatarSelect,
      handleRoleChange,
      handleForceLogout,
      formatDate,
      deployStatusText,
      pestStatusText,
      getDevicesByPlantation,
      handleViewAllPlantations,
      badgeClass
    };
  }
};
</script>

<style scoped>
/* ======  高级感配色重制版（仅变量区） ====== */
.profile-container {
  /* --- 主色（低饱和靛灰） --- */
  --primary: #727881;
  /* 主按钮、关键文字 */
  --primary-dark: #353e4a;
  /* hover/pressed */
  --primary-light: #e7eaed;
  /* 选中态、浅提示背景 */

  /* --- 功能色（莫兰迪绿、橙、红） --- */
  --secondary: #5b826c;
  /* 成功、正向指标 */
  --secondary-dark: #3e584d;
  --warning: #c18c5d;
  /* 警告、处理中 */
  --danger: #b45c5c;
  /* 危险、异常 */

  /* --- 文字阶梯 --- */
  --text: #1f2329;
  /* 一级文字 */
  --text-light: #4a525e;
  /* 二级文字 */
  --text-lighter: #737a85;
  /* 三级文字、icon */

  /* --- 背景色（明度分层，让模块“浮”起来） --- */
  --bg: #fdfcfc;
  /* 页面最底层背景 */
  --bg-light: #f5f6f7;
  /* 卡片整体背景（Stats / Plantation 卡片） */
  --bg-lighter: #eef0f2;
  /* 卡片内部按钮区、分割线背景 */

  /* --- 边框/分割线 --- */
  --border: #d9dadd;
  /* 主边框 */
  --border-light: #e4e6e9;
  /* 内部分割线 */

  /* --- 阴影 --- */
  --shadow: 0 2px 8px rgba(0, 0, 0, .06);
  --shadow-hover: 0 4px 16px rgba(0, 0, 0, .1);

  /* --- 其他保持原值 --- */
  --radius: 6px;
  --radius-lg: 8px;
  --trans: all .2s ease;
}

/* ====== 基础样式 ====== */
.profile-container {
  min-height: 100vh;
  background: var(--bg-light);
  position: relative;
}

/* 飞书风格顶部装饰条 */
.profile-container::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--primary);
  z-index: 1000;
}

/* ====== Skeleton 样式 ====== */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }

  100% {
    background-position: 200% 0;
  }
}

.skeleton-hero {
  height: 320px;
  position: relative;
  overflow: hidden;
  margin-bottom: 24px;
  background: var(--bg);
}

.skeleton-hero-bg {
  height: 100%;
  background: linear-gradient(90deg, #f2f3f5 25%, #e5e6eb 50%, #f2f3f5 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-hero-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  gap: 32px;
  width: 100%;
  max-width: 1200px;
  padding: 0 24px;
}

.skeleton-avatar-large {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(90deg, #f2f3f5 25%, #e5e6eb 50%, #f2f3f5 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-hero-text {
  flex: 1;
}

.skeleton-name {
  height: 32px;
  width: 200px;
  background: linear-gradient(90deg, #f2f3f5 25%, #e5e6eb 50%, #f2f3f5 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  margin-bottom: 12px;
  border-radius: 4px;
}

.skeleton-title {
  height: 20px;
  width: 150px;
  background: linear-gradient(90deg, #f2f3f5 25%, #e5e6eb 50%, #f2f3f5 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  margin-bottom: 8px;
  border-radius: 4px;
}

.skeleton-stats {
  display: flex;
  gap: 24px;
}

.skeleton-stat {
  height: 36px;
  width: 80px;
  background: linear-gradient(90deg, #f2f3f5 25%, #e5e6eb 50%, #f2f3f5 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 6px;
}

.skeleton-main {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.skeleton-sidebar {
  height: 360px;
}

.skeleton-profile-card {
  background: var(--bg);
  border-radius: var(--radius-lg);
  padding: 20px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border);
}

.skeleton-card-header {
  height: 24px;
  width: 100px;
  background: linear-gradient(90deg, #f2f3f5 25%, #e5e6eb 50%, #f2f3f5 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  margin-bottom: 16px;
  border-radius: 4px;
}

.skeleton-info-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.skeleton-info-row {
  height: 16px;
  width: 100%;
  background: linear-gradient(90deg, #f2f3f5 25%, #e5e6eb 50%, #f2f3f5 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

.skeleton-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.skeleton-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.skeleton-stat-card {
  height: 100px;
  background: var(--bg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  border: 1px solid var(--border);
}

.skeleton-plantations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.skeleton-plantation-card {
  height: 240px;
  background: var(--bg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  border: 1px solid var(--border);
}

/* ====== Hero Section ====== */
.hero-section {
  position: relative;
  height: 320px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  background: var(--primary);
}

.hero-background {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.hero-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 32px;
  width: 100%;
  max-width: 1200px;
  padding: 0 24px;
}

.hero-avatar {
  position: relative;
}

.user-avatar-large {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 3px solid var(--bg);
  object-fit: cover;
}

.avatar-status {
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  background: var(--secondary);
  border: 2px solid var(--bg);
  border-radius: 50%;
}

.avatar-status.online {
  background: var(--secondary);
}

.avatar-status.offline {
  background: var(--text-lighter);
}

.avatar-upload-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 32px;
  height: 32px;
  background: var(--primary);
  border: 2px solid var(--bg);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--trans);
}

.avatar-upload-btn:hover {
  background: var(--primary-dark);
  transform: scale(1.1);
}

.avatar-upload-input {
  display: none;
}

.upload-icon {
  font-size: 14px;
  color: var(--bg);
}

.hero-info {
  flex: 1;
}

.hero-name {
  font-size: 28px;
  font-weight: 600;
  color: var(--bg);
  margin: 0 0 8px;
  line-height: 1.2;
}

.hero-title {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 4px;
  font-weight: 400;
}

.hero-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 16px;
}

.role-switcher {
  margin-bottom: 20px;
}

.role-switcher select {
  background: rgba(255, 255, 255, 0.1);
  color: var(--bg);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius);
  padding: 8px 12px;
  font-size: 14px;
  backdrop-filter: blur(4px);
  cursor: pointer;
}

.role-switcher select:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.4);
}

.role-switcher select option {
  background: var(--primary);
  color: var(--bg);
}

.hero-stats {
  display: flex;
  gap: 24px;
}

.stat-item {
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  padding: 12px 16px;
  border-radius: var(--radius);
  backdrop-filter: blur(4px);
}

.stat-number {
  display: block;
  font-size: 20px;
  font-weight: 600;
  color: var(--bg);
}

.stat-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
}

.hero-actions {
  display: flex;
  gap: 12px;
}

.btn-primary,
.btn-secondary {
  padding: 10px 20px;
  border-radius: var(--radius);
  font-weight: 500;
  font-size: 14px;
  border: none;
  cursor: pointer;
  transition: var(--trans);
}

.btn-primary {
  background: var(--bg);
  color: var(--primary);
}

.btn-primary:hover {
  background: var(--bg-light);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: var(--bg);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* ====== Main Layout ====== */
.main-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px 40px;
}

/* ====== Sidebar ====== */
.sidebar {
  position: sticky;
  top: 24px;
  height: fit-content;
}

.profile-card {
  background: var(--bg);
  border-radius: var(--radius-lg);
  padding: 20px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
}

.card-header h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: var(--text);
}

.last-update {
  font-size: 12px;
  color: var(--text-lighter);
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 8px 0;
  border-bottom: 1px solid var(--border-light);
}

.info-row:last-child {
  border-bottom: none;
}

.info-row.full-width {
  flex-direction: column;
  gap: 8px;
}

.info-label {
  font-size: 13px;
  color: var(--text-light);
  font-weight: 500;
  min-width: 70px;
}

.info-value {
  font-size: 13px;
  color: var(--text);
  text-align: right;
  flex: 1;
}

.info-value.bio {
  text-align: left;
  line-height: 1.5;
  white-space: pre-line;
  padding: 8px;
  background: var(--bg-light);
  border-radius: var(--radius);
}

/* 认证状态样式 */
.auth-success {
  color: var(--secondary);
  font-weight: 500;
}

.auth-pending {
  color: var(--warning);
  font-weight: 500;
}

.auth-failed {
  color: var(--danger);
  font-weight: 500;
}

.auth-expired {
  color: var(--danger);
  font-weight: 500;
}

.auth-none {
  color: var(--text-light);
}

.auth-type {
  font-size: 12px;
  color: var(--text-lighter);
  margin-left: 4px;
}

.expire-warning {
  color: var(--warning);
  font-weight: 500;
}

/* 设备管理样式 */
.security-card {
  margin-top: 16px;
}

.device-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.device-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: var(--bg-light);
  border-radius: var(--radius);
  border: 1px solid var(--border-light);
}

.device-info {
  font-size: 14px;
  color: var(--text);
}

.force-logout {
  padding: 4px 8px;
  background: var(--danger);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: var(--trans);
}

.force-logout:hover {
  background: #a04545;
}

/* ====== Main Content ====== */
.main-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* ====== Section Headers ====== */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text);
  margin: 0;
}

/* ====== Stats Section ====== */
.stats-section {
  background: var(--bg);
  border-radius: var(--radius-lg);
  padding: 20px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.stat-card {
  background: var(--bg-light);
  border-radius: var(--radius);
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: var(--trans);
}

.stat-card:hover {
  box-shadow: var(--shadow);
}

.stat-icon {
  font-size: 24px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-light);
  border-radius: var(--radius);
  color: var(--primary);
}

.stat-content h4 {
  font-size: 13px;
  color: var(--text-light);
  margin: 0 0 8px;
  font-weight: 500;
}

.stat-number {
  font-size: 24px;
  font-weight: 600;
  color: var(--text);
  margin: 0 0 4px;
}

.stat-trend {
  font-size: 12px;
  font-weight: 500;
  padding: 2px 6px;
  border-radius: 4px;
}

.stat-trend.positive {
  color: var(--secondary);
  background: rgba(16, 185, 129, 0.1);
}

.stat-trend.neutral {
  color: var(--text-light);
  background: var(--bg-lighter);
}

.stat-trend.negative {
  color: var(--danger);
  background: rgba(180, 92, 92, 0.1);
}

/* ====== Plantations Section ====== */
.plantations-section {
  background: var(--bg);
  border-radius: var(--radius-lg);
  padding: 20px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border);
}

.header-actions {
  display: flex;
  gap: 12px;
}

.btn-filter,
.btn-add {
  padding: 8px 16px;
  border-radius: var(--radius);
  font-size: 13px;
  font-weight: 500;
  border: 1px solid var(--border);
  cursor: pointer;
  transition: var(--trans);
  background: var(--bg);
}

.btn-filter {
  color: var(--text-light);
}

.btn-filter:hover {
  background: var(--bg-light);
}

.btn-add {
  background: var(--primary);
  color: var(--bg);
  border-color: var(--primary);
}

.btn-add:hover {
  background: var(--primary-dark);
}

.plantations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.plantation-card {
  background: var(--bg);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow);
  border: 1px solid var(--border);
  transition: var(--trans);
}

.plantation-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.card-image {
  position: relative;
  height: 140px;
  background: var(--primary-light);
  overflow: hidden;
}

.plantation-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: var(--trans);
}

.plantation-card:hover .plantation-img {
  transform: scale(1.05);
}

.image-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, var(--primary-light) 25%, transparent 25%),
    linear-gradient(-45deg, var(--primary-light) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, var(--primary-light) 75%),
    linear-gradient(-45deg, transparent 75%, var(--primary-light) 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
}

/* 新增设备池分组样式 */
.plantation-device-groups {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.plantation-device-group {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.group-title {
  font-weight: 600;
  margin-bottom: 12px;
  color: #333;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

/* 查看所有茶园按钮样式 */
.btn-view-all {
  padding: 6px 12px;
  background: #5f6163;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-view-all:hover {
  background: #005a9e;
}

/* 设备网格保持原有样式，增加间距 */
.devices-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
}

.status-overlay {
  position: absolute;
  top: 12px;
  right: 12px;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  color: var(--bg);
}

.status-pending {
  background: var(--text-light);
}

.status-processing {
  background: var(--accent);
}

.status-success {
  background: var(--secondary);
}

.card-content {
  padding: 16px;
}

.plantation-name {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px;
  color: var(--text);
}

.plantation-location {
  font-size: 12px;
  color: var(--text-light);
  margin: 0 0 16px;
}

.plantation-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.metric {
  text-align: center;
  padding: 8px;
  background: var(--bg-light);
  border-radius: var(--radius);
}

.metric-icon {
  display: block;
  font-size: 14px;
  margin-bottom: 4px;
}

.metric-value {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 2px;
}

.metric-label {
  font-size: 12px;
  color: var(--text-light);
}

.pest-status {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 0 0;
  border-top: 1px solid var(--border-light);
}

.pest-label {
  font-size: 13px;
  color: var(--text-light);
  font-weight: 500;
}

.pest-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.pest-none {
  background: rgba(16, 185, 129, 0.1);
  color: var(--secondary);
}

.pest-minor {
  background: #fef3c7;
  color: #92400e;
}

.pest-medium {
  background: #fed7aa;
  color: #c2410c;
}

.pest-severe {
  background: #fecaca;
  color: #dc2626;
}

.card-actions {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  background: var(--bg-light);
  border-top: 1px solid var(--border-light);
}

.btn-view,
.btn-manage {
  flex: 1;
  padding: 8px;
  border-radius: var(--radius);
  font-size: 13px;
  font-weight: 500;
  border: 1px solid var(--border);
  cursor: pointer;
  transition: var(--trans);
  background: var(--bg);
}

.btn-view {
  color: var(--text-light);
}

.btn-view:hover {
  background: var(--bg-light);
}

.btn-manage {
  background: var(--primary);
  color: var(--bg);
  border-color: var(--primary);
}

.btn-manage:hover {
  background: var(--primary-dark);
}

/* ====== Empty State ====== */
.empty-state {
  text-align: center;
  padding: 60px 24px;
  background: var(--bg-light);
  border-radius: var(--radius-lg);
  border: 1px dashed var(--border);
}

.empty-illustration {
  margin-bottom: 24px;
}

.empty-illustration svg {
  width: 100px;
  height: 100px;
}

.empty-state h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px;
  color: var(--text);
}

.empty-state p {
  font-size: 14px;
  color: var(--text-light);
  margin: 0 0 24px;
}

.btn-create {
  padding: 10px 24px;
  background: var(--primary);
  color: var(--bg);
  border: 1px solid var(--primary);
  border-radius: var(--radius);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: var(--trans);
}

.btn-create:hover {
  background: var(--primary-dark);
}

/* ====== 图表样式 ====== */
.chart-section {
  background: var(--bg);
  border-radius: var(--radius-lg);
  padding: 20px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border);
  margin-bottom: 24px;
}

.chart-container {
  position: relative;
  height: 200px;
  width: 100%;
}

.chart-container canvas {
  max-width: 100%;
  height: auto !important;
}

/* ====== 设备池样式 ====== */
.devices-section {
  background: var(--bg);
  border-radius: var(--radius-lg);
  padding: 20px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border);
  margin-bottom: 24px;
}

.devices-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.device-card {
  background: var(--bg-light);
  border-radius: var(--radius);
  padding: 16px;
  border: 1px solid var(--border-light);
}

.device-type {
  font-size: 12px;
  color: var(--text-light);
  margin-bottom: 8px;
}

.device-name {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
}

.device-status {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  display: inline-block;
  margin-bottom: 8px;
}

.device-status.online {
  background: rgba(16, 185, 129, 0.1);
  color: var(--secondary);
}

.device-status.offline {
  background: rgba(180, 92, 92, 0.1);
  color: var(--danger);
}

.device-firmware {
  font-size: 12px;
  color: var(--text-light);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.upgrade-btn {
  padding: 2px 8px;
  background: var(--warning);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 11px;
  cursor: pointer;
}

/* ====== 库存样式 ====== */
.inventory-section {
  background: var(--bg);
  border-radius: var(--radius-lg);
  padding: 20px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border);
}

.inventory-table {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
}

.inventory-header {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  background: var(--bg-light);
  padding: 12px;
  font-weight: 600;
  font-size: 14px;
  border-bottom: 1px solid var(--border);
}

.inventory-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  padding: 12px;
  border-bottom: 1px solid var(--border-light);
  font-size: 14px;
}

.inventory-row:last-child {
  border-bottom: none;
}

.inventory-row .warning {
  color: var(--warning);
  font-weight: 500;
}

.inventory-row .normal {
  color: var(--secondary);
}

/* ====== 响应式设计 ====== */
@media (max-width: 992px) {
  .main-layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: static;
  }
}

@media (max-width: 768px) {
  .hero-section {
    height: auto;
    padding: 32px 0;
  }

  .hero-content {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }

  .hero-stats {
    justify-content: center;
  }

  .hero-actions {
    justify-content: center;
    width: 100%;
  }

  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 480px) {
  .hero-stats {
    flex-direction: column;
    gap: 12px;
  }

  .hero-actions {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary,
  .btn-create {
    width: 100%;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .plantations-grid {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .header-actions {
    width: 100%;
    justify-content: space-between;
  }

  .plantation-metrics {
    grid-template-columns: 1fr;
  }
}
</style>