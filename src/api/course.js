import http from '../utils/request'

export async function getCourseList(data) {
  return http.get('/course/list', data)
}

export async function getCourseDetail(data) {
  return http.get('/course/detail', data)
}

export async function getCourseChapters(data) {
  return http.get('/course/chapters', data)
}

export async function getChapterDetail(data) {
  return http.get('/course/chapter/detail', data)
}

export async function enrollCourse(data) {
  return http.post('/course/enroll', data)
}

export async function unenrollCourse(data) {
  return http.post('/course/unenroll', data)
}

export async function getMyCourses(data) {
  return http.get('/course/my', data)
}

export async function getStudentCourseList(data) {
  return http.get('/course/student/list', data)
}

export async function getCourseProgress(data) {
  return http.get('/course/progress', data)
}

export async function updateCourseProgress(data) {
  return http.post('/course/progress/update', data)
}

export async function searchCourses(data) {
  return http.get('/course/search', data)
}

export async function joinCourseByCode(data) {
  return http.post('/course/join', data)
}