<template>
  <div class="profile-test">
    <el-card class="test-card">
      <template #header>
        <h3>个人中心功能测试</h3>
      </template>
      
      <div class="test-actions">
        <el-button type="primary" @click="testGetUserInfo" :loading="loading">
          获取用户信息
        </el-button>
        <el-button @click="clearResult">清空结果</el-button>
      </div>
      
      <div v-if="result" class="result-section">
        <h4>API响应结果：</h4>
        <el-tabs v-model="activeTab">
          <el-tab-pane label="原始数据" name="raw">
            <pre>{{ JSON.stringify(result, null, 2) }}</pre>
          </el-tab-pane>
          <el-tab-pane label="转换后数据" name="transformed">
            <pre>{{ JSON.stringify(transformedData, null, 2) }}</pre>
          </el-tab-pane>
          <el-tab-pane label="茶园信息" name="plantations">
            <div v-if="result.data?.plantations?.length">
              <h5>茶园列表：</h5>
              <el-table :data="result.data.plantations" stripe>
                <el-table-column prop="plantation_name" label="茶园名称" />
                <el-table-column prop="province" label="省份" />
                <el-table-column prop="city" label="城市" />
                <el-table-column prop="drone_count" label="无人机数量" />
                <el-table-column prop="soil_sensors_count" label="传感器数量" />
                <el-table-column prop="deployment_status" label="部署状态">
                  <template #default="{ row }">
                    <el-tag :type="row.deployment_status ? 'success' : 'warning'">
                      {{ row.deployment_status ? '已部署' : '未部署' }}
                    </el-tag>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div v-else>
              <p>暂无茶园数据</p>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      
      <div v-if="error" class="error-section">
        <h4>错误信息：</h4>
        <pre>{{ error }}</pre>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getUserInfo } from '@/api/auth'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const result = ref(null)
const error = ref(null)
const activeTab = ref('raw')
const transformedData = ref(null)

const testGetUserInfo = async () => {
  loading.value = true
  result.value = null
  error.value = null
  
  try {
    const response = await getUserInfo()
    result.value = response
    
    // 模拟数据转换过程
    transformedData.value = {
      userId: response.data.user_id,
      nickname: response.data.nickname,
      username: response.data.username,
      role: response.data.role,
      phone: response.data.phone,
      bio: response.data.bio,
      contact_info: response.data.contact_info,
      plantations: response.data.plantations?.map(p => ({
        id: p.plantation_id,
        name: p.plantation_name,
        province: p.province,
        city: p.city,
        droneCount: p.drone_count,
        sensorCount: p.soil_sensors_count,
        status: p.deployment_status
      })) || []
    }
    
    ElMessage.success('获取用户信息成功')
  } catch (err) {
    error.value = err.message || '获取用户信息失败'
    ElMessage.error('获取用户信息失败')
  } finally {
    loading.value = false
  }
}

const clearResult = () => {
  result.value = null
  error.value = null
  transformedData.value = null
}
</script>

<style scoped>
.profile-test {
  max-width: 1000px;
  margin: 20px auto;
  padding: 20px;
}

.test-card {
  margin-bottom: 20px;
}

.test-actions {
  margin-bottom: 20px;
  display: flex;
  gap: 12px;
}

.result-section {
  margin-top: 20px;
}

.result-section pre {
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
  max-height: 400px;
  overflow-y: auto;
}

.error-section {
  margin-top: 20px;
  padding: 15px;
  background-color: #fef0f0;
  border: 1px solid #fbc4c4;
  border-radius: 4px;
}

.error-section pre {
  color: #f56c6c;
  margin: 0;
  font-size: 12px;
}
</style>
