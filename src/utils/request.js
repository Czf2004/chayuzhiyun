import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/userStore'
import router from '@/router'

// 创建axios实例
const request = axios.create({
  baseURL: 'http://106.52.174.142:8085', // 后端baseURL
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 从store获取token
    const userStore = useUserStore()
    const token = userStore.getToken
    
    // 如果有token，添加到请求头
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // 统一返回后端 data，不强制要求 success/code 字段
    return response.data
  },
  (error) => {
    console.error('响应错误:', error)
    
    if (error.response) {
      const { status, data } = error.response
      
      switch (status) {
        case 401: {
          // 未授权，清除用户信息并跳转到登录页
          const userStore = useUserStore()
          userStore.logout()
          ElMessage.error('登录已过期，请重新登录')
          router.push('/auth')
          break
        }
        case 403:
          ElMessage.error('没有权限访问该资源')
          break
        case 404:
          ElMessage.error('请求的资源不存在')
          break
        case 500:
          ElMessage.error('服务器内部错误')
          break
        default:
          ElMessage.error(data?.message || `请求失败 (${status})`)
      }
    } else if (error.code === 'ECONNABORTED') {
      ElMessage.error('请求超时，请检查网络连接')
    } else {
      ElMessage.error('网络错误，请检查网络连接')
    }
    
    return Promise.reject(error)
  }
)

// 封装常用请求方法
export const http = {
  get(url, params) {
    return request.get(url, { params })
  },
  
  post(url, data) {
    return request.post(url, data)
  },
  
  put(url, data) {
    return request.put(url, data)
  },
  
  delete(url, params) {
    return request.delete(url, { params })
  }
}

export default request
