import http from '../utils/request'

export async function login(data, options = {}) {
  return http.post('/login/mp', data, options)
}

export async function logout(data) {
  return http.post('/user/logout', data)
}

export async function getUserInfo(data) {
  return http.get('/user/info', data)
}

export async function updateUserInfo(data) {
  return http.put('/user/info', data)
}

export async function changePassword(data) {
  return http.post('/user/password/change', data)
}

export async function resetPassword(data) {
  return http.post('/user/password/reset', data)
}

export async function bindMobile(data) {
  return http.post('/user/mobile/bind', data)
}

export async function sendSmsCode(data) {
  return http.post('/user/sms/send', data)
}

export async function uploadAvatar(data) {
  return http.post('/user/avatar/upload', data)
}

export async function getUserList(data) {
  return http.get('/user/list', data)
}