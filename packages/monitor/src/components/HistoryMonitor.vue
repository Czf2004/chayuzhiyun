<template>
  <div class="history-monitor-container">
    <div class="page-title">茶园历史监测数据查询</div>

    <!-- 查询条件区 -->
    <div class="query-form">
      <!-- 茶园选择 -->
      <el-select
          v-model="plantationId"
          placeholder="请选择茶园"
          clearable
          class="query-item"
          @change="fetchData"
      >
        <el-option
            v-for="item in plantationList"
            :key="item.plantation_id"
            :label="item.plantation_name"
            :value="item.plantation_id"
        ></el-option>
      </el-select>

      <!-- 手动时间输入 -->
      <div class="manual-time-range">
        <el-date-picker
            v-model="startTime"
            type="datetime"
            placeholder="开始时间"
            class="time-input"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
        />
        <span class="range-separator">至</span>
        <el-date-picker
            v-model="endTime"
            type="datetime"
            placeholder="结束时间"
            class="time-input"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
        />
      </div>

      <!-- 数据类型选择 -->
      <el-select
          v-model="dataType"
          placeholder="请选择数据类型"
          clearable
          class="query-item"
          @change="handleDataTypeSwitch"
      >
        <el-option label="气象数据" value="weather"></el-option>
        <el-option label="土壤数据" value="soil"></el-option>
      </el-select>

      <!-- 土壤传感器类型选择（数据类型为 soil 时显示） -->
      <el-select
          v-if="dataType === 'soil'"
          v-model="sensorType"
          placeholder="请选择传感器类型"
          clearable
          class="query-item"
      >
        <el-option label="水分传感器" value="moisture"></el-option>
        <el-option label="温度传感器" value="temperature"></el-option>
        <el-option label="pH 传感器" value="ph"></el-option>
        <el-option label="养分传感器" value="nutrient"></el-option>
        <el-option label="电导率传感器" value="ec"></el-option>
      </el-select>

      <!-- 查询按钮 -->
      <el-button type="primary" @click="handleQuery" class="query-btn">
        <i class="el-icon-search"></i> 查询
      </el-button>

      <!-- 重置按钮 -->
      <el-button @click="handleReset" class="reset-btn">
        <i class="el-icon-refresh"></i> 重置
      </el-button>
    </div>

    <!-- 加载状态 -->
    <el-loading
        v-if="loading"
        text="正在查询数据，请稍候..."
        background="rgba(255, 255, 255, 0.7)"
    ></el-loading>

    <!-- 数据展示区 -->
    <div v-if="!loading" class="data-display">
      <div v-if="tableData.length === 0 && queryExecuted" class="empty-state">
        <el-empty description="暂无符合条件的数据"></el-empty>
      </div>

      <!-- 气象数据表格 -->
      <template v-if="dataType === 'weather'">
        <el-table
            v-if="tableData.length > 0"
            :data="tableData"
            border
            stripe
            :header-cell-style="{ background: '#f5f7fa' }"
            class="weather-table"
        >
          <el-table-column
              prop="timestamp"
              label="数据采集时间"
              width="220"
          ></el-table-column>
          <el-table-column
              label="温度"
          >
            <template #default="scope">
              {{ scope.row.temperature.value }} {{ scope.row.temperature.unit }}
            </template>
          </el-table-column>
          <el-table-column
              label="相对湿度"
          >
            <template #default="scope">
              {{ scope.row.humidity.value }} {{ scope.row.humidity.unit }}
            </template>
          </el-table-column>
          <el-table-column
              label="光照强度"
          >
            <template #default="scope">
              {{ scope.row.light.value }} {{ scope.row.light.unit }}
            </template>
          </el-table-column>
          <el-table-column
              label="风速"
          >
            <template #default="scope">
              {{ scope.row.wind.speed.value }} {{ scope.row.wind.speed.unit }}
            </template>
          </el-table-column>
          <el-table-column
              label="风向"
          >
            <template #default="scope">
              {{ scope.row.wind.direction.value }} {{ scope.row.wind.direction.unit }}（{{ scope.row.wind.direction.description }}）
            </template>
          </el-table-column>
          <el-table-column
              label="降雨量"
          >
            <template #default="scope">
              {{ scope.row.rainfall.value }} {{ scope.row.rainfall.unit }}（{{ scope.row.rainfall.duration }}）
            </template>
          </el-table-column>
          <el-table-column
              label="设备ID"
              prop="device.id"
          ></el-table-column>
          <el-table-column
              label="设备类型"
              prop="device.type"
          ></el-table-column>
          <el-table-column
              label="设备位置"
              prop="device.location.name"
          ></el-table-column>
          <el-table-column
              label="设备状态"
              prop="device.status"
          ></el-table-column>
          <el-table-column
              label="最后校准时间"
              prop="device.last_calibration"
          ></el-table-column>
        </el-table>
      </template>

      <!-- 土壤数据表格 -->
      <template v-else-if="dataType === 'soil'">
        <el-table
            :data="tableData"
            border
            stripe
            :header-cell-style="{ background: '#f5f7fa' }"
            class="soil-table"
        >
          <el-table-column
              prop="timestamp"
              label="数据采集时间"
              width="220"
          ></el-table-column>
          <el-table-column
              :label="sensorLabel"
              prop="value"
          ></el-table-column>
          <el-table-column
              prop="unit"
              label="单位"
          ></el-table-column>
          <el-table-column
              prop="sensor_id"
              label="传感器 ID"
          ></el-table-column>
          <el-table-column
              v-show="showMoisture"
              prop="soil_moisture.value"
              label="土壤湿度"
          ></el-table-column>
          <el-table-column
              v-show="showTemperature"
              prop="soil_temperature.value"
              label="土壤温度"
          ></el-table-column>
          <el-table-column
              v-show="showPh"
              prop="soil_ph.value"
              label="土壤酸碱度"
          ></el-table-column>
          <el-table-column
              v-show="showNutrient"
              label="土壤养分(N/P/K)"
          >
            <template #default="scope">
              N: {{ scope.row.soil_nutrients.nitrogen.value }}<br />
              P: {{ scope.row.soil_nutrients.phosphorus.value }}<br />
              K: {{ scope.row.soil_nutrients.potassium.value }}
            </template>
          </el-table-column>
          <el-table-column
              v-show="showEc"
              prop="soil_electrical_conductivity.value"
              label="土壤电导率"
          ></el-table-column>
        </el-table>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import {
  ElMessage,
  ElEmpty,
  ElButton,
  ElTable,
  ElTableColumn,
  ElSelect,
  ElOption,
  ElLoading,
  ElDatePicker
} from 'element-plus';
import axios from 'axios';

