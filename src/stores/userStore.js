import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // 状态
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref(JSON.parse(localStorage.getItem('userInfo') || '{}'))
  const isLoggedIn = ref(!!localStorage.getItem('token'))

  // 计算属性
  const hasToken = computed(() => !!token.value)
  const getUserInfo = computed(() => userInfo.value)
  const getToken = computed(() => token.value)

  // 方法
  const setToken = (newToken) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
    isLoggedIn.value = true
  }

  const setUserInfo = (info) => {
    userInfo.value = info
    localStorage.setItem('userInfo', JSON.stringify(info))
  }

  const login = (loginData) => {
    setToken(loginData.token)
    setUserInfo({
      userId: loginData.userId,
      nickname: loginData.nickname,
      role: loginData.role,
      plantations: loginData.plantations || []
    })
  }

  const logout = () => {
    token.value = ''
    userInfo.value = {}
    isLoggedIn.value = false
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
  }

  const updateUserInfo = (newInfo) => {
    userInfo.value = { ...userInfo.value, ...newInfo }
    localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
  }

  return {
    // 状态
    token,
    userInfo,
    isLoggedIn,
    
    // 计算属性
    hasToken,
    getUserInfo,
    getToken,
    
    // 方法
    setToken,
    setUserInfo,
    login,
    logout,
    updateUserInfo
  }
})
