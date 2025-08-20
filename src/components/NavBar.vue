<template>
  <nav class="navbar">
    <div class="logo">
      <!-- <img class="logo-img" src="https://images.unsplash.com/photo-1755349687890-ea63e78612fa?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Logo"> -->
      <span class="logo-text">智能系统</span>
    </div>
    
    <ul class="nav-links">
      <li><RouterLink class="nav-link" to="/home">首页</RouterLink></li>
      <li><RouterLink class="nav-link" to="/manage">茶园管理</RouterLink></li>
      <li><RouterLink class="nav-link" to="/dashboard">数据中枢</RouterLink></li>
      <li><RouterLink class="nav-link" to="/monitor">历史查询</RouterLink></li>
      <li><RouterLink class="nav-link" to="/solutions">AI Agent 智能体</RouterLink></li>
      <li><RouterLink class="nav-link" to="/ops">茶园运营</RouterLink></li>
      <li v-if="userStore.getUserInfo.role === 'admin'"><RouterLink class="nav-link" to="/ops/products">茶册管理</RouterLink></li>
      <li v-if="userStore.getUserInfo.role === 'admin'"><RouterLink class="nav-link" to="/ops/quotations">专属报价</RouterLink></li>
      <li><RouterLink class="nav-link" to="/solutions">设备与任务</RouterLink></li>
      <li v-if="userStore.getUserInfo.role === 'admin'">
        <RouterLink class="nav-link" to="/user-management">用户管理</RouterLink>
      </li>
      <li v-if="userStore.getUserInfo.role === 'admin'">
        <RouterLink class="nav-link" to="/device-management">设备管理</RouterLink>
      </li>
      <li><RouterLink class="nav-link" to="/settings">系统设置</RouterLink></li>
      <li><RouterLink class="nav-link" to="/person">个人中心</RouterLink></li>
      <li><RouterLink class="nav-link" to="/toolkit">工具包</RouterLink></li>
    </ul>
    
    <!-- 未登录状态 -->
    <div class="user-actions" v-if="!userStore.isLoggedIn">
      <RouterLink class="login-btn" to="/auth">登录</RouterLink>
      <RouterLink class="register-btn" to="/auth?register=true">注册</RouterLink>
    </div>
    
    <!-- 已登录状态 -->
    <div class="user-actions" v-else>
      <div class="user-info">
        <span class="user-name">{{ userStore.getUserInfo.nickname || '用户' }}</span>
        <span class="user-role">{{ userStore.getUserInfo.role || 'user' }}</span>
      </div>
      <el-dropdown @command="handleCommand">
        <span class="user-avatar">
          <el-avatar :size="32" :src="userAvatar">
            {{ userStore.getUserInfo.nickname?.charAt(0) || 'U' }}
          </el-avatar>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">个人资料</el-dropdown-item>
            <el-dropdown-item command="settings">设置</el-dropdown-item>
            <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </nav>
</template>

<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { computed } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { ElMessage, ElMessageBox } from 'element-plus'
import { images } from '@/assets/images.js'

const router = useRouter()
const userStore = useUserStore()

// 用户头像（优先使用接口头像，否则用内置头像池按用户ID稳定取一张）
const userAvatar = computed(() => {
  const info = userStore.getUserInfo || {}
  if (info.avatar) return info.avatar
  const arr = Object.values(images?.avatars || {})
  if (!arr.length) return ''
  const basis = String(info.userId || info.username || 'user')
  let sum = 0
  for (let i = 0; i < basis.length; i++) sum = (sum + basis.charCodeAt(i)) % 997
  return arr[sum % arr.length]
})

const handleCommand = async (command) => {
  switch (command) {
    case 'profile':
      router.push('/person')
      break
    case 'settings':
      // 跳转到设置页面
      break
    case 'logout':
      try {
        await ElMessageBox.confirm(
          '确定要退出登录吗？',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
        )
        
        // 清除用户信息
        userStore.logout()
        ElMessage.success('已退出登录')
        router.push('/auth')
      } catch {
        // 用户取消
      }
      break
  }
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  padding: 1.5rem 5%;
  background-color: hsla(0, 0%, 100%, 0.9);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
}

.logo-img {
  height: 40px;
  margin-right: 10px;
}

.logo-text {
  font-size: 1.4rem;
  font-weight: 700;
  margin-left: 10px;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 2rem;
  margin: 0;
  padding: 0;
}

.nav-link {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  padding: 0.5rem 0;
  position: relative;
}

.nav-link:after {
  content: "";
  position: absolute;
  width: 0;
  height: 2px;
  bottom: 0;
  left: 0;
  background-color: #4caf50;
  transition: width 0.3s;
}

.nav-link:hover:after,
.router-link-active:after {
  width: 100%;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.login-btn, .register-btn {
  padding: 0.5rem 1.2rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s;
}

.login-btn {
  color: #2196f3;
  border: 1px solid #2196f3;
}

.register-btn {
  background-color: #4caf50;
  color: #fff;
}

.login-btn:hover {
  background-color: rgba(33, 150, 243, 0.1);
}

.register-btn:hover {
  background-color: #3d8b40;
}

/* 用户信息样式 */
.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-right: 0.5rem;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.user-role {
  font-size: 12px;
  color: #666;
  text-transform: capitalize;
}

.user-avatar {
  cursor: pointer;
  transition: all 0.3s;
}

.user-avatar:hover {
  transform: scale(1.05);
}
</style>