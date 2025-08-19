import { http } from '@/utils/request'

// 获取用户列表
export const getUsers = () => {
  return http.get('/users/admin/users/')
}

// 创建用户
export const createUser = (data) => {
  return http.post('/users/admin/users/create/', data)
}

// 删除用户
export const deleteUser = (userId) => {
  return http.delete(`/users/admin/users/delete/${userId}/`)
}

// 更新用户信息
export const updateUser = (userId, data) => {
  return http.put(`/users/admin/users/update/${userId}/`, data)
}

// 重置用户密码
export const resetUserPassword = (userId, newPassword) => {
  return http.post(`/users/admin/users/reset-password/${userId}/`, {
    new_password: newPassword
  })
}

// 获取用户详情
export const getUserDetail = (userId) => {
  return http.get(`/users/admin/users/${userId}/`)
}
