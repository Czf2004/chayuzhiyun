<template>
  <div class="user-profile">
    <el-card class="profile-card">
      <template #header>
        <div class="card-header">
          <span>用户资料</span>
          <el-button type="primary" @click="editMode = !editMode">
            {{ editMode ? '取消' : '编辑' }}
          </el-button>
        </div>
      </template>
      
      <el-form 
        :model="form" 
        :rules="rules" 
        ref="formRef" 
        label-width="100px"
        :disabled="!editMode"
      >
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="form.userId" disabled />
        </el-form-item>
        
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" />
        </el-form-item>
        
        <el-form-item label="角色" prop="role">
          <el-input v-model="form.role" disabled />
        </el-form-item>
        
        <el-form-item label="茶园数量">
          <el-tag type="success">{{ userStore.getUserInfo.plantations?.length || 0 }} 个茶园</el-tag>
        </el-form-item>
        
        <el-form-item v-if="editMode">
          <el-button type="primary" @click="saveProfile" :loading="loading">
            保存
          </el-button>
          <el-button @click="editMode = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <!-- 茶园列表 -->
    <el-card class="plantations-card" v-if="userStore.getUserInfo.plantations?.length">
      <template #header>
        <span>我的茶园</span>
      </template>
      
      <el-table :data="userStore.getUserInfo.plantations" stripe>
        <el-table-column prop="plantation_name" label="茶园名称" />
        <el-table-column prop="country" label="国家" />
        <el-table-column prop="province" label="省份" />
        <el-table-column prop="city" label="城市" />
        <el-table-column prop="drone_count" label="无人机数量" />
        <el-table-column prop="soil_sensors_count" label="土壤传感器数量" />
        <el-table-column label="状态">
          <template #default="{ row }">
            <el-tag :type="row.deployment_status ? 'success' : 'warning'">
              {{ row.deployment_status ? '已部署' : '未部署' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { updateUserInfo } from '@/api/auth'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const formRef = ref()
const editMode = ref(false)
const loading = ref(false)

const form = reactive({
  userId: '',
  nickname: '',
  role: ''
})

const rules = {
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '昵称长度在 2 到 20 个字符', trigger: 'blur' }
  ]
}

onMounted(() => {
  // 初始化表单数据
  const userInfo = userStore.getUserInfo
  form.userId = userInfo.userId || ''
  form.nickname = userInfo.nickname || ''
  form.role = userInfo.role || ''
})

const saveProfile = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    
    // 调用API更新用户信息
    await updateUserInfo({
      nickname: form.nickname
    })
    
    // 更新本地状态
    userStore.updateUserInfo({
      nickname: form.nickname
    })
    
    ElMessage.success('保存成功')
    editMode.value = false
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('保存失败，请重试')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.user-profile {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.profile-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.plantations-card {
  margin-top: 20px;
}
</style>
