<template>
  <div class="auth-container">
    <!-- 背景装饰元素 -->
    <div class="bg-decoration"></div>
    
    <!-- 顶部导航 -->
    <header class="main-header">
      <div class="logo">茶语智韵</div>
      <nav class="main-nav">
        <a href="#" class="nav-link">首页</a>
        <a href="#" class="nav-link">产品</a>
        <a href="#" class="nav-link">解决方案</a>
        <a href="#" class="nav-link">支持</a>
      </nav>
    </header>
    
    <div class="auth-wrapper">
      <!-- 左侧品牌展示区 -->
      <div class="brand-section">
        <!-- <h1 class="brand-title">茶语智韵智能茶园系统</h1> -->
        
        <!-- 艺术化展示的描述文字 -->
        <div class="artistic-description">
          <p class="description-line">融合智能科技与传统茶文化，</p>
          <p class="description-line">打造现代化茶园管理解决方案</p>
        </div>
        
        <div class="brand-image">
          <img src="https://picsum.photos/id/155/600/400" alt="智能茶园管理系统展示图" class="feature-image">
        </div>
      </div>
      
      <!-- 右侧登录/注册表单 -->
      <div class="auth-box">
        <h2 class="auth-title">{{ isLogin ? '用户登录' : '用户注册' }}</h2>
        
        <form @submit.prevent="handleSubmit" class="auth-form">
          <div class="form-group">
            <div class="input-icon">
              <i class="icon-user"></i>
            </div>
            <input 
              type="text" 
              v-model="formData.username" 
              :placeholder="isLogin ? '请输入用户名' : '请输入用户名(6-12位)'"
              required
              class="form-input"
            >
          </div>
          
          <div class="form-group">
            <div class="input-icon">
              <i class="icon-lock"></i>
            </div>
            <input 
              :type="showPassword ? 'text' : 'password'" 
              v-model="formData.password" 
              :placeholder="isLogin ? '请输入密码' : '请输入密码(6-16位)'"
              required
              class="form-input"
            >
            <span class="eye-icon" @click="showPassword = !showPassword">
              <i class="icon-eye"></i>
            </span>
          </div>
          
          <div class="form-group" v-if="!isLogin">
            <div class="input-icon">
              <i class="icon-lock"></i>
            </div>
            <input 
              type="password" 
              v-model="formData.confirmPassword" 
              placeholder="请确认密码"
              required
              class="form-input"
            >
          </div>
          
          <!-- 注册时的额外字段 -->
          <div class="form-group" v-if="!isLogin">
            <div class="input-icon">
              <i class="icon-user"></i>
            </div>
            <input 
              type="text" 
              v-model="formData.nickname" 
              placeholder="请输入昵称"
              required
              class="form-input"
            >
          </div>
          
          <div class="form-group" v-if="!isLogin">
            <div class="input-icon">
              <i class="icon-phone"></i>
            </div>
            <input 
              type="tel" 
              v-model="formData.phone" 
              placeholder="请输入手机号"
              required
              class="form-input"
            >
          </div>
          
          <div class="form-group" v-if="!isLogin">
            <div class="input-icon">
              <i class="icon-info"></i>
            </div>
            <input 
              type="text" 
              v-model="formData.bio" 
              placeholder="个人简介（可选）"
              class="form-input"
            >
          </div>
          
          <div class="form-group" v-if="!isLogin">
            <div class="input-icon">
              <i class="icon-email"></i>
            </div>
            <input 
              type="email" 
              v-model="formData.contact_info" 
              placeholder="邮箱地址（可选）"
              class="form-input"
            >
          </div>
          
          <button type="submit" class="submit-btn" :disabled="loading">
            <span class="btn-text">{{ loading ? (isLogin ? '登录中...' : '注册中...') : (isLogin ? '登 录' : '注 册') }}</span>
            <span class="btn-arrow" v-if="!loading">→</span>
            <span class="loading-spinner" v-if="loading">⏳</span>
          </button>
        </form>
        
        <p class="toggle-text" @click="isLogin = !isLogin">
          {{ isLogin ? '没有账号？点击注册' : '已有账号？点击登录' }}
        </p>
        
        <p class="error-message" v-if="errorMessage" :class="{ 'show': errorMessage }">
          {{ errorMessage }}
        </p>
      </div>
    </div>
    
    <!-- 页脚固定在页面底部 -->
    <footer class="page-footer">
      <div class="footer-content">
        <div class="footer-links">
          <a href="#" class="footer-link">关于我们</a>
          <a href="#" class="footer-link">隐私政策</a>
          <a href="#" class="footer-link">服务条款</a>
          <a href="#" class="footer-link">联系我们</a>
        </div>
        <p class="copyright">© 2023 茶语智韵 版权所有</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { login, register } from '@/api/auth'
