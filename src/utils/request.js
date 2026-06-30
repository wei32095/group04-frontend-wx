const ENV = 'development'

const BASE_URL_MAP = {
  //sun热点
 /* development: 'http://192.168.43.232:8080/qingyun',
  staging: 'http://192.168.43.232:8080/qingyun',
  production: 'http://192.168.43.232:8080/qingyun' */
  
  //我的热点
  development: 'http://10.23.184.106:8080/qingyun',
  staging: 'http://10.23.184.106:8080/qingyun',
  production: 'http://10.23.184.106:8080/qingyun'
}

const baseUrl = BASE_URL_MAP[ENV] || BASE_URL_MAP.development

// 开发调试模式：true为使用模拟登录，false为使用真实登录
export const USE_MOCK_LOGIN = false

const clientId = 'wx_mini_app'
const clientVersion = '1.0.0'

import { getToken as getStorageToken } from './storage'

function getToken() {
  const token = getStorageToken()
  if (token) return token
  const userStoreStr = uni.getStorageSync('wx_mini_user_store')
  if (userStoreStr) {
    try {
      const userStore = JSON.parse(userStoreStr)
      return userStore.token || ''
    } catch {
      return ''
    }
  }
  return ''
}

function request(options) {
  const { url, method = 'GET', data = {}, header = {}, loading = true } = options

  return new Promise((resolve, reject) => {
    if (loading) {
      uni.showLoading({ title: '加载中...' })
    }

    const token = getToken()
    const defaultHeader = {
      'Content-Type': 'application/json',
      'X-Client-Id': clientId,
      'X-Client-Version': clientVersion
    }

    if (token) {
      defaultHeader['Authorization'] = `Bearer ${token}`
    }

    uni.request({
      url: baseUrl + url,
      method: method.toUpperCase(),
      data,
      header: { ...defaultHeader, ...header },
      success: (res) => {
        if (loading) {
          uni.hideLoading()
        }

        const { statusCode, data: responseData } = res

        if (statusCode === 200) {
          const { code, message, data: result } = responseData

          if (code === 0 || code === 200) {
            resolve(result)
          } else if (code === 401) {
            uni.showToast({ title: '登录已过期，请重新登录', icon: 'none' })
            setTimeout(() => {
              uni.navigateTo({ url: '/pages/login/index' })
            }, 1500)
            reject(new Error('Unauthorized'))
          } else {
            uni.showToast({ title: message || '请求失败', icon: 'none' })
            reject(new Error(message || '请求失败'))
          }
        } else {
          uni.showToast({ title: `请求错误：${statusCode}`, icon: 'none' })
          reject(new Error(`HTTP Error: ${statusCode}`))
        }
      },
      fail: (err) => {
        if (loading) {
          uni.hideLoading()
        }

        uni.showToast({ title: '网络请求失败', icon: 'none' })
        reject(err)
      },
      complete: () => {
        if (loading) {
          uni.hideLoading()
        }
      }
    })
  })
}

const http = {
  get(url, data = {}, options = {}) {
    return request({ url, method: 'GET', data, ...options })
  },
  post(url, data = {}, options = {}) {
    return request({ url, method: 'POST', data, ...options })
  },
  put(url, data = {}, options = {}) {
    return request({ url, method: 'PUT', data, ...options })
  },
  delete(url, data = {}, options = {}) {
    return request({ url, method: 'DELETE', data, ...options })
  }
}

export { request, http, baseUrl }
export default http