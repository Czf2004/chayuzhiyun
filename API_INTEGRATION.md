# 茶云智运系统 - 接口对接清单

## 概述

本文档从"功能真实业务流"角度梳理应有接口，不局限于当前代码中已存在的调用。每个功能通常包含：列表、详情、创建、更新、删除、批量导入/导出、统计、实时与校验等接口。

- **统一请求封装**: 所有接口建议复用 `src/utils/request.js` 的 `http` 封装（自动携带 `Authorization` 与统一错误提示），`baseURL` 建议通过环境变量配置（如 `VITE_API_BASE_URL`）。
- **代理建议**: 本地开发可通过 Vite 代理将 `/api`、`/users`、`/devices` 等前缀转发到网关，避免跨域。

---

## 认证与个人中心（Auth + Person）

### 已有封装（`src/api/auth.js`）

#### 1. 用户登录
- **URL**: `POST /users/login/`
- **请求体**:
```json
{
  "username": "string",
  "password": "string"
}
```
- **返回结构**:
```json
{
  "code": 200,
  "data": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "user": {
      "id": 1,
      "username": "admin",
      "nickname": "管理员",
      "role": "admin",
      "phone": "13800138000",
      "email": "admin@example.com",
      "avatar": "https://...",
      "created_at": "2024-01-01T00:00:00Z"
    }
  }
}
```

#### 2. 用户注册
- **URL**: `POST /users/register/`
- **请求体**:
```json
{
  "username": "string",
  "nickname": "string",
  "password": "string",
  "phone": "string",
  "bio": "string?",
  "contact_info": "string?",
  "plantations": ["string"]?,
  "role": "user"
}
```
- **返回结构**:
```json
{
  "code": 200,
  "data": {
    "message": "注册成功",
    "user_id": 123
  }
}
```

#### 3. 用户登出
- **URL**: `POST /users/logout/`
- **请求体**: 无
- **返回结构**:
```json
{
  "code": 200,
  "data": {
    "message": "登出成功"
  }
}
```

