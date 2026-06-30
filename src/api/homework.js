import http from '../utils/request'

export async function getHomeworkList(data) {
  return http.get('/homework/list', data)
}

export async function getHomeworkDetail(data) {
  return http.get('/homework/detail', data)
}

export async function submitHomework(data) {
  return http.post('/homework/submit', data)
}

export async function getMyHomework(data) {
  return http.get('/homework/my', data)
}

export async function getHomeworkResult(data) {
  return http.get('/homework/result', data)
}

export async function getHomeworkGrades(data) {
  return http.get('/homework/grades', data)
}

export async function getHomeworkStatistics(data) {
  return http.get('/homework/statistics', data)
}

export async function downloadHomework(data) {
  return http.get('/homework/download', data)
}

export async function uploadHomework(data) {
  return http.post('/homework/upload', data)
}

export async function correctHomework(data) {
  return http.post('/homework/correct', data)
}