import { ElMessage, ElLoading } from 'element-plus'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const isLogin = ref(true)
const showPassword = ref(false)
const errorMessage = ref('')
const loading = ref(false)

const formData = ref({
  username: '',
  password: '',
  confirmPassword: '',
  nickname: '',
  phone: '',
  bio: '',
  contact_info: ''
})

onMounted(() => {
  if (route.query.register === 'true') {
    isLogin.value = false
  }
  
  // 添加页面载入动画类
  document.body.classList.add('page-loaded')
})

const handleSubmit = async () => {
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
    
    // 简单的长度验证
    if (formData.value.username.length < 6 || formData.value.username.length > 12) {
      errorMessage.value = '用户名长度必须在6-12位之间'
      return
    }
    
    if (formData.value.password.length < 6 || formData.value.password.length > 16) {
      errorMessage.value = '密码长度必须在6-16位之间'
      return
    }
    
    // 注册时的额外验证
    if (!formData.value.nickname) {
      errorMessage.value = '请输入昵称'
      return
    }
    
    if (!formData.value.phone) {
      errorMessage.value = '请输入手机号'
      return
    }
    
    // 手机号格式验证
    const phoneRegex = /^1[3-9]\d{9}$/
    if (!phoneRegex.test(formData.value.phone)) {
      errorMessage.value = '请输入正确的手机号格式'
      return
    }
  }
  
  loading.value = true
  
  try {
    if (isLogin.value) {
      // 真实登录
      const response = await login({
        username: formData.value.username,
        password: formData.value.password
      })
      
      // 登录成功，保存用户信息到store
      userStore.login(response.data)
      
      // 登录成功动画
      const authBox = document.querySelector('.auth-box')
      authBox.classList.add('success-animation')
      
      ElMessage.success('登录成功')
      
      setTimeout(() => {
        router.push('/home')
      }, 800)
    } else {
      // 真实注册
      try {
        const response = await register({
          username: formData.value.username,
          nickname: formData.value.nickname,
          password: formData.value.password,
          phone: formData.value.phone,
          bio: formData.value.bio || '这是一个新用户',
          contact_info: formData.value.contact_info || '',
          plantations: [
            {
              plantation_name: '默认茶园'
            }
          ],
          role: 'user'
        })
        
        // 注册成功
        ElMessage.success('注册成功，请登录')
        isLogin.value = true
        
        // 清空表单，保留用户名
        formData.value = {
          username: formData.value.username,
          password: '',
          confirmPassword: '',
          nickname: '',
          phone: '',
          bio: '',
          contact_info: ''
        }
      } catch (error) {
        console.error('注册失败:', error)
        errorMessage.value = error.message || '注册失败，请重试'
      }
    }
  } catch (error) {
    console.error('登录失败:', error)
    errorMessage.value = error.message || '登录失败，请检查用户名和密码'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* 基础样式与变量 - 采用大疆风格的科技感配色 */
:root {
  --primary-color: #0A66C2; /* 主色调：科技蓝 */
  --primary-dark: #0853A6; /* 深色主色 */
  --secondary-color: #2E3192; /* 辅助色：靛蓝色 */
  --accent-color: #4A6F5D; /* 茶绿色点缀 */
  --light-accent: #8FB879; /* 浅茶绿色 */
  --text-primary: #333333; /* 主要文本色 - 改为深色 */
  --text-secondary: #666666; /* 次要文本色 */
  --bg-primary: #F5F7FA; /* 主背景色：浅灰色 */
  --bg-secondary: #FFFFFF; /* 次要背景色 */
  --card-bg: #FFFFFF; /* 卡片背景 */
  --border-color: #E0E0E0; /* 边框色 */
  --error-color: #FF4D4F; /* 错误提示色 */
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); /* 平滑过渡效果 */
  --shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.1); /* 阴影效果 */
}

/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif;
}

