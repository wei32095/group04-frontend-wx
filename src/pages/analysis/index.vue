<template>
  <view class="page-container">
    <view class="nav-bar">
      <view class="nav-back" @click="handleBack">
        <text class="back-icon">‹</text>
      </view>
      <text class="nav-title">青耘学堂</text>
      <view class="nav-placeholder"></view>
    </view>
    
    <view class="stats-section">
      <view class="stat-card green">
        <text class="stat-label">进行中课程</text>
        <text class="stat-num">{{ stats.ongoingCourses }}</text>
        <text class="stat-unit">门</text>
      </view>
      <view class="stat-card blue">
        <text class="stat-label">已完成课程</text>
        <text class="stat-num">{{ stats.completedCourses }}</text>
        <text class="stat-unit">门</text>
      </view>
      <view class="stat-card orange">
        <text class="stat-label">累计积分</text>
        <text class="stat-num">{{ stats.totalPoints }}</text>
        <text class="stat-unit">分</text>
      </view>
    </view>

    <view class="progress-section">
      <view class="section-title">各课程进度</view>
      <view class="course-item" v-for="course in courseProgress" :key="course.name">
        <view class="course-header">
          <text class="course-name">{{ course.name }}</text>
          <text class="course-percent">{{ course.progress }}%</text>
        </view>
        <view class="progress-bar">
          <view class="progress-fill" :style="{ width: course.progress + '%', backgroundColor: course.color }"></view>
        </view>
        <text class="course-detail">总学习时长: {{ course.duration }}小时 作业正确率: {{ course.accuracy }}%</text>
      </view>
    </view>

    <view class="report-section">
      <view class="tab-bar">
        <view 
          class="tab-item" 
          :class="{ active: activeTab === 'week' }"
          @click="activeTab = 'week'"
        >
          <text class="tab-text">本周报告</text>
        </view>
        <view 
          class="tab-item" 
          :class="{ active: activeTab === 'month' }"
          @click="activeTab = 'month'"
        >
          <text class="tab-text">本月报告</text>
        </view>
      </view>

      <view class="report-card" v-if="activeTab === 'week'">
        <view class="report-item">
          <view class="report-header">
            <text class="report-icon">📅</text>
            <text class="report-label">学习时长</text>
            <view class="report-trend up">
              <text class="trend-text">较上周+2h</text>
            </view>
          </view>
          <view class="report-value-row">
            <text class="report-num">{{ weekReport.studyHours }}</text>
            <text class="report-unit">小时</text>
            <text class="report-sub">{{ weekReport.studyMinutes }}分钟</text>
          </view>
          <view class="report-bar">
            <view class="report-fill green" :style="{ width: weekReport.studyProgress + '%' }"></view>
          </view>
          <text class="report-target">本周目标 {{ weekReport.targetHours }}小时</text>
        </view>

        <view class="report-item">
          <view class="report-header">
            <text class="report-icon">✓</text>
            <text class="report-label">作业正确率</text>
            <view class="report-trend up">
              <text class="trend-text">较上周+5%</text>
            </view>
          </view>
          <view class="report-value-row">
            <text class="report-num">{{ weekReport.accuracy }}</text>
            <text class="report-unit">%</text>
          </view>
          <view class="report-bar">
            <view class="report-fill blue" :style="{ width: weekReport.accuracy + '%' }"></view>
          </view>
          <text class="report-target">共完成{{ weekReport.homeworkCount }}次作业 <text class="grade">A级</text></text>
        </view>
      </view>

      <view class="report-card" v-if="activeTab === 'month'">
        <view class="report-item">
          <view class="report-header">
            <text class="report-icon">📅</text>
            <text class="report-label">学习时长</text>
            <view class="report-trend up">
              <text class="trend-text">较上月+8h</text>
            </view>
          </view>
          <view class="report-value-row">
            <text class="report-num">{{ monthReport.studyHours }}</text>
            <text class="report-unit">小时</text>
            <text class="report-sub">{{ monthReport.studyMinutes }}分钟</text>
          </view>
          <view class="report-bar">
            <view class="report-fill green" :style="{ width: monthReport.studyProgress + '%' }"></view>
          </view>
          <text class="report-target">本月目标 {{ monthReport.targetHours }}小时</text>
        </view>

        <view class="report-item">
          <view class="report-header">
            <text class="report-icon">✓</text>
            <text class="report-label">作业正确率</text>
            <view class="report-trend up">
              <text class="trend-text">较上月+3%</text>
            </view>
          </view>
          <view class="report-value-row">
            <text class="report-num">{{ monthReport.accuracy }}</text>
            <text class="report-unit">%</text>
          </view>
          <view class="report-bar">
            <view class="report-fill blue" :style="{ width: monthReport.accuracy + '%' }"></view>
          </view>
          <text class="report-target">共完成{{ monthReport.homeworkCount }}次作业 <text class="grade">A级</text></text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import http from '@/utils/request'

