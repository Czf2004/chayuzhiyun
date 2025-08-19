import { http } from '@/utils/request'

// 用户登录
export const login = (data) => {
  return http.post('/users/login/', data)
}

// 用户注册
export const register = (data) => {
  return http.post('/users/register/', {
    username: data.username,
    nickname: data.nickname,
    password: data.password,
    phone: data.phone,
    bio: data.bio,
    contact_info: data.contact_info,
    plantations: data.plantations || [],
    role: data.role || 'user'
  })
}

// 用户登出
export const logout = () => {
  return http.post('/users/logout/')
}

// 获取用户信息
export const getUserInfo = () => {
  return http.get('/users/profile/')
}

// 更新用户信息
export const updateUserInfo = (data) => {
  return http.put('/users/profile/', data)
}

// 修改密码
export const changePassword = (data) => {
  return http.post('/users/change-password/', data)
}