// 实际后端基础地址
const baseUrl = 'http://your-backend-api-base-url'; // 替换为实际的后端地址

// 响应式状态
const plantationId = ref('');
const startTime = ref('');
const endTime = ref('');
const dataType = ref('');
const sensorType = ref('');
const tableData = ref([]);
const plantationList = ref([]);
const loading = ref(false);
const queryExecuted = ref(false);
const showMoisture = ref(false);
const showTemperature = ref(false);
const showPh = ref(false);
const showNutrient = ref(false);
const showEc = ref(false);

// 获取茶园列表
const fetchPlantationList = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/plantations`);
    plantationList.value = response.data;
  } catch (error) {
    ElMessage.error('获取茶园列表失败');
  }
};

// 在组件挂载时调用
onMounted(() => {
  fetchPlantationList();
});

// 数据类型切换时重置土壤相关显示
const handleDataTypeSwitch = () => {
  sensorType.value = '';
  tableData.value = [];
  resetSoilFields();
};

const resetSoilFields = () => {
  showMoisture.value = false;
  showTemperature.value = false;
  showPh.value = false;
  showNutrient.value = false;
  showEc.value = false;
};

// 查询处理：先校验再请求
const handleQuery = async () => {
  // 1. 校验时间格式
  if (!validateAllTime()) return;
  // 2. 校验其他参数
  if (!validateOtherParams()) return;

  loading.value = true;
  queryExecuted.value = true;

  // 构造请求参数，根据后端接口要求调整字段名
  const requestParams = {
    plantationId: plantationId.value,
    startTime: startTime.value,
    endTime: endTime.value,
    dataType: dataType.value,
    sensorType: sensorType.value,
  };

  try {
    // 发送请求，假设后端查询接口为 /api/teaGarden/query
    const response = await axios.post(`${baseUrl}/api/teaGarden/query`, requestParams);
    // 根据后端返回的响应结构，提取数据。假设后端返回 { code: 200, data: { historical_weather: [...] } } 格式
    if (response.data.code === 200) {
      if (dataType.value === 'weather') {
        tableData.value = response.data.data.historical_weather;
      } else {
        // 如果是土壤数据，这里也需按后端返回结构处理，示例省略，可参考气象数据处理方式
        tableData.value = response.data.data.historical_soil_data;
      }
    } else {
      ElMessage.warning('查询失败，后端返回错误');
    }
  } catch (error) {
    ElMessage.error('网络异常或接口错误，请稍后重试');
    console.error('请求失败:', error);
  } finally {
    loading.value = false;
  }
};

// 校验时间格式（查询时统一校验）
const validateAllTime = () => {
  const checkStart = validateTime(startTime.value, 'start')
  const checkEnd = validateTime(endTime.value, 'end')
  return checkStart && checkEnd
};

const validateTime = (val, type) => {
  if (!val) {
    ElMessage.warning('请填写完整的时间信息')
    return false
  }
  if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(val)) {
    ElMessage.warning(`${type === 'start' ? '开始时间' : '结束时间'}格式错误，请输入 YYYY-MM-DD HH:mm:ss 格式`)
    return false
  }
  return true
};

// 校验茶园、数据类型等其他参数
const validateOtherParams = () => {
  if (!plantationId.value) {
    ElMessage.warning('请选择要查询的茶园')
    return false
  }
  if (!dataType.value) {
    ElMessage.warning('请选择查询的数据类型')
    return false
  }
  if (dataType.value === 'soil' && !sensorType.value) {
    ElMessage.warning('选择土壤数据类型时，请指定传感器类型')
    return false
  }
  return true
};

// 重置表单数据
const handleReset = () => {
  plantationId.value = '';
  startTime.value = '';
  endTime.value = '';
  dataType.value = '';
  sensorType.value = '';
  tableData.value = [];
  queryExecuted.value = false;
  resetSoilFields();
};

// 根据传感器类型动态显示表格列标题
const sensorLabel = computed(() => ({
  moisture: '土壤湿度',
  temperature: '土壤温度',
  ph: '土壤酸碱度',
  nutrient: '土壤养分(N/P/K)',
  ec: '土壤电导率',
}[sensorType.value] || '测量值'))
</script>

<style scoped>
.history-monitor-container {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  min-height: 500px;
}

.page-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.query-form {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;
  align-items: center;
}

.query-item {
  width: 220px;
}

.manual-time-range {
  display: flex;
  align-items: center;
  gap: 8px;
}

.time-input {
  width: 220px;
}

.range-separator {
  color: #666;
}

.query-btn, .reset-btn {
  height: 40px;
  padding: 0 20px;
}

.data-display {
  margin-top: 16px;
}

.empty-state {
  margin: 50px 0;
  text-align: center;
}

.weather-table, .soil-table {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

/* 响应式适配，不同屏幕宽度下调整布局 */
@media (max-width: 1200px) {
  .query-item, .time-input {
    width: 180px;
  }
}

@media (max-width: 992px) {
  .query-item, .time-input {
    width: 100%;
  }

  .query-btn, .reset-btn {
    width: 100%;
    margin-top: 8px;
  }
}
</style>