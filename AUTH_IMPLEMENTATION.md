# 认证系统实现文档

## 概述

本项目已实现完整的用户认证系统，包括全局状态管理、API请求封装和登录功能。

## 功能特性

### 1. 全局状态管理 (Pinia Store)

**文件位置**: `src/stores/userStore.js`

**功能**:
- 管理用户登录状态
- 存储用户信息和token
- 自动持久化到localStorage
- 提供登录、登出、更新用户信息等方法

**使用方法**:
```javascript
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()

// 获取用户信息
const userInfo = userStore.getUserInfo
const token = userStore.getToken
const isLoggedIn = userStore.isLoggedIn

// 登录
userStore.login(loginData)

// 登出
userStore.logout()

// 更新用户信息
userStore.updateUserInfo(newInfo)
```

### 2. 全局API请求封装

**文件位置**: `src/utils/request.js`

**功能**:
- 统一的axios实例配置
- 自动携带token到请求头
- 统一的错误处理
- 401状态自动跳转登录页
- 封装常用HTTP方法

**配置**:
- BaseURL: `http://106.52.174.142:8085`
- 超时时间: 10秒
- 自动添加Authorization头

**使用方法**:
```javascript
import { http } from '@/utils/request'

// GET请求
const data = await http.get('/api/users')

// POST请求
const result = await http.post('/api/users', { name: 'test' })

// PUT请求
const updated = await http.put('/api/users/1', { name: 'new' })

// DELETE请求
await http.delete('/api/users/1')
```

### 3. 认证API接口

**文件位置**: `src/api/auth.js`

**接口列表**:
- `login(data)` - 用户登录
- `register(data)` - 用户注册
- `logout()` - 用户登出
- `getUserInfo()` - 获取用户信息
- `updateUserInfo(data)` - 更新用户信息
- `changePassword(data)` - 修改密码

**登录接口详情**:
```javascript
// 请求
POST /users/login/
{
  "username": "testuser008",
  "password": "123456"
}

// 响应
{
  "code": 0,
  "success": true,
  "message": "登录成功",
  "data": {
    "userId": "U-20250811-103036-604328",
    "nickname": "测试用户002",
    "role": "admin",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "plantations": [...]
  }
}
```

### 4. 路由守卫

**文件位置**: `src/router/index.js`

**功能**:
- 自动检查用户登录状态
- 未登录用户重定向到登录页
- 已登录用户访问登录页重定向到首页
- 支持路由元信息配置

**路由配置**:
```javascript
{
  path: '/home',
  name: 'home',
  component: HomeView,
  meta: { 
    showNavbar: true, 
    requiresAuth: true  // 需要登录
  }
}
```

### 5. 登录页面更新

**文件位置**: `src/views/AuthView.vue`

**更新内容**:
- 集成真实登录API
- 添加加载状态
- 错误处理和提示
- 登录成功后自动保存用户信息

### 6. 导航栏更新

**文件位置**: `src/components/NavBar.vue`

**更新内容**:
- 根据登录状态显示不同内容
- 显示用户信息和头像
- 提供用户下拉菜单
- 集成登出功能

## 使用示例

### 在组件中使用用户状态

```vue
<template>
  <div>
    <p>欢迎, {{ userStore.getUserInfo.nickname }}</p>
    <p>角色: {{ userStore.getUserInfo.role }}</p>
    <p>茶园数量: {{ userStore.getUserInfo.plantations?.length }}</p>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()
</script>
```

### 在组件中发起API请求

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { http } from '@/utils/request'

const data = ref([])
const loading = ref(false)