const activeTab = ref('week')

const stats = reactive({
  ongoingCourses: 4,
  completedCourses: 6,
  totalPoints: 267
})

const courseProgress = ref([
  { name: '高等数学', progress: 75, duration: 42.5, accuracy: 88, color: '#4CAF50' },
  { name: '大学英语', progress: 90, duration: 36.2, accuracy: 92, color: '#4CAF50' },
  { name: '数据结构', progress: 45, duration: 21.8, accuracy: 79, color: '#2196F3' }
])

const weekReport = reactive({
  studyHours: 12,
  studyMinutes: 30,
  studyProgress: 62,
  targetHours: 20,
  accuracy: 92,
  homeworkCount: 8
})

const monthReport = reactive({
  studyHours: 45,
  studyMinutes: 45,
  studyProgress: 75,
  targetHours: 60,
  accuracy: 89,
  homeworkCount: 28
})

onMounted(() => {
  fetchAnalysisData()
})

function handleBack() {
  uni.navigateBack()
}

async function fetchAnalysisData() {
  try {
    uni.showLoading({ title: '加载中...' })
    
    // TODO: 后续接入正式接口
    console.log('获取学情分析数据接口预留位置')
    // const res = await http.get('/analysis')
    // if (res) {
    //   stats.ongoingCourses = res.ongoingCourses || 0
    //   stats.completedCourses = res.completedCourses || 0
    //   stats.totalPoints = res.totalPoints || 0
    //   courseProgress.value = res.courseProgress || []
    //   weekReport.studyHours = res.weekReport.studyHours || 0
    //   weekReport.studyMinutes = res.weekReport.studyMinutes || 0
    //   weekReport.studyProgress = res.weekReport.studyProgress || 0
    //   weekReport.targetHours = res.weekReport.targetHours || 0
    //   weekReport.accuracy = res.weekReport.accuracy || 0
    //   weekReport.homeworkCount = res.weekReport.homeworkCount || 0
    // }
  } catch (error) {
    console.error('获取学情分析数据失败:', error)
  } finally {
    uni.hideLoading()
  }
}
</script>

<style scoped>
page {
  background-color: #F5F5F5;
  min-height: 100vh;
}

.page-container {
  min-height: 100vh;
  background-color: #F5F5F5;
  padding-bottom: 120rpx;
}

.nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: calc(var(--status-bar-height, 44px) + 20rpx);
  padding-bottom: 30rpx;
  padding-left: 30rpx;
  padding-right: 30rpx;
  background: linear-gradient(90deg, #4CAF50 0%, #4A90D9 100%);
  position: relative;
  z-index: 100;
}

.nav-back {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  font-size: 56rpx;
  color: #FFFFFF;
  font-weight: 300;
  line-height: 1;
}

.nav-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #FFFFFF;
}

.nav-placeholder {
  width: 60rpx;
}