#### 4. 获取个人资料
- **URL**: `GET /users/profile/`
- **请求体**: 无
- **返回结构**:
```json
{
  "code": 200,
  "data": {
    "id": 1,
    "username": "admin",
    "nickname": "管理员",
    "role": "admin",
    "phone": "13800138000",
    "email": "admin@example.com",
    "avatar": "https://...",
    "bio": "个人简介",
    "contact_info": "联系方式",
    "plantations": ["P001", "P002"],
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

#### 5. 更新个人资料
- **URL**: `PUT /users/profile/`
- **请求体**:
```json
{
  "nickname": "string?",
  "phone": "string?",
  "email": "string?",
  "bio": "string?",
  "contact_info": "string?"
}
```
- **返回结构**:
```json
{
  "code": 200,
  "data": {
    "message": "更新成功",
    "user": {
      "id": 1,
      "username": "admin",
      "nickname": "新昵称",
      "phone": "13800138000",
      "email": "admin@example.com",
      "bio": "个人简介",
      "contact_info": "联系方式"
    }
  }
}
```

#### 6. 修改密码
- **URL**: `POST /users/change-password/`
- **请求体**:
```json
{
  "old_password": "string",
  "new_password": "string"
}
```
- **返回结构**:
```json
{
  "code": 200,
  "data": {
    "message": "密码修改成功"
  }
}
```

### 需对接（页面存在交互或合理业务需要）

#### 7. 后端探活
- **URL**: `GET /user/health`
- **请求体**: 无
- **返回结构**:
```json
{
  "code": 200,
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-01T00:00:00Z",
    "version": "1.0.0"
  }
}
```

#### 8. 头像上传
- **URL**: `POST /users/profile/avatar`
- **请求体**: `multipart/form-data`
```json
{
  "avatar": "File"
}
```
- **返回结构**:
```json
{
  "code": 200,
  "data": {
    "avatar_url": "https://cdn.example.com/avatars/user_123.jpg",
    "message": "头像上传成功"
  }
}
```

#### 9. 获取登录会话列表
- **URL**: `GET /users/sessions`
- **请求体**: 无
- **返回结构**:
```json
{
  "code": 200,
  "data": {
    "sessions": [
      {
        "id": "session_123",
        "device": "Chrome 120.0.0.0",
        "ip": "192.168.1.100",
        "location": "北京市",
        "last_active": "2024-01-01T12:00:00Z",
        "is_current": true
      }
    ]
  }
}
```

#### 10. 强制下线会话
- **URL**: `DELETE /users/sessions/{sessionId}`
- **请求体**: 无
- **返回结构**:
```json
{
  "code": 200,
  "data": {
    "message": "会话已下线"
  }
}
```

---

## 用户管理（Admin）

### 已有封装（`src/api/admin.js`）

#### 1. 获取用户列表
- **URL**: `GET /users/admin/users/?page=1&per_page=20&keyword=&role=`
- **请求体**: 无
- **返回结构**:
```json
{
  "code": 200,
  "data": {
    "users": [
      {
        "id": 1,
        "username": "admin",
        "nickname": "管理员",
        "role": "admin",
        "phone": "13800138000",
        "email": "admin@example.com",
        "status": "active",
        "created_at": "2024-01-01T00:00:00Z",
        "last_login": "2024-01-01T12:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "per_page": 20,
      "total": 100,
      "total_pages": 5
    }
  }
}
```

#### 2. 获取用户详情
- **URL**: `GET /users/admin/users/{userId}/`
- **请求体**: 无
- **返回结构**:
```json
{
  "code": 200,
  "data": {
    "id": 1,
    "username": "admin",
    "nickname": "管理员",
    "role": "admin",
    "phone": "13800138000",
    "email": "admin@example.com",
    "bio": "个人简介",
    "contact_info": "联系方式",
    "plantations": ["P001", "P002"],
    "status": "active",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z",
    "last_login": "2024-01-01T12:00:00Z"
  }
}
```

#### 3. 创建用户
- **URL**: `POST /users/admin/users/create/`
- **请求体**:
```json
{
  "username": "string",
  "nickname": "string",
  "password": "string",
  "phone": "string",
  "email": "string?",
  "role": "user|admin",
  "bio": "string?",
  "contact_info": "string?",
  "plantations": ["string"]?
}
```
- **返回结构**:
```json
{
  "code": 200,
  "data": {
    "message": "用户创建成功",
    "user_id": 123
  }
}
```

#### 4. 更新用户
- **URL**: `PUT /users/admin/users/update/{userId}/`
- **请求体**:
```json
{
  "username": "string?",
  "nickname": "string?",
  "phone": "string?",
  "email": "string?",
  "role": "user|admin?",
  "bio": "string?",
  "contact_info": "string?",
  "plantations": ["string"]?,
  "status": "active|inactive"?
}
```
- **返回结构**:
```json
{
  "code": 200,
  "data": {
    "message": "用户更新成功",
    "user": {
      "id": 1,
      "username": "admin",
      "nickname": "管理员",
      "role": "admin",
      "phone": "13800138000",
      "email": "admin@example.com"
    }
  }
}
```

#### 5. 删除用户
- **URL**: `DELETE /users/admin/users/delete/{userId}/`
- **请求体**: 无
- **返回结构**:
```json
{
  "code": 200,
  "data": {
    "message": "用户删除成功"
  }
}
```

#### 6. 重置用户密码
- **URL**: `POST /users/admin/users/reset-password/{userId}/`
- **请求体**:
```json
{
  "new_password": "string"
}
```
- **返回结构**:
```json
{
  "code": 200,
  "data": {
    "message": "密码重置成功"
  }
}
```

### 需对接（增强功能）

#### 7. 批量导入用户
- **URL**: `POST /users/admin/users/batch-import`
- **请求体**: `multipart/form-data`
```json
{
  "file": "File (Excel/CSV)",
  "options": {
    "skip_duplicates": true,
    "send_welcome_email": false
  }
}
```
- **返回结构**:
```json
{
  "code": 200,
  "data": {
    "message": "批量导入完成",
    "total": 100,
    "success": 95,
    "failed": 5,
    "errors": [
      {
        "row": 6,
        "error": "用户名已存在"
      }
    ]
  }
}
```

#### 8. 导出用户列表
- **URL**: `GET /users/admin/users/export?format=excel&filters={}`
- **请求体**: 无
- **返回结构**:
```json
{
  "code": 200,
  "data": {
    "download_url": "https://cdn.example.com/exports/users_20240101.xlsx",
    "expires_at": "2024-01-02T00:00:00Z"
  }
}
```