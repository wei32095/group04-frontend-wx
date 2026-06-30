import http from '../utils/request'

export async function getStudyAnalysis(data) {
  return http.get('/analysis/study', data)
}

export async function getCourseAnalysis(data) {
  return http.get('/analysis/course', data)
}

export async function getHomeworkAnalysis(data) {
  return http.get('/analysis/homework', data)
}

export async function getPointAnalysis(data) {
  return http.get('/analysis/point', data)
}

export async function getWeeklyReport(data) {
  return http.get('/analysis/weekly', data)
}

export async function getMonthlyReport(data) {
  return http.get('/analysis/monthly', data)
}

export async function getYearlyReport(data) {
  return http.get('/analysis/yearly', data)
}

export async function getComparativeAnalysis(data) {
  return http.get('/analysis/compare', data)
}

export async function getRecommendations(data) {
  return http.get('/analysis/recommendations', data)
}

export async function exportAnalysis(data) {
  return http.get('/analysis/export', data)
}