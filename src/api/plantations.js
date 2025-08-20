import { http } from '@/utils/request'

// 获取茶园列表
export const getPlantations = (params) => {
  return http.get('/plantations/info/', params)
}

// 获取茶园详情
export const getPlantationDetail = (plantationId) => {
  return http.get(`/plantations/info/${plantationId}/`)
}

// 创建茶园
export const createPlantation = (data) => {
  return http.post('/plantations/create/', data)
}

// 更新茶园信息
export const updatePlantation = (plantationId, data) => {
  return http.put(`/plantations/update/${plantationId}/`, data)
}

// 删除茶园
export const deletePlantation = (plantationId) => {
  return http.delete(`/plantations/delete/${plantationId}/`)
}
