import request from '@/utils/request'

export function listTools(params) {
  return request({ url: '/api/toolkit/tools', method: 'get', params })
}

export function createTool(data) {
  return request({ url: '/api/toolkit/tools', method: 'post', data })
}

export function updateTool(key, data) {
  return request({ url: `/api/toolkit/tools/${key}`, method: 'put', data })
}

export function deleteTool(key) {
  return request({ url: `/api/toolkit/tools/${key}`, method: 'delete' })
}

export function submitToolForReview(key) {
  return request({ url: `/api/toolkit/tools/${key}/submit`, method: 'post' })
}

export function approveTool(key) {
  return request({ url: `/api/toolkit/tools/${key}/approve`, method: 'post' })
}

export function rejectTool(key, reason) {
  return request({ url: `/api/toolkit/tools/${key}/reject`, method: 'post', data: { reason } })
}

