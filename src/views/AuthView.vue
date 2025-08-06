<template>
  <div class="auth-container">
    <div class="system-header">
      <h1>茶语智韵智能茶园系统</h1>
    </div>
    
    <div class="auth-box">
      <h2 class="auth-title">{{ isLogin ? '用户登录' : '用户注册' }}</h2>
      
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <input 
            type="text" 
            v-model="formData.username" 
            :placeholder="isLogin ? '请输入用户名' : '请输入用户名(6-12位)'"
            required
          >
        </div>
        
        <div class="form-group">
          <input 
            :type="showPassword ? 'text' : 'password'" 
            v-model="formData.password" 
            :placeholder="isLogin ? '请输入密码' : '请输入密码(6-16位)'"
            required
          >
          <span class="eye-icon" @click="showPassword = !showPassword">
            {{ showPassword ? '👁️' : '👁️‍🗨️' }}
          </span>
        </div>
        
        <div class="form-group" v-if="!isLogin">
          <input 
            type="password" 
            v-model="formData.confirmPassword" 
            placeholder="请确认密码"
            required
          >
        </div>
        
        <button type="submit">{{ isLogin ? '登 录' : '注 册' }}</button>
      </form>
      
      <p class="toggle-text" @click="isLogin = !isLogin">
        {{ isLogin ? '没有账号？点击注册' : '已有账号？点击登录' }}
      </p>
      
      <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const isLogin = ref(true)
const showPassword = ref(false)
const errorMessage = ref('')

const formData = ref({
  username: '',
  password: '',
  confirmPassword: ''
})

onMounted(() => {
  if (route.query.register === 'true') {
    isLogin.value = false
  }
})

const handleSubmit = () => {
  errorMessage.value = ''
  
  // 验证逻辑
  if (!formData.value.username) {
    errorMessage.value = isLogin.value ? '请输入用户名' : '请输入用户名(6-12位)'
    return
  }
  
  if (!formData.value.password) {
    errorMessage.value = isLogin.value ? '请输入密码' : '请输入密码(6-16位)'
    return
  }
  
  if (!isLogin.value) {
    if (formData.value.password !== formData.value.confirmPassword) {
      errorMessage.value = '两次密码不一致'
      return
    }
  }
  
  // 模拟登录成功
  if (isLogin.value) {
    router.push('/home')
  } else {
    isLogin.value = true
    errorMessage.value = '注册成功，请登录'
  }
}
</script>

<style scoped>
.auth-container {
  max-width: 100%;
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5faf5;
}

.system-header {
  background-color: rgba(76, 175, 80, 0.2);
  padding: 30px 0;
  text-align: center;
  margin-bottom: 40px;
}

.system-header h1 {
  color: #4CAF50;
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.auth-box {
  max-width: 320px;
  margin: 0 auto 50px;
  padding: 30px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  width: 100%;
}

.auth-title {
  text-align: center;
  color: #4CAF50;
  margin-bottom: 25px;
  font-size: 20px;
}

.form-group {
  position: relative;
  margin-bottom: 20px;
}

input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 14px;
}

input:focus {
  border-color: #4CAF50;
  outline: none;
}

.eye-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  user-select: none;
  color: #777;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #45a049;
}

.toggle-text {
  text-align: center;
  color: #4CAF50;
  cursor: pointer;
  margin-top: 20px;
  font-size: 14px;
}

.error-message {
  color: #f44336;
  text-align: center;
  margin-top: 15px;
  font-size: 14px;
}

@media (max-width: 480px) {
  .auth-box {
    padding: 25px 20px;
    margin: 0 20px 40px;
  }
  
  .system-header h1 {
    font-size: 20px;
  }
  
  .auth-title {
    font-size: 18px;
  }
}
</style>