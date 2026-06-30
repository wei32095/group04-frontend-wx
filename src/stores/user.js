import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { removeToken, removeUserInfo } from '../utils/storage'

export const useUserStore = defineStore('user', () => {
  const token = ref('')
  const userInfo = ref({})
  const isLogin = computed(() => !!token.value)

  function setLoginInfo(data) {
    if (data.token) {
      token.value = data.token
    }
    if (data.userInfo) {
      userInfo.value = data.userInfo
    }
  }

  function clearLoginInfo() {
    token.value = ''
    userInfo.value = {}
    removeToken()
    removeUserInfo()
  }

  function updateUserInfo(data) {
    userInfo.value = { ...userInfo.value, ...data }
  }

  function setToken(newToken) {
    token.value = newToken
  }

  function getToken() {
    return token.value
  }

  return {
    token,
    userInfo,
    isLogin,
    setLoginInfo,
    clearLoginInfo,
    updateUserInfo,
    setToken,
    getToken
  }
}, {
  persist: {
    key: 'wx_mini_user_store',
    storage: {
      getItem: (key) => uni.getStorageSync(key),
      setItem: (key, value) => uni.setStorageSync(key, value),
      removeItem: (key) => uni.removeStorageSync(key)
    }
  }
})