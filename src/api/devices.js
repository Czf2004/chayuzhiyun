import { http } from '@/utils/request'

// 列表查询（分页、筛选）
export const listDevices = (params) => {
  return http.get('/devices/', params)
}

// 新建设备
export const createDevice = (data) => {
  return http.post('/devices/', data)
}

// 获取设备详情
export const getDevice = (deviceId) => {
  return http.get(`/devices/${deviceId}/`)
}

// 更新设备（全量）
export const updateDevice = (deviceId, data) => {
  return http.put(`/devices/${deviceId}/`, data)
}

// 部分更新
export const patchDevice = (deviceId, data) => {
  return http.patch(`/devices/${deviceId}/`, data)
}

// 删除设备
export const deleteDevice = (deviceId) => {
  return http.delete(`/devices/${deviceId}/`)
}

// 设备状态汇总（如有）
export const getDevicesStatus = () => {
  return http.get('/devices/status/')
}


