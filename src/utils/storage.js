const STORAGE_KEYS = {
  TOKEN: 'wx_mini_token',
  USER_INFO: 'wx_mini_user_info',
  USER_ID: 'wx_mini_user_id'
}

function setStorage(key, value) {
  try {
    uni.setStorageSync(key, typeof value === 'object' ? JSON.stringify(value) : value)
    return true
  } catch (e) {
    console.error('storage set error:', e)
    return false
  }
}

function getStorage(key) {
  try {
    const value = uni.getStorageSync(key)
    try {
      return JSON.parse(value)
    } catch {
      return value
    }
  } catch (e) {
    console.error('storage get error:', e)
    return null
  }
}

function removeStorage(key) {
  try {
    uni.removeStorageSync(key)
    return true
  } catch (e) {
    console.error('storage remove error:', e)
    return false
  }
}

function clearStorage() {
  try {
    uni.clearStorageSync()
    return true
  } catch (e) {
    console.error('storage clear error:', e)
    return false
  }
}

function setToken(token) {
  return setStorage(STORAGE_KEYS.TOKEN, token)
}

function getToken() {
  return getStorage(STORAGE_KEYS.TOKEN)
}

function removeToken() {
  return removeStorage(STORAGE_KEYS.TOKEN)
}

function setUserInfo(userInfo) {
  return setStorage(STORAGE_KEYS.USER_INFO, userInfo)
}

function getUserInfo() {
  return getStorage(STORAGE_KEYS.USER_INFO)
}

function removeUserInfo() {
  return removeStorage(STORAGE_KEYS.USER_INFO)
}

function setUserId(userId) {
  return setStorage(STORAGE_KEYS.USER_ID, userId)
}

function getUserId() {
  return getStorage(STORAGE_KEYS.USER_ID)
}

function removeUserId() {
  return removeStorage(STORAGE_KEYS.USER_ID)
}

function clearAuth() {
  removeToken()
  removeUserInfo()
  removeUserId()
}

export {
  STORAGE_KEYS,
  setStorage,
  getStorage,
  removeStorage,
  clearStorage,
  setToken,
  getToken,
  removeToken,
  setUserInfo,
  getUserInfo,
  removeUserInfo,
  setUserId,
  getUserId,
  removeUserId,
  clearAuth
}

export default {
  setStorage,
  getStorage,
  removeStorage,
  clearStorage,
  setToken,
  getToken,
  removeToken,
  setUserInfo,
  getUserInfo,
  removeUserInfo,
  setUserId,
  getUserId,
  removeUserId,
  clearAuth
}