body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  opacity: 0;
  transition: opacity 0.6s ease-in-out;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

body.page-loaded {
  opacity: 1;
}

.auth-container {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* 背景装饰 */
.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 20% 30%, rgba(10, 102, 194, 0.05) 0%, transparent 40%),
              radial-gradient(circle at 80% 70%, rgba(46, 49, 146, 0.03) 0%, transparent 40%);
  z-index: 0;
}

/* 顶部导航 */
.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 5%;
  position: relative;
  z-index: 10;
}

.logo {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
}

.logo::before {
  content: '';
  width: 32px;
  height: 32px;
  background-color: var(--primary-color);
  border-radius: 6px;
  margin-right: 12px;
  display: inline-block;
}

.main-nav {
  display: flex;
  gap: 32px;
}

.nav-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  transition: var(--transition);
  position: relative;
  padding: 8px 0;
}

.nav-link:hover {
  color: var(--primary-color);
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: var(--primary-color);
  transition: var(--transition);
}

.nav-link:hover::after {
  width: 100%;
}

/* 主要内容区 */
.auth-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 5%;
  gap: 80px;
  position: relative;
  z-index: 10;
  flex: 1;
}

/* 品牌展示区 */
.brand-section {
  max-width: 600px;
  animation: fadeInLeft 1s ease-out;
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.brand-title {
  font-size: 42px;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 36px;
  color: var(--text-primary);
  position: relative;
  display: inline-block;
}

.brand-title::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -12px;
  width: 60px;
  height: 4px;
  background-color: var(--accent-color);
  border-radius: 2px;
}

/* 艺术化描述文字样式 */
.artistic-description {
  margin-bottom: 40px;
  position: relative;
  padding-left: 24px;
}

.artistic-description::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 2px;
  background: linear-gradient(to bottom, var(--accent-color), var(--light-accent));
  border-radius: 1px;
}

.description-line {
  font-size: 26px;
  color: var(--text-secondary);
  line-height: 1.8;
  position: relative;
  padding: 6px 0;
  letter-spacing: 0.3px;
}

.description-line:first-child {
  font-weight: 500;
}

.description-line::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 1px;
  background: linear-gradient(to right, var(--accent-color), transparent);
  transition: width 1.5s ease-out;
}

.brand-section:hover .description-line::after {
  width: 100%;
}

.brand-image {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow);
  transition: transform 0.5s ease;
}

.brand-image:hover {
  transform: translateY(-5px) scale(1.02);
}

.feature-image {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
}

/* 登录/注册盒子 */
.auth-box {
  width: 100%;
  max-width: 400px;
  padding: 48px 40px;
  background-color: var(--card-bg);
  border-radius: 12px;
  box-shadow: var(--shadow);
  position: relative;
  overflow: hidden;
  animation: fadeInRight 1s ease-out;
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 成功动画 */
.auth-box.success-animation {
  animation: successPulse 0.8s ease-in-out;
}

@keyframes successPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); box-shadow: 0 15px 35px -5px rgba(10, 102, 194, 0.2); }
}

.auth-box::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, var(--accent-color), var(--light-accent));
}

/* 登录注册标题改为黑色 */
.auth-title {
  color: #000000; /* 纯黑色 */
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 36px;
  text-align: center;
}

/* 表单样式 */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  position: relative;
  margin-bottom: 8px;
}

.input-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
}

/* 使用线条图标替代emoji */
.icon-user::before {
  content: '|';
  display: block;
  width: 12px;
  height: 18px;
  position: relative;
}

.icon-user::after {
  content: '';
  position: absolute;
  top: -8px;
  left: -3px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid currentColor;
}

.icon-lock::before {
  content: '';
  display: block;
  width: 16px;
  height: 20px;
  border: 2px solid currentColor;
  border-radius: 3px;
  position: relative;
}

.icon-lock::after {
  content: '';
  position: absolute;
  top: 10px;
  left: 3px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid currentColor;
}

.icon-eye::before {
  content: '';
  display: block;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid currentColor;
  position: relative;
}

.icon-eye::after {
  content: '';
  position: absolute;
  top: 6px;
  left: 6px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: currentColor;
}

.icon-phone::before {
  content: '';
  display: block;
  width: 16px;
  height: 20px;
  border: 2px solid currentColor;
  border-radius: 8px;
  position: relative;
}

