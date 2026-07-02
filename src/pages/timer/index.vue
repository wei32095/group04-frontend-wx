<template>
  <view class="page-container">
    <view class="nav-bar">
      <text class="nav-title">计时</text>
    </view>
    
    <view class="timer-section">
      <view class="timer-circle">
        <text class="timer-display">{{ formattedTime }}</text>
        <text class="timer-total">共{{ totalMinutes }}分钟</text>
      </view>
    </view>
    
    <view class="btn-section">
      <view class="control-btn stop" @click="handleStop">
        <view class="stop-icon"></view>
      </view>
      <view class="control-btn pause" @click="handlePause">
        <view class="pause-icon" v-if="!isPaused">
          <view class="pause-bar"></view>
          <view class="pause-bar"></view>
        </view>
        <view class="play-icon" v-else>
          <view class="play-triangle"></view>
        </view>
      </view>
    </view>
    
    <view class="modal-overlay" v-if="showModal" @click="handleModalClose">
      <view class="modal-content" @click.stop>
        <text class="modal-title">自习结束</text>
        <text class="modal-desc">本次自习{{ studyMinutes }}分钟</text>
        <text class="modal-valid" :class="{ 'valid': isValidStudy === 1, 'invalid': isValidStudy === 0 }">
          {{ isValidStudy === 1 ? '有效学习 +5积分' : (isValidStudy === 0 ? '切屏过多，不计入积分' : '') }}
        </text>
        <view class="modal-btn" @click="handleModalClose">
          <text class="modal-btn-text">确定</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { onLoad, onShow, onHide } from '@dcloudio/uni-app'
import { endStudy } from '@/api/studyroom'

const timeMode = ref('forward')
const totalSeconds = ref(0)
const currentSeconds = ref(0)
const isPaused = ref(false)
const showModal = ref(false)
const studyRecordId = ref(null)
const screenSwitchCount = ref(0)
const hasEnded = ref(false)
const totalStudyTime = ref(0)
const isValidStudy = ref(0)
let timer = null
let isBackground = false

// 新增：记录实际消耗总秒数
const realUsedSeconds = ref(0)

const formattedTime = computed(() => {
  const seconds = currentSeconds.value
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return `${padZero(h)}:${padZero(m)}:${padZero(s)}`
})

// 弹窗实际用时，不足1分钟向上取整
const realUsedMinutes = computed(() => {
  const sec = realUsedSeconds.value
  return sec === 0 ? 0 : Math.ceil(sec / 60)
})

const studyMinutes = computed(() => {
  if (totalStudyTime.value > 0) {
    return Math.ceil(totalStudyTime.value / 60)
  }
  return realUsedMinutes.value
})

const totalMinutes = computed(() => {
  if (timeMode.value === 'countdown') {
    return Math.ceil(totalSeconds.value / 60)
  }
  return Math.ceil(currentSeconds.value / 60)
})

function padZero(num) {
  return num.toString().padStart(2, '0')
}

onLoad((options) => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }

  // 新增：重置实际消耗总秒数
  realUsedSeconds.value = 0

  timeMode.value = options.mode || 'forward'
  const countdown = parseInt(options.countdown) || 0
  studyRecordId.value = options.id || null
  console.log('页面参数：mode=', timeMode.value, 'countdown=', countdown, 'id=', studyRecordId.value)

  if (timeMode.value === 'countdown' && countdown > 0) {
    totalSeconds.value = countdown * 60
    currentSeconds.value = totalSeconds.value
  } else {
    totalSeconds.value = 0
    currentSeconds.value = 0
  }

  startTimer()
})

onShow(() => {
  if (isBackground) {
    screenSwitchCount.value++
    isBackground = false
  }
})

onHide(() => {
  isBackground = true
})

onUnmounted(() => {
  stopTimer()
  if (studyRecordId.value && !hasEnded.value) {
    hasEnded.value = true
    endStudy({
      id: studyRecordId.value,
      screenSwitchCount: screenSwitchCount.value
    }).catch(error => {
      console.error('结束自习失败:', error)
    })
  }
})

function startTimer() {
  timer = setInterval(() => {
    if (!isPaused.value) {
      if (timeMode.value === 'forward') {
        currentSeconds.value++
        realUsedSeconds.value++
      } else {
        if (currentSeconds.value > 0) {
          currentSeconds.value--
          realUsedSeconds.value++ 
        } else {
          handleStop()
        }
      }
    }
  }, 1000)
}

function stopTimer() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

function handlePause() {
  isPaused.value = !isPaused.value
}

async function handleStop() {
  stopTimer()
  if (studyRecordId.value && !hasEnded.value) {
    hasEnded.value = true
    try {
      const res = await endStudy({
        id: studyRecordId.value,
        screenSwitchCount: screenSwitchCount.value
      })
      if (res) {
        totalStudyTime.value = res.totalTime
        isValidStudy.value = res.isValid
      }
    } catch (error) {
      console.error('结束自习失败:', error)
    }
  }
  showModal.value = true
}

function handleModalClose() {
  showModal.value = false
  uni.navigateBack()
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

.timer-section {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 120rpx 30rpx;
}

.timer-circle {
  width: 600rpx;
  height: 600rpx;
  border-radius: 50%;
  background-color: #FFFFFF;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
}

.timer-display {
  font-size: 88rpx;
  font-weight: 700;
  color: #333333;
  font-family: 'Microsoft YaHei', sans-serif;
  line-height: 1.2;
}

.timer-total {
  font-size: 28rpx;
  color: #999999;
  margin-top: 20rpx;
}

.btn-section {
  display: flex;
  justify-content: center;
  gap: 160rpx;
  padding: 80rpx 30rpx;
}

.control-btn {
  width: 140rpx;
  height: 140rpx;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.control-btn.stop {
  background-color: #FFFFFF;
  border: 4rpx solid #1e7d7b;
}

.stop-icon {
  width: 48rpx;
  height: 48rpx;
  background-color: #1e7d7b;
  border-radius: 8rpx;
}

.control-btn.pause {
  background-color: #FFFFFF;
  border: 4rpx solid #1e7d7b;
}

.pause-icon {
  display: flex;
  gap: 12rpx;
}

.pause-bar {
  width: 12rpx;
  height: 56rpx;
  background-color: #1e7d7b;
  border-radius: 6rpx;
}

.play-icon {
  display: flex;
  justify-content: center;
  align-items: center;
}

.play-triangle {
  width: 0;
  height: 0;
  border-top: 28rpx solid transparent;
  border-bottom: 28rpx solid transparent;
  border-left: 48rpx solid #1e7d7b;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  width: 600rpx;
  background-color: #FFFFFF;
  border-radius: 24rpx;
  padding: 60rpx 40rpx;
  text-align: center;
}

.modal-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333333;
  display: block;
  margin-bottom: 30rpx;
}

.modal-desc {
  font-size: 32rpx;
  color: #666666;
  display: block;
  margin-bottom: 16rpx;
}

.modal-valid {
  font-size: 28rpx;
  display: block;
  margin-bottom: 48rpx;
}

.modal-valid.valid {
  color: #4CAF50;
}

.modal-valid.invalid {
  color: #E53935;
}

.modal-btn {
  background-color: #4CAF50;
  border-radius: 12rpx;
  padding: 24rpx;
}

.modal-btn-text {
  font-size: 32rpx;
  color: #FFFFFF;
  font-weight: 500;
}
</style>