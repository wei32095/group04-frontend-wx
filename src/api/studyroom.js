import http from '../utils/request'

export async function enterStudyroom(data) {
  return http.post('/studyroom/enter', data)
}

export async function exitStudyroom(data) {
  return http.post('/studyroom/exit', data)
}

export async function getStudyroomList(data) {
  return http.get('/studyroom/list', data)
}

export async function getStudyroomDetail(data) {
  return http.get('/studyroom/detail', data)
}

export async function getMyStudyroom(data) {
  return http.get('/studyroom/my', data)
}

export async function createStudyroom(data) {
  return http.post('/studyroom/create', data)
}

export async function joinStudyroom(data) {
  return http.post('/studyroom/join', data)
}

export async function leaveStudyroom(data) {
  return http.post('/studyroom/leave', data)
}

export async function getStudyroomMembers(data) {
  return http.get('/studyroom/members', data)
}

export async function getStudyroomRecords(data) {
  return http.get('/studyroom/records', data)
}