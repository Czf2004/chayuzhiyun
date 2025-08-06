<template>
  <div class="dashboard-container">
    <!-- 顶部导航 -->
    <header class="dashboard-header">
      <h1>河源智慧茶园大数据平台</h1>
      <div class="year-selector">
        <label for="year">选择年份:</label>
        <select id="year" v-model="currentYear" @change="handleYearChange">
          <option value="2025">2025</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
        </select>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="main-content">
      <!-- 左侧面板 -->
      <div class="left-panel">
        <div class="panel-section">
          <h2>茶园核心指标</h2>
          <div class="tea-metrics">
            <div class="metric-item">
              <span class="metric-label">茶园总数</span>
              <span class="metric-value">{{ teaMetrics.total }}</span>
              <span class="metric-unit">个</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">覆盖面积</span>
              <span class="metric-value">{{ teaMetrics.area }}</span>
              <span class="metric-unit">亩</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">茶树总数</span>
              <span class="metric-value">{{ teaMetrics.count }}</span>
              <span class="metric-unit">亿株</span>
            </div>
          </div>
        </div>

        <div class="panel-section equipment-status">
          <h2>监测设备状态</h2>
          <div class="equipment-grid">
            <div class="equipment-item" v-for="(equip, index) in equipmentList" :key="index">
              <div :class="`equipment-icon ${equip.iconClass}`"></div>
              <div class="equipment-info">
                <span class="equipment-name">{{ equip.name }}</span>
                <div class="equipment-metrics">
                  <span class="total">总数: {{ equip.total }}</span>
                  <span class="normal">正常: {{ equip.normal }}</span>
                  <span class="abnormal">异常: {{ equip.abnormal }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="panel-section">
          <h2>实时环境监测</h2>
          <div class="monitoring-grid">
            <div class="monitor-item" :class="{ abnormal: sensorData.tempAbnormal }">
              <div class="monitor-icon temperature-icon"></div>
              <span class="monitor-label">空气温度</span>
              <span id="temperature" class="monitor-value">{{ sensorData.temperature }}°C</span>
            </div>
            <div class="monitor-item" :class="{ abnormal: sensorData.humAbnormal }">
              <div class="monitor-icon humidity-icon"></div>
              <span class="monitor-label">空气湿度</span>
              <span id="humidity" class="monitor-value">{{ sensorData.humidity }}%</span>
            </div>
            <div class="monitor-item" :class="{ abnormal: sensorData.moistAbnormal }">
              <div class="monitor-icon soil-moisture-icon"></div>
              <span class="monitor-label">土壤湿度</span>
              <span id="soil-moisture" class="monitor-value">{{ sensorData.soil_moisture }}%</span>
            </div>
            <div class="monitor-item" :class="{ abnormal: sensorData.pestAbnormal }">
              <div class="monitor-icon pest-icon"></div>
              <span class="monitor-label">病虫害指数</span>
              <span id="pest-index" class="monitor-value">{{ sensorData.pest_index }}级</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 中间面板-地图相关 -->
      <div class="center-panel">
        <div class="map-header">
          <h2>{{ mapTitle }}</h2>
          <div class="map-actions">
            <button id="back-to-city" class="back-btn" @click="handleBackToCity" v-show="showBackBtn">
              <i class="back-icon"></i>返回全市
            </button>
            <div class="map-view-controls">
              <button class="view-btn" :class="{ active: currentView === 'map' }" @click="handleViewChange('map')">
                地图视图
              </button>
              <button class="view-btn" :class="{ active: currentView === 'satellite' }" @click="handleViewChange('satellite')">
                卫星视图
              </button>
            </div>
          </div>
        </div>
        <div class="map-container">
          <div id="map" style="width: 100%; height: 100%;"></div>
          <div class="map-stats">
            <div class="stat-item">
              <span class="stat-label">经营主体</span>
              <span class="stat-value">{{ mapStats.business }}</span>
              <span class="stat-unit">个</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">种植总面积</span>
              <span class="stat-value">{{ mapStats.area }}</span>
              <span class="stat-unit">亩</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">种植品种</span>
              <span class="stat-value">{{ mapStats.varieties }}</span>
              <span class="stat-unit">种</span>
            </div>
          </div>
        </div>
        <div id="town-list" class="town-list-container" v-show="showTownList">
          <h3 id="county-name">{{ countyName }}乡镇列表</h3>
          <div class="towns-scroll-container">
            <div class="town-list" id="towns-container">
              <div class="town-item" v-for="town in townList" :key="town" :class="{ selected: selectedTown === town }" @click="handleTownClick(town)">
                {{ town }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧面板 -->
      <div class="right-panel">
        <div class="panel-section farmer-overview">
          <h2>养殖户概况</h2>
          <div class="farmer-metrics">
            <div class="farmer-item">
              <span class="farmer-label">养殖户总数</span>
              <span class="farmer-value">1,256</span>
              <span class="farmer-unit">户</span>
            </div>
            <div class="farmer-item">
              <span class="farmer-label">年均收入</span>
              <span class="farmer-value">18.7</span>
              <span class="farmer-unit">万元</span>
            </div>
            <div class="farmer-item">
              <span class="farmer-label">平均种植面积</span>
              <span class="farmer-value">69.8</span>
              <span class="farmer-unit">亩/户</span>
            </div>
            <div class="farmer-item">
              <span class="farmer-label">茶叶平均售价</span>
              <span class="farmer-value">186</span>
              <span class="farmer-unit">元/斤</span>
            </div>
          </div>
        </div>

        <div class="panel-section income-trend">
          <h2>年龄收入趋势</h2>
          <div class="chart-container">
            <canvas id="ageIncomeChart"></canvas>
          </div>
        </div>

        <div class="panel-section realtime-video">
          <h2>实时监测视频流</h2>
          <div class="video-container">
            <img id="drone-video" :src="droneVideoSrc" alt="无人机实时视频流">
            <div class="video-controls">
              <select id="drone-selector" v-model="selectedDrone" @change="handleDroneChange" ref="droneSelector">
                <option value="drone1">无人机 #1 (紫城镇)</option>
                <option value="drone2">无人机 #2 (龙窝镇)</option>
                <option value="drone3">无人机 #3 (九和镇)</option>
                <option value="drone4">无人机 #4 (蓝塘镇)</option>
              </select>
              <button class="refresh-btn" @click="handleVideoRefresh">刷新</button>
            </div>
          </div>
          <div class="video-stats">
            <div class="stat-item">
              <span class="stat-label">当前监测点</span>
              <span id="current-monitor" class="stat-value">{{ currentMonitorPoint }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">最后更新时间</span>
              <span id="update-time" class="stat-value">{{ updateTime }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">健康指数</span>
              <span id="health-index" class="stat-value">{{ healthIndex }}</span>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 底部：趋势图表 -->
    <footer class="bottom-charts">
      <div class="chart-section">
        <h3>近30天生长指标曲线</h3>
        <div class="chart-container">
          <canvas id="growthTrendChart"></canvas>
        </div>
        <div class="chart-actions">
          <button class="export-data-btn" @click="handleExportData('近30天生长指标曲线')">导出数据</button>
        </div>
      </div>
      <div class="chart-section">
        <h3>病虫害发生频次热⼒图</h3>
        <div class="chart-container">
          <canvas id="pestHeatmapChart"></canvas>
        </div>
        <div class="chart-actions">
          <button class="export-data-btn" @click="handleExportData('病虫害发生频次热⼒图')">导出数据</button>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import Chart from 'chart.js/auto';
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix';

// 注册Chart.js矩阵插件
Chart.register(MatrixController, MatrixElement);

export default {
  data() {
    return {
      // 基础状态
      currentYear: '2025',
      updateTime: this.formatTime(new Date()),
      healthIndex: '92.5',
      hasBackend: false, // 后端API是否可用标志

      // 茶园指标数据
      teaMetrics: {
        total: '10,336',
        area: '87,675',
        count: '1.32'
      },

      // 设备状态数据
      equipmentList: [
        {
          name: '地面传感器',
          iconClass: 'ground-sensor',
          total: 326,
          normal: 318,
          abnormal: 8
        },
        {
          name: '无人机',
          iconClass: 'drone-sensor',
          total: 12,
          normal: 12,
          abnormal: 0
        },
        {
          name: '病虫害监测仪',
          iconClass: 'pest-sensor',
          total: 89,
          normal: 85,
          abnormal: 4
        }
      ],

      // 传感器数据 - 字段名与接口保持一致
      sensorData: {
        temperature: '25.6',
        humidity: '68',
        soil_moisture: '28.3',
        pest_index: '0.23',
        tempAbnormal: false,
        humAbnormal: false,
        moistAbnormal: false,
        pestAbnormal: false
      },

      // 地图相关状态
      currentRegion: {
        level: 'city',
        code: '441600',
        name: '河源市',
        town: ''
      },
      mapTitle: '河源市茶园分布',
      showBackBtn: false,
      currentView: 'map',
      mapStats: {
        business: '10,336',
        area: '87,675',
        varieties: '77'
      },
      showTownList: false,
      countyName: '',
      townList: [],
      selectedTown: '',
      mapChart: null,

      // 无人机视频相关状态
      selectedDrone: 'drone1',
      droneVideoSrc: 'https://picsum.photos/seed/drone/800/450',
      currentMonitorPoint: '紫金县紫城镇茶园',

      // 图表实例
      growthTrendChart: null,
      pestHeatmapChart: null,
      ageIncomeChart: null,
      sensorUpdateInterval: null,
      sseSource: null // SSE连接对象
    };
  },
  methods: {
    // 时间格式化工具
    formatTime(date) {
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).replace(/\//g, '-');
    },

    // 年份变化处理
    handleYearChange() {
      if (this.hasBackend) {
        // 调用后端API获取对应年份数据
        this.fetchHistoricalData(this.currentYear);
      } else {
        // 静态数据更新
        this.updatePestHeatmapData();
        this.updateGrowthTrendData();
      }
    },

    // 地图返回全市处理
    handleBackToCity() {
      this.currentRegion = {
        level: 'city',
        code: '441600',
        name: '河源市'
      };
      this.mapTitle = '河源市茶园分布';
      this.mapStats = {
        business: '10,336',
        area: '87,675',
        varieties: '77'
      };
      this.showBackBtn = false;
      this.showTownList = false;
      this.currentView = 'map';
      this.renderCityMap();
    },

    // 地图视图切换
    handleViewChange(viewType) {
      this.currentView = viewType;
      if (viewType === 'satellite' && this.currentRegion.level === 'town') {
        this.renderTownMap(this.currentRegion.town);
      }
    },

    // 乡镇点击处理
    handleTownClick(town) {
      this.selectedTown = town;
      this.currentRegion = {
        ...this.currentRegion,
        level: 'town',
        town: town
      };
      this.mapTitle = `${this.currentRegion.name}${town}茶园`;
      this.currentMonitorPoint = `${this.currentRegion.name}${town}茶园`;
      
      // 如果有后端API，获取该乡镇的详细数据
      if (this.hasBackend) {
        this.fetchPlantationDetail(this.currentRegion.code, town);
      } else {
        this.currentView = 'satellite';
        this.renderTownMap(town);
      }
    },

    // 无人机切换处理
    handleDroneChange() {
      const selectedOption = this.$refs.droneSelector.options[this.$refs.droneSelector.selectedIndex];
      const location = selectedOption.text.match(/\((.*?)\)/)[1];
      this.currentMonitorPoint = `紫金县${location}茶园`;
      
      if (this.hasBackend) {
        // 调用无人机实时画面接口
        this.fetchDroneImage(selectedOption.value);
      } else {
        this.droneVideoSrc = `https://picsum.photos/seed/${location}${Date.now()}/800/450`;
      }
    },

    // 视频刷新处理
    handleVideoRefresh() {
      if (this.hasBackend) {
        this.fetchDroneImage(this.selectedDrone);
      } else {
        const selectedOption = this.$refs.droneSelector.options[this.$refs.droneSelector.selectedIndex];
        const location = selectedOption.text.match(/\((.*?)\)/)[1];
        this.droneVideoSrc = `https://picsum.photos/seed/${location}${Date.now()}/800/450`;
        this.updateTime = this.formatTime(new Date());
        this.healthIndex = (90 + Math.random() * 10).toFixed(1);
      }
    },

    // 导出数据处理
    handleExportData(chartName) {
      if (this.hasBackend) {
        // 调用后端导出接口
        const exportType = chartName.includes('生长指标') ? 'growth' : 'pest';
        this.exportData(exportType);
      } else {
        alert(`正在导出${chartName}静态数据...`);
        setTimeout(() => {
          alert(`${chartName}静态数据导出成功！`);
        }, 1000);
      }
    },

    // 初始化地图
    initMap() {
      const mapContainer = document.getElementById('map');
      this.mapChart = echarts.init(mapContainer);
      
      this.mapChart.showLoading({
        text: '地图加载中...',
        textColor: '#fff',
        backgroundColor: 'rgba(0,0,0,0.7)',
        spinnerRadius: 20
      });
      
      if (this.hasBackend) {
        // 从后端获取茶园分布数据
        this.fetchPlantationList().then(() => {
          this.mapChart.hideLoading();
        }).catch(error => {
          console.error('获取茶园数据失败:', error);
          this.mapChart.hideLoading();
          this.renderCityMap(); // 失败时使用静态数据
        });
      } else {
        // 直接使用静态地图数据
        this.loadMapData(this.currentRegion.code)
          .then(geoJson => {
            echarts.registerMap('heyuan', geoJson);
            this.renderCityMap();
            this.mapChart.hideLoading();
          })
          .catch(error => {
            console.error('地图加载失败:', error);
            this.mapChart.hideLoading();
            this.mapChart.setOption({
              title: {
                text: '地图加载失败',
                left: 'center',
                top: 'center',
                textStyle: { color: '#ff4d4f' }
              }
            });
          });
      }
    },

    // 加载地图数据
    loadMapData(adcode) {
      return fetch(`https://geo.datav.aliyun.com/areas_v3/bound/${adcode}_full.json`)
        .then(response => {
          if (!response.ok) throw new Error(`HTTP错误: ${response.status}`);
          return response.json();
        });
    },

    // 渲染城市地图
    renderCityMap() {
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: params => `
            <div style="font-size:14px">${params.name}</div>
            <div>经营主体: ${params.data.business}个</div>
            <div>种植面积: ${params.data.area}亩</div>
            <div>茶叶品种: ${params.data.varieties}种</div>
          `
        },
        series: [{
          name: '茶园数据',
          type: 'map',
          map: this.currentRegion.level === 'city' ? 'heyuan' : 'county',
          roam: true,
          label: { show: true, fontSize: 12, color: '#fff' },
          itemStyle: {
            areaColor: '#1c5f8b',
            borderColor: '#00d2ff',
            borderWidth: 1
          },
          emphasis: { itemStyle: { areaColor: '#ff7a45' } },
          data: [
            { name: '源城区', adcode: '441602', business: 1856, area: 12500, varieties: 15 },
            { name: '紫金县', adcode: '441621', business: 2356, area: 18750, varieties: 22 },
            { name: '龙川县', adcode: '441622', business: 2103, area: 16800, varieties: 18 },
            { name: '连平县', adcode: '441623', business: 1520, area: 10500, varieties: 12 },
            { name: '和平县', adcode: '441624', business: 1680, area: 13200, varieties: 14 },
            { name: '东源县', adcode: '441625', business: 1821, area: 15925, varieties: 16 }
          ]
        }]
      };

      this.mapChart.setOption(option);
      this.mapChart.off('click');
      this.mapChart.on('click', params => {
        if (params.data?.adcode) {
          this.currentRegion = {
            level: 'county',
            code: params.data.adcode,
            name: params.name
          };
          this.mapTitle = `${this.currentRegion.name}茶园分布`;
          this.mapStats = {
            business: params.data.business.toLocaleString(),
            area: params.data.area.toLocaleString(),
            varieties: params.data.varieties
          };
          this.showBackBtn = true;
          this.showTownList = true;
          this.countyName = params.name;
          this.townList = this.getTownList(params.data.adcode);
          
          if (this.hasBackend) {
            this.fetchCountyPlantations(params.data.adcode);
          } else {
            this.loadMapData(params.data.adcode).then(geoJson => {
              echarts.registerMap('county', geoJson);
              this.renderCountyMap();
            });
          }
        }
      });
    },

    // 渲染县区地图
    renderCountyMap() {
      const countyInfo = {
        towns: this.townList
      };
      const data = countyInfo.towns.map(town => ({
        name: town,
        value: Math.floor(Math.random() * 500) + 300,
        business: Math.floor(Math.random() * 100) + 50,
        area: Math.floor(Math.random() * 2000) + 800
      }));

      const option = {
        tooltip: {
          trigger: 'item',
          formatter: params => `
            <div style="font-size:14px">${params.name}</div>
            <div>经营主体: ${params.data.business}个</div>
            <div>种植面积: ${params.data.area}亩</div>
          `
        },
        series: [{
          name: '乡镇数据',
          type: 'map',
          map: 'county',
          roam: true,
          label: { show: true, fontSize: 12, color: '#fff' },
          itemStyle: {
            areaColor: '#1c5f8b',
            borderColor: '#00d2ff',
            borderWidth: 1
          },
          emphasis: { itemStyle: { areaColor: '#ff7a45' } },
          data: data
        }]
      };

      this.mapChart.setOption(option);
      this.mapChart.off('click');
      this.mapChart.on('click', params => {
        if (params.data) {
          this.handleTownClick(params.name);
        }
      });
    },

    // 渲染乡镇地图
    renderTownMap(townName) {
      const option = {
        tooltip: { trigger: 'item' },
        geo: {
          map: 'county',
          roam: true,
          itemStyle: {
            areaColor: '#1a2a3a',
            borderColor: '#00d2ff',
            borderWidth: 1
          }
        },
        series: [{
          name: '茶园分布',
          type: 'scatter',
          coordinateSystem: 'geo',
          data: [
            { name: '茶园A区', value: [114.7, 23.7, 15], itemStyle: { color: '#00ff9d' } },
            { name: '茶园B区', value: [114.75, 23.72, 20], itemStyle: { color: '#00d2ff' } },
            { name: '茶园C区', value: [114.68, 23.68, 18], itemStyle: { color: '#ff7a45' } }
          ],
          symbolSize: val => val[2] || 10,
          label: {
            formatter: '{b}',
            position: 'right',
            show: true,
            color: '#fff'
          }
        }]
      };
      this.mapChart.setOption(option);
    },

    // 获取乡镇列表
    getTownList(adcode) {
      const townData = {
        '441602': ['上城街道', '东埔街道', '新江街道', '源西街道', '高埔岗街道'],
        '441621': ['紫城镇', '龙窝镇', '九和镇', '蓝塘镇', '古竹镇'],
        '441622': ['老隆镇', '佗城镇', '鹤市镇', '铁场镇', '龙母镇'],
        '441623': ['元善镇', '忠信镇', '大湖镇', '三角镇', '上坪镇'],
        '441624': ['阳明镇', '彭寨镇', '东水镇', '林寨镇', '热水镇'],
        '441625': ['仙塘镇', '灯塔镇', '骆湖镇', '船塘镇', '顺天镇']
      };
      return townData[adcode] || [];
    },

    // 初始化图表
    initCharts() {
      this.initAgeIncomeChart();
      this.initGrowthTrendChart();
      this.initPestHeatmapChart();
    },

    // 初始化年龄收入图表
    initAgeIncomeChart() {
      const ctx = document.getElementById('ageIncomeChart').getContext('2d');
      this.ageIncomeChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['20-30岁', '30-40岁', '40-50岁', '50-60岁', '60岁以上'],
          datasets: [{
            label: '养殖户数量',
            data: [120, 350, 450, 380, 220],
            backgroundColor: 'rgba(0, 210, 255, 0.7)',
            borderColor: 'rgba(0, 210, 255, 1)',
            borderWidth: 1,
            yAxisID: 'y'
          }, {
            label: '年均收入(万元)',
            data: [12.5, 18.3, 22.8, 19.5, 15.2],
            backgroundColor: 'rgba(255, 122, 69, 0.7)',
            borderColor: 'rgba(255, 122, 69, 1)',
            borderWidth: 1,
            yAxisID: 'y1'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                color: 'rgba(255, 255, 255, 0.7)',
                boxWidth: 12,
                font: { size: 11 }
              }
            }
          },
          scales: {
            y: {
              type: 'linear',
              position: 'left',
              beginAtZero: true,
              grid: { color: 'rgba(255, 255, 255, 0.1)' },
              ticks: { color: 'rgba(255, 255, 255, 0.7)' }
            },
            y1: {
              type: 'linear',
              position: 'right',
              beginAtZero: true,
              grid: { drawOnChartArea: false },
              ticks: { color: 'rgba(255, 255, 255, 0.7)' }
            },
            x: {
              grid: { color: 'rgba(255, 255, 255, 0.1)' },
              ticks: { color: 'rgba(255, 255, 255, 0.7)' }
            }
          }
        }
      });
    },

    // 初始化生长趋势图表
    initGrowthTrendChart() {
      const ctx = document.getElementById('growthTrendChart').getContext('2d');
      const labels = [];
      const now = new Date();
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(now.getDate() - i);
        labels.push(`${date.getMonth() + 1}/${date.getDate()}`);
      }

      this.growthTrendChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: '温度',
            data: this.generateTrendData(20, 30, 30),
            borderColor: '#00d2ff',
            backgroundColor: 'rgba(0, 210, 255, 0.1)',
            tension: 0.4,
            fill: true,
            yAxisID: 'y'
          }, {
            label: '湿度',
            data: this.generateTrendData(50, 80, 30),
            borderColor: '#00ff9d',
            backgroundColor: 'rgba(0, 255, 157, 0.1)',
            tension: 0.4,
            fill: true,
            yAxisID: 'y1'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                color: 'rgba(255, 255, 255, 0.7)',
                boxWidth: 12,
                font: { size: 11 }
              }
            }
          },
          scales: {
            y: {
              type: 'linear',
              position: 'left',
              min: 15,
              max: 35,
              grid: { color: 'rgba(255, 255, 255, 0.1)' },
              ticks: {
                color: 'rgba(255, 255, 255, 0.7)',
                callback: value => `${value}°C`
              }
            },
            y1: {
              type: 'linear',
              position: 'right',
              min: 40,
              max: 90,
              grid: { drawOnChartArea: false },
              ticks: {
                color: 'rgba(255, 255, 255, 0.7)',
                callback: value => `${value}%`
              }
            },
            x: {
              grid: { color: 'rgba(255, 255, 255, 0.1)' },
              ticks: { color: 'rgba(255, 255, 255, 0.7)', maxTicksLimit: 10 }
            }
          }
        }
      });
    },

    // 初始化病虫害热力图
    initPestHeatmapChart() {
      const ctx = document.getElementById('pestHeatmapChart').getContext('2d');
      const pestData = this.generatePestHeatmapData();
      const colorScale = [
        'rgba(0, 210, 255, 0.1)',
        'rgba(0, 210, 255, 0.3)',
        'rgba(0, 210, 255, 0.5)',
        'rgba(255, 122, 69, 0.5)',
        'rgba(255, 77, 79, 0.7)'
      ];

      this.pestHeatmapChart = new Chart(ctx, {
        type: 'matrix',
        data: {
          datasets: [{
            label: '病虫害发生频次',
            data: pestData,
            backgroundColor: context => {
              const value = context.dataset.data[context.dataIndex].v;
              const index = Math.min(Math.floor(value / 20), colorScale.length - 1);
              return colorScale[index];
            },
            borderColor: '#1a2a3a',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'bottom',
              labels: {
                color: 'rgba(255, 255, 255, 0.7)',
                generateLabels: chart => colorScale.map((color, index) => ({
                  text: `${index * 20}-${(index + 1) * 20}`,
                  fillStyle: color,
                  strokeStyle: '#1a2a3a',
                  lineWidth: 1,
                  hidden: false,
                  index
                }))
              }
            },
            tooltip: {
              callbacks: {
                title: () => '',
                label: context => {
                  const data = context.dataset.data[context.dataIndex];
                  return `${data.y} ${data.x}: ${data.v}次`;
                }
              }
            }
          },
          scales: {
            x: {
              type: 'category',
              position: 'bottom',
              grid: { color: 'rgba(255, 255, 255, 0.1)' },
              ticks: { color: 'rgba(255, 255, 255, 0.7)' }
            },
            y: {
              type: 'category',
              position: 'left',
              grid: { color: 'rgba(255, 255, 255, 0.1)' },
              ticks: { color: 'rgba(255, 255, 255, 0.7)' }
            }
          }
        }
      });
    },

    // 生成趋势数据
    generateTrendData(min, max, length) {
      const data = [];
      let value = min + Math.random() * (max - min);
      for (let i = 0; i < length; i++) {
        value += (Math.random() - 0.5) * (max - min) * 0.1;
        value = Math.max(min, Math.min(max, value));
        data.push(parseFloat(value.toFixed(1)));
      }
      return data;
    },

    // 生成病虫害热力图数据
    generatePestHeatmapData() {
      const counties = ['源城区', '紫金县', '龙川县', '连平县', '和平县', '东源县'];
      const pests = ['茶小绿叶蝉', '茶尺蠖', '茶蚜', '茶炭疽病', '茶云纹叶枯病'];
      return counties.flatMap(county => 
        pests.map(pest => ({
          x: pest,
          y: county,
          v: Math.floor(Math.random() * 100)
        }))
      );
    },

    // 初始化传感器数据更新
    initSensorUpdates() {
      if (this.hasBackend) {
        // 建立SSE连接获取实时数据
        this.setupSSE();
      } else {
        // 静态数据定时更新
        this.updateSensorData();
        this.sensorUpdateInterval = setInterval(() => this.updateSensorData(), 5 * 60 * 1000);
      }
    },

    // 设置SSE连接
    setupSSE() {
      // 关闭现有连接
      if (this.sseSource) {
        this.sseSource.close();
      }
      
      // 建立新的SSE连接 - 使用文档中规定的接口路径
      this.sseSource = new EventSource(`/weather/realtime/${this.currentRegion.code}`);
      
      this.sseSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.code === 200) {
            // 更新传感器数据 - 与文档响应字段保持一致
            this.sensorData = {
              ...this.sensorData,
              temperature: data.data.temperature.value.toFixed(1),
              humidity: data.data.humidity.value.toFixed(0),
              soil_moisture: data.data.soil_moisture?.value.toFixed(1) || this.sensorData.soil_moisture,
              pest_index: data.data.pest_index?.value.toFixed(2) || this.sensorData.pest_index,
              tempAbnormal: data.data.temperature.value < 15 || data.data.temperature.value > 32,
              humAbnormal: data.data.humidity.value < 40 || data.data.humidity.value > 85,
              moistAbnormal: data.data.soil_moisture?.value < 20 || data.data.soil_moisture?.value > 35,
              pestAbnormal: data.data.pest_index?.value > 0.3
            };
            this.updateTime = this.formatTime(new Date());
          }
        } catch (error) {
          console.error('解析SSE数据失败:', error);
        }
      };
      
      this.sseSource.onerror = (error) => {
        console.error('SSE连接错误:', error);
        // 错误重连
        setTimeout(() => this.setupSSE(), 5000);
      };
    },

    // 更新传感器静态数据
    updateSensorData() {
      const temperature = (24 + Math.random() * 5).toFixed(1);
      const humidity = Math.floor(55 + Math.random() * 20);
      const soil_moisture = (25 + Math.random() * 10).toFixed(1);
      const pest_index = (0.2 + Math.random() * 0.3).toFixed(2);

      this.sensorData = {
        ...this.sensorData,
        temperature,
        humidity,
        soil_moisture,
        pest_index,
        tempAbnormal: temperature < 15 || temperature > 32,
        humAbnormal: humidity < 40 || humidity > 85,
        moistAbnormal: soil_moisture < 20 || soil_moisture > 35,
        pestAbnormal: pest_index > 0.3
      };
    },

    // 更新病虫害热力图数据
    updatePestHeatmapData() {
      const newData = this.generatePestHeatmapData();
      this.pestHeatmapChart.data.datasets[0].data = newData;
      this.pestHeatmapChart.update();
    },

    // 更新生长趋势数据
    updateGrowthTrendData() {
      this.growthTrendChart.data.datasets[0].data = this.generateTrendData(20, 30, 30);
      this.growthTrendChart.data.datasets[1].data = this.generateTrendData(50, 80, 30);
      this.growthTrendChart.update();
    },

    // 后端API调用 - 获取茶园列表
    fetchPlantationList() {
      return fetch('/plantations/info', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(response => {
        if (!response.ok) throw new Error(`HTTP错误: ${response.status}`);
        return response.json();
      })
      .then(data => {
        if (data.code === 200) {
          // 处理茶园列表数据
          this.teaMetrics = {
            total: data.data.total.toLocaleString(),
            area: data.data.area.toLocaleString(),
            count: data.data.count.toFixed(2)
          };
          return true;
        }
        throw new Error(`接口错误: ${data.message}`);
      });
    },

    // 后端API调用 - 获取茶园详情
    fetchPlantationDetail(plantationId, town) {
      return fetch(`/plantations/info/${plantationId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(response => {
        if (!response.ok) throw new Error(`HTTP错误: ${response.status}`);
        return response.json();
      })
      .then(data => {
        if (data.code === 200) {
          this.currentView = 'satellite';
          this.renderTownMap(town);
          return true;
        }
        throw new Error(`接口错误: ${data.message}`);
      });
    },

    // 后端API调用 - 获取无人机图像
    fetchDroneImage(droneId) {
      return fetch(`/drone-images/teaplanation/picture/single/${droneId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(response => {
        if (!response.ok) throw new Error(`HTTP错误: ${response.status}`);
        return response.json();
      })
      .then(data => {
        if (data.code === 200 && data.data.drone_images.length > 0) {
          this.droneVideoSrc = data.data.drone_images[0].url;
          this.updateTime = this.formatTime(new Date());
          this.healthIndex = (90 + Math.random() * 10).toFixed(1);
          return true;
        }
        throw new Error(`接口错误: ${data.message}`);
      });
    },

    // 后端API调用 - 获取历史数据
    fetchHistoricalData(year) {
      return fetch(`/weather/history/${this.currentRegion.code}?startTime=${year}-01-01&endTime=${year}-12-31`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(response => {
        if (!response.ok) throw new Error(`HTTP错误: ${response.status}`);
        return response.json();
      })
      .then(data => {
        if (data.code === 200) {
          // 更新图表数据
          this.updateChartsWithHistoricalData(data.data);
          return true;
        }
        throw new Error(`接口错误: ${data.message}`);
      });
    },

    // 后端API调用 - 导出数据
    exportData(type) {
      const endpoint = type === 'growth' 
        ? `/yield-prediction/report/${this.currentRegion.code}`
        : `/pests/history/export/${this.currentRegion.code}`;
      
      fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ format: 'pdf', include_visualizations: true })
      })
      .then(response => {
        if (!response.ok) throw new Error(`HTTP错误: ${response.status}`);
        return response.json();
      })
      .then(data => {
        if (data.code === 200) {
          window.open(data.data.downloadUrl, '_blank');
        } else {
          throw new Error(`接口错误: ${data.message}`);
        }
      })
      .catch(error => {
        console.error('导出数据失败:', error);
        alert('导出数据失败，请稍后重试');
      });
    },

    // 使用历史数据更新图表
    updateChartsWithHistoricalData(data) {
      // 实现历史数据更新图表逻辑
      console.log('更新图表数据:', data);
    },

    // 检测后端是否可用
    checkBackendAvailability() {
      fetch('/user/health', { method: 'GET' })
        .then(response => {
          this.hasBackend = response.ok;
        })
        .catch(() => {
          this.hasBackend = false;
        });
    }
  },
  mounted() {
    // 检测后端是否可用
    this.checkBackendAvailability();
    
    // 初始化地图和图表
    this.initMap();
    this.initCharts();
    
    // 初始化传感器更新
    this.initSensorUpdates();
    
    // 窗口大小变化时重绘图表
    window.addEventListener('resize', () => {
      this.mapChart?.resize();
      this.growthTrendChart?.resize();
      this.pestHeatmapChart?.resize();
      this.ageIncomeChart?.resize();
    });
  },
  beforeUnmount() {
    // 清理资源
    clearInterval(this.sensorUpdateInterval);
    if (this.sseSource) {
      this.sseSource.close();
    }
    this.mapChart?.dispose();
    this.growthTrendChart?.destroy();
    this.pestHeatmapChart?.destroy();
    this.ageIncomeChart?.destroy();
  }
};
</script>

