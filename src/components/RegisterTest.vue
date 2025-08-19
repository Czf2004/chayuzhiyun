<template>
  <div class="register-test">
    <el-card class="test-card">
      <template #header>
        <h3>注册功能测试</h3>
      </template>
      
      <el-form :model="testForm" label-width="120px">
        <el-form-item label="用户名">
          <el-input v-model="testForm.username" placeholder="testuser008" />
        </el-form-item>
        
        <el-form-item label="昵称">
          <el-input v-model="testForm.nickname" placeholder="测试用户002" />
        </el-form-item>
        
        <el-form-item label="密码">
          <el-input v-model="testForm.password" type="password" placeholder="123456" />
        </el-form-item>
        
        <el-form-item label="手机号">
          <el-input v-model="testForm.phone" placeholder="13800138008" />
        </el-form-item>
        
        <el-form-item label="个人简介">
          <el-input v-model="testForm.bio" placeholder="这是一个测试用户" />
        </el-form-item>
        
        <el-form-item label="邮箱">
          <el-input v-model="testForm.contact_info" placeholder="test@example.com" />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="testRegister" :loading="loading">
            测试注册
          </el-button>
          <el-button @click="fillTestData">填充测试数据</el-button>
        </el-form-item>
      </el-form>
      
      <div v-if="result" class="result-section">
        <h4>测试结果：</h4>
        <pre>{{ JSON.stringify(result, null, 2) }}</pre>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { register } from '@/api/auth'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const result = ref(null)

const testForm = reactive({
  username: '',
  nickname: '',
  password: '',
  phone: '',
  bio: '',
  contact_info: ''
})

const fillTestData = () => {
  testForm.username = 'testuser008'
  testForm.nickname = '测试用户002'
  testForm.password = '123456'
  testForm.phone = '13800138008'
  testForm.bio = '这是一个测试用户'
  testForm.contact_info = 'test@example.com'
}

const testRegister = async () => {
  loading.value = true
  result.value = null
  
  try {
    const response = await register({
      username: testForm.username,
      nickname: testForm.nickname,
      password: testForm.password,
      phone: testForm.phone,
      bio: testForm.bio,
      contact_info: testForm.contact_info,
      plantations: [
        {
          plantation_name: '测试茶园001'
        }
      ],
      role: 'user'
    })
    
    result.value = response
    ElMessage.success('注册测试成功')
  } catch (error) {
    result.value = {
      error: error.message,
      details: error
    }
    ElMessage.error('注册测试失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-test {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
}

.test-card {
  margin-bottom: 20px;
}

.result-section {
  margin-top: 20px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.result-section pre {
  background-color: #fff;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
}
</style>
