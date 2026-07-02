<template>
  <view class="page-container">
    <view class="nav-bar">
      <text class="nav-title">青耘学堂</text>
    </view>
    
    <view class="page-header">
      <text class="page-title">单人自习室</text>
    </view>
    
    <view class="study-card">
      <view class="card-header">
        <text class="card-title">开启专属单人自习</text>
        <text class="card-desc">无打扰个人学习空间，自动记录时长、兑换积分花卉道具</text>
      </view>
      
      <view class="form-row-full">
        <view class="form-item-full">
          <text class="form-label">自习目标</text>
          <input 
            class="form-input-full" 
            placeholder="请输入自习目标" 
            v-model="currentGoal"
            @input="handleGoalInput"
          />
        </view>
      </view>
      
      <view class="form-row-full">
        <view class="form-item-full">
          <text class="form-label">计时模式</text>
          <view class="form-select-full" @click="showTimeModePicker">
            <text class="select-value">{{ timeModeOptions[timeModeIndex] }}</text>
            <text class="select-arrow">▾</text>
          </view>
        </view>
      </view>
      
      <view class="timer-row" v-if="timeModeIndex === 1">
        <view class="timer-item">
          <text class="form-label">倒计时长</text>
          <view class="timer-select" @click="showCountdownPicker">
            <text class="select-value">{{ hasSelectedCountdown ? countdownMinutes : '请选择时长' }}</text>
            <text class="select-unit">分钟</text>
            <text class="select-arrow">▾</text>
          </view>
        </view>
      </view>
      
      <view class="mode-row">
        <view 
          class="mode-btn" 
          :class="{ active: focusMode === 'normal' }"
          @click="handleModeSwitch('normal')"
        >
          <text class="mode-text">普通</text>
        </view>
        <view 
          class="mode-btn" 
          :class="{ active: focusMode === 'pomodoro' }"
          @click="handleModeSwitch('pomodoro')"
        >
          <text class="mode-text">番茄钟</text>
        </view>
      </view>
      
      <view class="start-btn" @click="handleStartStudy">
        <text class="start-btn-text">开始自习</text>
      </view>
    </view>
    
    <view class="record-section">
      <text class="section-title">自习记录</text>
      <view 
        class="record-row" 
        v-for="(record, index) in studyRecords" 
        :key="index"
        @click="handleRecordClick(record)"
      >
        <text class="record-item date">{{ record.date }}</text>
        <text class="record-item goal">{{ record.goal }}</text>
        <text class="record-item duration">{{ record.duration }}</text>
        <text class="record-item status" :style="{ color: record.statusColor }">{{ record.status }}</text>
        <text class="record-item points" :style="{ color: record.pointsColor }">{{ record.points }}</text>
      </view>
    </view>
    
    <view class="stats-section">
      <view class="stat-card green">
        <text class="stat-label">本月自习总时长</text>
        <text class="stat-value">{{ monthStudyHours }}</text>
        <text class="stat-unit">小时</text>
      </view>
      <view class="stat-card blue">
        <text class="stat-label">本周自习时长</text>
        <text class="stat-value">{{ weekStudyHours }}</text>
        <text class="stat-unit">小时</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { createStudyroom, getStudyroomRecords, getStudyroomStatistic } from '@/api/studyroom'

const currentGoal = ref('')
const timeModeOptions = ['正计时', '倒计时']
const timeModeIndex = ref(0)
const countdownMinutes = ref('')
const countdownOptions = ['15', '30', '45', '60', '90', '120']
const countdownIndex = ref(0)
const hasSelectedCountdown = ref(false)
const focusMode = ref('normal')

const currentTimeMode = computed(() => {
  return timeModeIndex.value === 0 ? 'forward' : 'countdown'
})

const studyRecords = ref([])
const weekStudyHours = ref(0)
const monthStudyHours = ref(0)

function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours > 0) {
    return `${hours}h${minutes}m`
  }
  return `${minutes}m`
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return dateStr.substring(0, 10)
}

