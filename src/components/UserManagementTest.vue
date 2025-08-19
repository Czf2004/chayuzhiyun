<template>
  <div class="user-management-test">
    <el-card class="test-card">
      <template #header>
        <h3>用户管理功能测试</h3>
      </template>
      
      <div class="test-actions">
        <el-button type="primary" @click="testGetUsers" :loading="loading">
          获取用户列表
        </el-button>
        <el-button type="success" @click="testCreateUser" :loading="creating">
          测试创建用户
        </el-button>
        <el-button type="warning" @click="testDeleteUser" :loading="deleting">
          测试删除用户
        </el-button>
        <el-button @click="clearResult">清空结果</el-button>
      </div>
      
      <div v-if="result" class="result-section">
        <h4>API响应结果：</h4>
        <el-tabs v-model="activeTab">
          <el-tab-pane label="原始数据" name="raw">
            <pre>{{ JSON.stringify(result, null, 2) }}</pre>
          </el-tab-pane>
          <el-tab-pane label="用户列表" name="users">
            <div v-if="result.data?.users?.length">
              <h5>用户列表 ({{ result.data.totalUsers }})：</h5>
              <el-table :data="result.data.users" stripe>
                <el-table-column prop="user_id" label="用户ID" width="180" />
                <el-table-column prop="username" label="用户名" width="120" />
                <el-table-column prop="nickname" label="昵称" width="120" />
                <el-table-column prop="role" label="角色" width="80">
                  <template #default="{ row }">
                    <el-tag :type="row.role === 'admin' ? 'danger' : 'success'">
                      {{ row.role === 'admin' ? '管理员' : '用户' }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="phone" label="手机号" width="120" />
                <el-table-column label="茶园数量" width="100">
                  <template #default="{ row }">
                    <el-tag type="info">{{ row.plantations?.length || 0 }}</el-tag>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div v-else>
              <p>暂无用户数据</p>
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
import { getUsers, createUser, deleteUser } from '@/api/admin'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const creating = ref(false)
const deleting = ref(false)
const result = ref(null)
const error = ref(null)
const activeTab = ref('raw')

const testGetUsers = async () => {
  loading.value = true
  result.value = null
  error.value = null
  
  try {
    const response = await getUsers()
    result.value = response
    ElMessage.success('获取用户列表成功')
  } catch (err) {
    error.value = err.message || '获取用户列表失败'
    ElMessage.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

const testCreateUser = async () => {
  creating.value = true
  result.value = null
  error.value = null
  
  try {
    const testUserData = {
      username: `testuser${Date.now()}`,
      nickname: `测试用户${Date.now()}`,
      password: '123456',
      phone: '13800138000',
      role: 'user',
      bio: '测试创建的用户',
      contact_info: 'test@example.com'
    }
    
    const response = await createUser(testUserData)
    result.value = response
    ElMessage.success('创建用户成功')
  } catch (err) {
    error.value = err.message || '创建用户失败'
    ElMessage.error('创建用户失败')
  } finally {
    creating.value = false
  }
}

const testDeleteUser = async () => {
  if (!result.value?.data?.users?.length) {
    ElMessage.warning('请先获取用户列表')
    return
  }
  
  const firstUser = result.value.data.users[0]
  
  try {
    await ElMessageBox.confirm(
      `确定要删除用户 "${firstUser.nickname}" 吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    deleting.value = true
    const response = await deleteUser(firstUser.user_id)
    result.value = response
    ElMessage.success('删除用户成功')
  } catch (err) {
    if (err !== 'cancel') {
      error.value = err.message || '删除用户失败'
      ElMessage.error('删除用户失败')
    }
  } finally {
    deleting.value = false
  }
}

const clearResult = () => {
  result.value = null
  error.value = null
}
</script>

<style scoped>
.user-management-test {
  max-width: 1200px;
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
  flex-wrap: wrap;
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
