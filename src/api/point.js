import http from '../utils/request'

export async function getPointBalance(data) {
  return http.get('/point/balance', data)
}

export async function getPointHistory(data) {
  return http.get('/point/history', data)
}

export async function earnPoints(data) {
  return http.post('/point/earn', data)
}

export async function spendPoints(data) {
  return http.post('/point/spend', data)
}

export async function exchangePoints(data) {
  return http.post('/point/exchange', data)
}

export async function getPointTasks(data) {
  return http.get('/point/tasks', data)
}

export async function completePointTask(data) {
  return http.post('/point/task/complete', data)
}

export async function getPointRank(data) {
  return http.get('/point/rank', data)
}

export async function getPointRules(data) {
  return http.get('/point/rules', data)
}

export async function getPointExchangeList(data) {
  return http.get('/point/exchange/list', data)
}