<style scoped>
/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Arial', sans-serif;
}

body {
  background-color: #0f1a1f;
  color: #ffffff;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 顶部导航 */
.dashboard-header {
  background-color: #1a2a3a;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.dashboard-header h1 {
  font-size: 22px;
  color: #00d2ff;
}

.year-selector {
  display: flex;
  align-items: center;
  gap: 10px;
}

.year-selector label {
  font-size: 14px;
  color: #889aa9;
}

.year-selector select {
  background-color: #253b4b;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 14px;
}

/* 主内容区 */
.main-content {
  display: flex;
  flex-grow: 1;
  gap: 15px;
  padding: 15px;
  height: calc(100vh - 70px - 250px);
}

.panel-section {
  background-color: #253b4b;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
}

.panel-section h2 {
  font-size: 16px;
  color: #00d2ff;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

/* 左侧面板 */
.left-panel {
  width: 25%;
  display: flex;
  flex-direction: column;
  gap: 15px;
  overflow-y: auto;
}

/* 茶园指标 */
.tea-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.metric-item {
  background-color: #1a2a3a;
  border-radius: 5px;
  padding: 12px;
  text-align: center;
}

.metric-label {
  display: block;
  font-size: 12px;
  color: #889aa9;
  margin-bottom: 5px;
}

.metric-value {
  font-size: 16px;
  font-weight: bold;
}

.metric-unit {
  font-size: 12px;
  color: #889aa9;
}

/* 设备状态 */
.equipment-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.equipment-item {
  background-color: #1a2a3a;
  border-radius: 5px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.equipment-icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  position: relative;
}

.ground-sensor {
  background-color: rgba(0, 255, 157, 0.2);
}

.ground-sensor::after {
  content: '';
  position: absolute;
  width: 15px;
  height: 15px;
  background-color: #00ff9d;
  border-radius: 50%;
  top: 7.5px;
  left: 7.5px;
}

.drone-sensor {
  background-color: rgba(0, 210, 255, 0.2);
}

.drone-sensor::after {
  content: '';
  position: absolute;
  width: 15px;
  height: 15px;
  background-color: #00d2ff;
  border-radius: 50%;
  top: 7.5px;
  left: 7.5px;
}

.pest-sensor {
  background-color: rgba(255, 122, 69, 0.2);
}

.pest-sensor::after {
  content: '';
  position: absolute;
  width: 15px;
  height: 15px;
  background-color: #ff7a45;
  border-radius: 50%;
  top: 7.5px;
  left: 7.5px;
}

.equipment-name {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 8px;
}

.equipment-metrics {
  display: flex;
  flex-direction: column;
  gap: 3px;
  font-size: 12px;
}

.total {
  color: #889aa9;
}

.normal {
  color: #00ff9d;
}

.abnormal {
  color: #ff4d4f;
}

/* 实时环境监测 */
.monitoring-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.monitor-item {
  background-color: #1a2a3a;
  border-radius: 5px;
  padding: 12px;
  text-align: center;
  transition: all 0.3s;
}

.monitor-item.abnormal {
  border: 1px solid #ff4d4f;
}

.monitor-icon {
  width: 30px;
  height: 30px;
  margin: 0 auto 10px;
  border-radius: 50%;
  position: relative;
}

.temperature-icon {
  background-color: rgba(255, 122, 69, 0.2);
}

.temperature-icon::after {
  content: '';
  position: absolute;
  width: 15px;
  height: 15px;
  background-color: #ff7a45;
  border-radius: 50%;
  top: 7.5px;
  left: 7.5px;
}

.humidity-icon {
  background-color: rgba(0, 210, 255, 0.2);
}

.humidity-icon::after {
  content: '';
  position: absolute;
  width: 15px;
  height: 15px;
  background-color: #00d2ff;
  border-radius: 50%;
  top: 7.5px;
  left: 7.5px;
}

.soil-moisture-icon {
  background-color: rgba(0, 255, 157, 0.2);
}

.soil-moisture-icon::after {
  content: '';
  position: absolute;
  width: 15px;
  height: 15px;
  background-color: #00ff9d;
  border-radius: 50%;
  top: 7.5px;
  left: 7.5px;
}

.pest-icon {
  background-color: rgba(114, 46, 209, 0.2);
}

.pest-icon::after {
  content: '';
  position: absolute;
  width: 15px;
  height: 15px;
  background-color: #722ed1;
  border-radius: 50%;
  top: 7.5px;
  left: 7.5px;
}

.monitor-label {
  font-size: 13px;
  color: #889aa9;
  margin-bottom: 5px;
  display: block;
}

.monitor-value {
  font-size: 16px;
  font-weight: bold;
}

/* 中间面板 */
.center-panel {
  width: 50%;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.map-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.map-header h2 {
  font-size: 18px;
  color: #ffffff;
  margin: 0;
  padding: 0;
  border: none;
}

.map-actions {
  display: flex;
  gap: 10px;
}

.back-btn {
  background-color: #006ba3;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  z-index: 10;
}

.back-btn:hover {
  background-color: #0087c3;
}

.back-icon {
  width: 14px;
  height: 14px;
  background-color: currentColor;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='currentColor' d='M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z'/%3E%3C/svg%3E") no-repeat center;
}

.map-view-controls {
  display: flex;
  gap: 5px;
}

.view-btn {
  background-color: #253b4b;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 13px;
  cursor: pointer;
}

.view-btn.active {
  background-color: #006ba3;
}

.map-container {
  flex-grow: 1;
  background-color: #1a2a3a;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}

#map {
  width: 100%;
  height: 100%;
}

.map-stats {
  position: absolute;
  top: 15px;
  right: 15px;
  display: flex;
  gap: 15px;
  background-color: rgba(26, 42, 58, 0.8);
  padding: 10px 15px;
  border-radius: 6px;
  z-index: 5;
}

.stat-item {
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 12px;
  color: #889aa9;
  margin-bottom: 3px;
}

.stat-value {
  font-size: 16px;
  font-weight: bold;
}

.stat-unit {
  font-size: 12px;
  color: #889aa9;
}

/* 乡镇列表 */
.town-list-container {
  background-color: #1a2a3a;
  border-radius: 8px;
  padding: 15px;
  max-height: 150px;
}

#county-name {
  font-size: 16px;
  color: #00d2ff;
  margin-bottom: 15px;
}

.towns-scroll-container {
  max-height: calc(100% - 30px);
  overflow-y: auto;
}

.town-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px;
}

.town-item {
  background-color: #253b4b;
  border-radius: 4px;
  padding: 8px 10px;
  font-size: 14px;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.town-item:hover {
  background-color: #006ba3;
}

.town-item.selected {
  background-color: #006ba3;
}

/* 右侧面板 */
.right-panel {
  width: 25%;
  display: flex;
  flex-direction: column;
  gap: 15px;
  overflow-y: auto;
}

/* 养殖户概况 */
.farmer-metrics {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.farmer-item {
  background-color: #1a2a3a;
  border-radius: 5px;
  padding: 12px;
  text-align: center;
}

.farmer-label {
  display: block;
  font-size: 12px;
  color: #889aa9;
  margin-bottom: 5px;
}

.farmer-value {
  font-size: 16px;
  font-weight: bold;
}

.farmer-unit {
  font-size: 12px;
  color: #889aa9;
}

/* 年龄分布图表 */
.income-trend .chart-container {
  height: 200px;
}

/* 实时视频流 */
.realtime-video {
  display: flex;
  flex-direction: column;
}

.video-container {
  background-color: #1a2a3a;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 15px;
}

#drone-video {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.video-controls {
  display: flex;
  padding: 10px;
  gap: 10px;
  background-color: #1a2a3a;
}

#drone-selector {
  flex-grow: 1;
  background-color: #253b4b;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 10px;
  font-size: 14px;
}

.refresh-btn {
  background-color: #006ba3;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
}

.video-stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 底部趋势图表 */
.bottom-charts {
  display: flex;
  gap: 15px;
  padding: 0 15px 15px;
  height: 250px;
}

.chart-section {
  flex: 1;
  background-color: #253b4b;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  flex-direction: column;
}

.chart-section h3 {
  font-size: 15px;
  color: #00d2ff;
  margin-bottom: 10px;
}

.chart-container {
  flex-grow: 1;
  position: relative;
}

.chart-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.export-data-btn {
  background-color: #1a2a3a;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  font-size: 12px;
  cursor: pointer;
}

/* 响应式设计 */
@media (max-width: 1440px) {
  .tea-metrics {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .farmer-metrics {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 1024px) {
  .main-content {
    flex-direction: column;
    height: auto;
  }
  
  .left-panel, .center-panel, .right-panel {
    width: 100%;
    height: 400px;
  }
  
  .bottom-charts {
    flex-direction: column;
    height: auto;
  }
  
  .chart-section {
    height: 300px;
  }
}

@media (max-width: 768px) {
  .equipment-grid {
    flex-direction: column;
  }
  
  .equipment-item {
    flex: none;
  }
  
  .monitoring-grid {
    grid-template-columns: 1fr;
  }
  
  .town-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .dashboard-header {
    flex-direction: column;
    height: auto;
    gap: 10px;
    padding: 10px;
  }
  
  .map-stats {
    flex-direction: column;
    gap: 5px;
    padding: 5px 10px;
  }
  
  .tea-metrics {
    grid-template-columns: 1fr;
  }
  
  .town-list {
    grid-template-columns: 1fr;
  }
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: #1a2a3a;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb {
  background: #006ba3;
  border-radius: 3px;
  transition: background 0.2s ease;
}
::-webkit-scrollbar-thumb:hover {
  background: #0087c3;
}
</style>