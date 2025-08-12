<template>
  <nav class="navbar">
    <div class="logo">
      <img class="logo-img" src="http://www.chayuzhiyun.top/logo.png" alt="Logo">
      <span class="logo-text">智能茶园系统</span>
    </div>
    
    <ul class="nav-links">
      <li><RouterLink class="nav-link" to="/home">首页</RouterLink></li>
      <li><RouterLink class="nav-link" to="/manage">茶园管理</RouterLink></li>
      <li><RouterLink class="nav-link" to="/dashboard">数据中枢</RouterLink></li>
      <li><RouterLink class="nav-link" to="/monitor">历史查询</RouterLink></li>
      <li><RouterLink class="nav-link" to="/solutions">AI Agent 智能体</RouterLink></li>
      <li><RouterLink class="nav-link" to="/solutions">茶园运营</RouterLink></li>
      <li><RouterLink class="nav-link" to="/solutions">设备与任务</RouterLink></li>
      <li><RouterLink class="nav-link" to="/solutions">用户与系统</RouterLink></li>
      <li><RouterLink class="nav-link" to="/solutions">系统设置</RouterLink></li>
      <li><RouterLink class="nav-link" to="/person">个人中心</RouterLink></li>
    </ul>
    <div class="user-actions">
      <RouterLink class="login-btn" to="/">登录</RouterLink>
      <RouterLink class="register-btn" to="/?register=true">注册</RouterLink>
    </div>
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router'
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
</style>