.icon-phone::after {
  content: '';
  position: absolute;
  top: 12px;
  left: 4px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 2px solid currentColor;
}

.icon-info::before {
  content: 'i';
  display: block;
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-radius: 50%;
  text-align: center;
  line-height: 12px;
  font-size: 12px;
  font-weight: bold;
}

.icon-email::before {
  content: '';
  display: block;
  width: 16px;
  height: 12px;
  border: 2px solid currentColor;
  border-radius: 2px;
  position: relative;
}

.icon-email::after {
  content: '';
  position: absolute;
  top: 4px;
  left: 4px;
  width: 8px;
  height: 4px;
  border-left: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  transform: rotate(-45deg);
}

/* 密码隐藏状态的图标 */
.eye-icon:not(.show) .icon-eye::after {
  content: '';
  position: absolute;
  top: 0;
  left: 10px;
  width: 2px;
  height: 20px;
  background-color: currentColor;
  transform: rotate(45deg);
}

.form-input {
  width: 100%;
  padding: 16px 16px 16px 48px;
  background-color: #FAFAFA;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 16px;
  color: var(--text-primary);
  transition: var(--transition);
}

.form-input::placeholder {
  color: var(--text-secondary);
  opacity: 0.7;
}

.form-input:focus {
  border-color: var(--primary-color);
  outline: none;
  box-shadow: 0 0 0 3px rgba(10, 102, 194, 0.1);
}

.eye-icon {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  user-select: none;
  color: var(--text-secondary);
  font-size: 18px;
  transition: var(--transition);
  width: 20px;
  height: 20px;
}

.eye-icon:hover {
  color: var(--primary-color);
}

/* 提交按钮 */
.submit-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(90deg, var(--accent-color), var(--light-accent));
  color: black;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: var(--transition);
  margin-top: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  position: relative;
  overflow: hidden;
}

.submit-btn::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
  transition: 0.6s ease;
}

.submit-btn:hover::after {
  left: 100%;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px -5px rgba(74, 111, 93, 0.3);
}

.btn-arrow {
  transition: transform 0.3s ease;
}

.submit-btn:hover .btn-arrow {
  transform: translateX(4px);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.submit-btn:disabled:hover {
  transform: none;
  box-shadow: none;
}

.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 切换文本 */
.toggle-text {
  text-align: center;
  color: var(--text-secondary);
  cursor: pointer;
  margin-top: 30px;
  font-size: 14px;
  transition: var(--transition);
  padding: 8px;
  border-radius: 4px;
}

.toggle-text:hover {
  color: var(--accent-color);
  background-color: rgba(74, 111, 93, 0.05);
}

/* 错误信息 */
.error-message {
  color: var(--error-color);
  text-align: center;
  margin-top: 16px;
  font-size: 14px;
  padding: 10px;
  border-radius: 6px;
  background-color: rgba(255, 77, 79, 0.05);
  border: 1px solid rgba(255, 77, 79, 0.1);
  opacity: 0;
  transform: translateY(10px);
  transition: var(--transition);
}

.error-message.show {
  opacity: 1;
  transform: translateY(0);
}

/* 页脚固定在页面底部 */
.page-footer {
  padding: 40px 5% 20px;
  position: relative;
  z-index: 10;
  margin-top: auto;
  width: 100%;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.footer-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 14px;
  transition: var(--transition);
  position: relative;
  padding: 4px 0;
}

.footer-link:hover {
  color: var(--accent-color);
}

.copyright {
  font-size: 13px;
  color: var(--text-secondary);
  opacity: 0.8;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .auth-wrapper {
    flex-direction: column;
    gap: 60px;
    padding: 20px 5%;
  }
  
  .brand-section {
    max-width: 100%;
    text-align: center;
  }
  
  .brand-title {
    font-size: 36px;
  }
  
  .artistic-description {
    padding-left: 0;
    display: inline-block;
  }
  
  .artistic-description::before {
    left: 50%;
    transform: translateX(-50%);
    height: 3px;
    width: 40px;
    top: -20px;
  }
}

@media (max-width: 768px) {
  .main-nav {
    display: none;
  }
  
  .brand-title {
    font-size: 28px;
  }
  
  .description-line {
    font-size: 17px;
  }
  
  .auth-box {
    padding: 36px 30px;
    max-width: 100%;
  }
  
  .footer-links {
    gap: 16px;
  }
}
</style>