.stats-section {
  display: flex;
  gap: 16rpx;
  margin-bottom: 24rpx;
  padding: 24rpx;
}

.stat-card {
  flex: 1;
  background-color: #FFFFFF;
  border-radius: 16rpx;
  padding: 24rpx 16rpx;
  border-top: 6rpx solid;
}

.stat-card.green {
  border-top-color: #4CAF50;
}

.stat-card.blue {
  border-top-color: #2196F3;
}

.stat-card.orange {
  border-top-color: #FF9800;
}

.stat-label {
  font-size: 22rpx;
  color: #999999;
  display: block;
}

.stat-num {
  font-size: 48rpx;
  font-weight: 700;
  color: #333333;
  display: block;
  line-height: 1.2;
}

.stat-unit {
  font-size: 22rpx;
  color: #999999;
}

.progress-section {
  background-color: #FFFFFF;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #333333;
  margin-bottom: 24rpx;
}

.course-item {
  margin-bottom: 28rpx;
}

.course-item:last-child {
  margin-bottom: 0;
}

.course-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.course-name {
  font-size: 28rpx;
  font-weight: 500;
  color: #333333;
}

.course-percent {
  font-size: 28rpx;
  font-weight: 600;
  color: #4CAF50;
}

.progress-bar {
  height: 12rpx;
  background-color: #F0F0F0;
  border-radius: 6rpx;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 6rpx;
  transition: width 0.3s ease;
}

.course-detail {
  font-size: 22rpx;
  color: #999999;
  display: block;
  margin-top: 8rpx;
}

.report-section {
  background-color: #FFFFFF;
  border-radius: 16rpx;
  overflow: hidden;
}

.tab-bar {
  display: flex;
  border-bottom: 2rpx solid #F5F5F5;
}

.tab-item {
  flex: 1;
  padding: 28rpx 0;
  text-align: center;
  position: relative;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60rpx;
  height: 6rpx;
  background-color: #4CAF50;
  border-radius: 3rpx;
}

.tab-text {
  font-size: 28rpx;
  color: #999999;
}

.tab-item.active .tab-text {
  color: #333333;
  font-weight: 600;
}

.report-card {
  padding: 24rpx;
}

.report-item {
  padding: 20rpx 0;
  border-bottom: 2rpx solid #F5F5F5;
}

.report-item:last-child {
  border-bottom: none;
}

.report-header {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}

.report-icon {
  font-size: 32rpx;
  margin-right: 12rpx;
}

.report-label {
  font-size: 28rpx;
  color: #333333;
  flex: 1;
}

.report-trend {
  padding: 6rpx 12rpx;
  border-radius: 12rpx;
}

.report-trend.up {
  background-color: #E8F5E9;
}

.report-trend.down {
  background-color: #FFEBEE;
}

.trend-text {
  font-size: 22rpx;
  color: #4CAF50;
}

.report-trend.down .trend-text {
  color: #E53935;
}

.report-value-row {
  display: flex;
  align-items: baseline;
  margin-bottom: 16rpx;
}

.report-num {
  font-size: 56rpx;
  font-weight: 700;
  color: #333333;
}

.report-unit {
  font-size: 28rpx;
  color: #666666;
  margin-left: 8rpx;
}

.report-sub {
  font-size: 26rpx;
  color: #999999;
  margin-left: 12rpx;
}

.report-bar {
  height: 16rpx;
  background-color: #F0F0F0;
  border-radius: 8rpx;
  overflow: hidden;
  margin-bottom: 12rpx;
}

.report-fill {
  height: 100%;
  border-radius: 8rpx;
}

.report-fill.green {
  background-color: #4CAF50;
}

.report-fill.blue {
  background-color: #2196F3;
}

.report-target {
  font-size: 24rpx;
  color: #999999;
}

.grade {
  color: #4CAF50;
  font-weight: 600;
}
</style>