async function fetchStudyRecords() {
  try {
    const res = await getStudyroomRecords({ page: 1, size: 10 })
    if (res && res.location) {
      studyRecords.value = res.location.map(record => ({
        id: record.id,
        date: formatDate(record.startTime),
        goal: record.goal,
        duration: formatDuration(record.totalTime || 0),
        status: record.endTime ? '完成' : '进行中',
        statusColor: record.endTime ? '#4CAF50' : '#FF9800',
        points: record.endTime ? '+5' : '',
        pointsColor: '#4CAF50'
      }))
    }
  } catch (error) {
    console.error('获取自习记录失败:', error)
  }
}

function handleGoalInput(e) {
  console.log('输入自习目标:', e.detail.value)
}

async function fetchStudyStatistic() {
  try {
    const res = await getStudyroomStatistic()
    if (res) {
      weekStudyHours.value = Math.floor(res.weekStudyDuration / 3600)
      monthStudyHours.value = Math.floor(res.monthStudyDuration / 3600)
    }
  } catch (error) {
    console.error('获取自习统计失败:', error)
  }
}

onMounted(() => {
  fetchStudyRecords()
  fetchStudyStatistic()
})

function showTimeModePicker() {
  uni.showActionSheet({
    itemList: ['正计时', '倒计时'],
    success: function (res) {
      const newIndex = res.tapIndex
      timeModeIndex.value = newIndex
      countdownMinutes.value = ''
      countdownIndex.value = 0
      hasSelectedCountdown.value = false
      console.log('切换计时模式:', newIndex === 0 ? 'forward' : 'countdown')
    }
  })
}

function showCountdownPicker() {
  uni.showActionSheet({
    itemList: ['15分钟', '30分钟', '45分钟', '60分钟', '90分钟', '120分钟'],
    success: function (res) {
      countdownIndex.value = res.tapIndex
      countdownMinutes.value = countdownOptions[res.tapIndex]
      hasSelectedCountdown.value = true
      console.log('选择倒计时分钟:', countdownMinutes.value)
    },
    fail: function (res) {
      console.log('取消选择')
    }
  })
}

function handleModeSwitch(mode) {
  focusMode.value = mode
  console.log('切换专注模式:', mode)
}

async function handleStartStudy() {
  const goal = currentGoal.value || '自习'
  const mode = timeModeIndex.value === 0 ? 1 : 2
  const planTime = mode === 2 ? Number(countdownMinutes.value) * 60 : 0
  const focusModeVal = focusMode.value === 'normal' ? 0 : 1
  
  if (timeModeIndex.value === 1 && !hasSelectedCountdown.value) {
    uni.showToast({
      title: '请选择倒计时时长',
      icon: 'none'
    })
    return
  }
  
  try {
    const res = await createStudyroom({
      goal,
      mode,
      planTime,
      focusMode: focusModeVal
    })
    
    if (res && res.id) {
      const studyRecordId = res.id
      if (focusMode.value === 'normal') {
        const url = `/pages/timer/index?mode=${currentTimeMode.value}&countdown=${countdownMinutes.value || 0}&id=${studyRecordId}`
        uni.navigateTo({ url })
      } else {
        const url = `/pages/pomodoro/index?id=${studyRecordId}&countdown=${countdownMinutes.value || 15}`
        uni.navigateTo({ url })
      }
    }
  } catch (error) {
    console.error('开始自习失败:', error)
    uni.showToast({ title: '开始自习失败', icon: 'none' })
  }
}

function handleRecordClick(record) {
  console.log('点击自习记录:', record)
}
</script>

<style scoped>
page {
  background-color: #F5F5F5;
}

.page-container {
  min-height: 100vh;
  background-color: #F5F5F5;
  padding-bottom: 120rpx;
}

.nav-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: calc(var(--status-bar-height, 44px) + 20rpx);
  padding-bottom: 30rpx;
  padding-left: 30rpx;
  padding-right: 30rpx;
  background: linear-gradient(90deg, #4CAF50 0%, #4A90D9 100%);
  position: relative;
  z-index: 100;
}

.nav-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #FFFFFF;
}

.page-header {
  padding: 30rpx;
  background-color: #F5F5F5;
}

.page-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333333;
}

