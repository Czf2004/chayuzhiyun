<template>
  <header class="topbar">
    <div class="topbar-inner">
      <div class="logo-text">智能系统</div>
      <div class="search">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" stroke="#98A2B3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <input placeholder="搜索...">
      </div>
      <div style="flex:1"></div>
      <div class="user-actions" v-if="!userStore.isLoggedIn">
        <RouterLink class="btn-secondary-outline" to="/auth">登录</RouterLink>
        <RouterLink class="btn-modern-primary" style="padding:8px 14px" to="/auth?register=true">注册</RouterLink>
      </div>
      <div class="user-actions" v-else>
        <div class="user-info">
          <span class="user-name">{{ userStore.getUserInfo.nickname || '用户' }}</span>
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
    </div>
  </header>
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