const fetchData = async () => {
  loading.value = true
  try {
    const response = await http.get('/api/data')
    data.value = response.data
  } catch (error) {
    console.error('获取数据失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>
```

## 测试账号

可以使用以下测试账号进行登录测试：

- 用户名: `testuser008`
- 密码: `123456`

## 注册功能

### 注册接口详情

**请求URL**: `POST /users/register/`

**请求体**:
```json
{
  "username": "testuser008",
  "nickname": "测试用户002",
  "password": "123456",
  "phone": "13800138008",
  "bio": "这是一个测试用户",
  "contact_info": "test@example.com",
  "plantations": [
    {
      "plantation_name": "测试茶园001"
    }
  ],
  "role": "user"
}
```

**响应**:
```json
{
  "code": 0,
  "timestamp": "2025-08-19 13:28:42",
  "message": "用户注册成功",
  "data": {
    "user_id": "U-20250819-132841-e64c99",
    "role": "admin",
    "username": "testuser008",
    "nickname": "测试用户002",
    "phone": "13800138008",
    "avatar": null,
    "bio": "这是一个测试用户",
    "contact_info": "test@example.com",
    "plantations": [...]
  },
  "success": true,
  "request_id": "696ef613-125b-409b-a9d9-79aef095ac04"
}
```

### 注册表单验证

- 用户名：6-12位字符
- 密码：6-16位字符
- 昵称：必填
- 手机号：必填，格式验证
- 个人简介：可选
- 邮箱：可选，格式验证

## 个人中心对接

### 用户信息接口

**请求URL**: `GET /users/profile/`

**响应示例**:
```json
{
  "code": 0,
  "timestamp": "2025-08-19 13:51:49",
  "message": "用户个人信息",
  "data": {
    "user_id": "U-20250819-132841-e64c99",
    "role": "admin",
    "username": "testuser008",
    "nickname": "测试用户002",
    "phone": "13800138008",
    "avatar": null,
    "bio": "这是一个测试用户",
    "contact_info": "test@example.com",
    "plantations": [
      {
        "plantation_id": "TP-20250819-132841-feece9",
        "plantation_name": "测试茶园001",
        "photo": null,
        "country": "China",
        "province": "浙江省",
        "city": "杭州市",
        "district": null,
        "detail_address": "详细地址未填写",
        "latitude": 0,
        "longitude": 0,
        "altitude": 0,
        "drone_count": 0,
        "drone_running": 0,
        "soil_sensors_count": 0,
        "soil_sensors_running": 0,
        "insect_pests_status": 0,
        "deployment_status": 0,
        "created_at": "2025-08-19T13:28:41.995097+08:00",
        "updated_at": "2025-08-19T13:28:41.995126+08:00"
      }
    ]
  },
  "success": true,
  "request_id": "4c247675-6d24-436c-8927-83b471dd7220"
}
```

### 个人中心功能特性

- ✅ 真实用户信息展示
- ✅ 茶园列表显示
- ✅ 设备统计信息
- ✅ 数据概览面板
- ✅ 空状态处理
- ✅ 加载状态和错误处理

## 注意事项

1. **Token管理**: Token会自动保存到localStorage，刷新页面不会丢失
2. **错误处理**: 401错误会自动清除用户信息并跳转到登录页
3. **路由保护**: 需要登录的页面会自动检查登录状态
4. **API请求**: 所有请求都会自动携带token，无需手动添加
5. **数据转换**: 后端数据格式会自动转换为前端组件需要的格式

## 用户管理功能

### 用户管理接口

**获取用户列表**: `GET /users/admin/users/`
**创建用户**: `POST /users/admin/users/create/`
**删除用户**: `DELETE /users/admin/users/delete/{user_id}/`
**更新用户**: `PUT /users/admin/users/update/{user_id}/`
**重置密码**: `POST /users/admin/users/reset-password/{user_id}/`

### 权限控制

- 只有管理员角色可以访问用户管理页面
- 路由守卫自动检查用户权限
- 导航栏根据用户角色显示相应菜单

### 功能特性

- ✅ 用户列表展示
- ✅ 用户搜索功能
- ✅ 创建新用户
- ✅ 编辑用户信息
- ✅ 删除用户
- ✅ 重置用户密码
- ✅ 用户详情查看
- ✅ 茶园信息展示
- ✅ 权限控制

## 扩展功能

如需添加新的API接口，可以在 `src/api/` 目录下创建新的文件，并使用 `http` 工具进行请求。

例如添加茶园相关API：
```javascript
// src/api/plantation.js
import { http } from '@/utils/request'

export const getPlantations = () => {
  return http.get('/plantations/')
}

export const createPlantation = (data) => {
  return http.post('/plantations/', data)
}
```