.study-card {
  margin: 0 30rpx;
  padding: 30rpx;
  background-color: #FFFFFF;
  border-radius: 16rpx;
}

.card-header {
  margin-bottom: 30rpx;
}

.card-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333333;
  display: block;
  margin-bottom: 8rpx;
}

.card-desc {
  font-size: 24rpx;
  color: #999999;
  display: block;
}

.form-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30rpx;
}

.form-item {
  flex: 1;
}

.form-label {
  font-size: 24rpx;
  color: #999999;
  display: block;
  margin-bottom: 12rpx;
}

.form-select {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 20rpx;
  background-color: #F5F5F5;
  border-radius: 12rpx;
}

.select-value {
  font-size: 28rpx;
  color: #333333;
}

.select-arrow {
  font-size: 24rpx;
  color: #999999;
}

.form-input {
  padding: 16rpx 20rpx;
  background-color: #F5F5F5;
  border-radius: 12rpx;
  font-size: 28rpx;
  color: #333333;
}

.form-row-full {
  margin-bottom: 30rpx;
}

.form-item-full {
  width: 100%;
}

.form-input-full {
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  padding: 0 20rpx;
  background-color: #F5F5F5;
  border-radius: 12rpx;
  font-size: 28rpx;
  color: #333333;
  box-sizing: border-box;
}

.form-select-full {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80rpx;
  padding: 0 20rpx;
  background-color: #F5F5F5;
  border-radius: 12rpx;
}

.timer-row {
  margin-bottom: 30rpx;
}

.timer-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.timer-select {
  display: flex;
  align-items: center;
  height: 80rpx;
  background-color: #F5F5F5;
  border-radius: 12rpx;
  padding: 0 20rpx;
}

.select-unit {
  font-size: 28rpx;
  color: #666666;
  margin-left: 8rpx;
}

.timer-unit {
  font-size: 28rpx;
  color: #666666;
}

.mode-row {
  display: flex;
  margin-bottom: 30rpx;
}

.mode-btn {
  flex: 1;
  padding: 20rpx;
  text-align: center;
  background-color: #F5F5F5;
  border-radius: 12rpx;
  margin-right: 16rpx;
}

.mode-btn:last-child {
  margin-right: 0;
}

.mode-btn.active {
  background-color: #4CAF50;
}

.mode-btn.active .mode-text {
  color: #FFFFFF;
}

.mode-text {
  font-size: 28rpx;
  color: #666666;
}

.start-btn {
  background-color: #4CAF50;
  border-radius: 12rpx;
  padding: 24rpx;
  text-align: center;
}

.start-btn-text {
  font-size: 32rpx;
  color: #FFFFFF;
  font-weight: 500;
}

.record-section {
  margin: 30rpx;
  background-color: #FFFFFF;
  border-radius: 16rpx;
  overflow: hidden;
}

.section-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #333333;
  display: block;
  padding: 28rpx 30rpx 16rpx;
}

.record-row {
  display: flex;
  padding: 20rpx 30rpx;
  border-bottom: 2rpx solid #F5F5F5;
}

.record-row:last-child {
  border-bottom: none;
}

.record-item {
  font-size: 24rpx;
  flex: 1;
  text-align: center;
  color: #666666;
}

.record-item.date {
  font-size: 22rpx;
}

.record-item.goal {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.stats-section {
  display: flex;
  padding: 0 30rpx;
  margin-bottom: 30rpx;
}

.stat-card {
  flex: 1;
  border-radius: 16rpx;
  padding: 28rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 20rpx;
}

.stat-card:last-child {
  margin-right: 0;
}

.stat-card.green {
  background: linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%);
  border-top: 6rpx solid #4CAF50;
}

.stat-card.blue {
  background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
  border-top: 6rpx solid #2196F3;
}

.stat-label {
  font-size: 22rpx;
  color: #666666;
  margin-bottom: 12rpx;
}

.stat-value {
  font-size: 64rpx;
  font-weight: 700;
  color: #333333;
}

.stat-unit {
  font-size: 24rpx;
  color: #666666;
  margin-top: 8rpx;
}
</style>
