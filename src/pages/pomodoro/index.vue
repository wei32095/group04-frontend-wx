<template>
  <view class="page-container">
    <view class="nav-bar">
      <text class="nav-title">番茄钟</text>
    </view>
    
    <view class="timer-section">
      <view class="pomodoro-leaves">
        <view class="leaf left"></view>
        <view class="leaf right"></view>
      </view>
      <view class="timer-circle" :class="{ 'focus-mode': currentPhase === 'focus', 'break-mode': currentPhase === 'break' }">
        <text class="timer-display">{{ formattedTime }}</text>
        <text class="timer-total">共{{ totalMinutes }}分钟</text>
      </view>
      <text class="phase-label">{{ currentPhase === 'focus' ? '专注中' : '休息中' }}</text>
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
        <text class="modal-desc">本次自习{{ realUsedMinutes }}分钟</text>
        <view class="modal-btn" @click="handleModalClose">
          <text class="modal-btn-text">确定</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const currentPhase = ref('focus')
const focusDuration = 15
const breakDuration = 5
const totalSeconds = ref(focusDuration * 60)
const currentSeconds = ref(focusDuration * 60)
const isPaused = ref(false)
const showModal = ref(false)
const studyRecordId = ref(null)
let timer = null

const realUsedSeconds = ref(0)

const formattedTime = computed(() => {
  const seconds = currentSeconds.value
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return `${padZero(h)}:${padZero(m)}:${padZero(s)}`
})

const realUsedMinutes = computed(() => {
  const sec = realUsedSeconds.value
  return sec === 0 ? 0 : Math.ceil(sec / 60)
})

const totalMinutes = computed(() => {
  return currentPhase.value === 'focus' ? focusDuration : breakDuration
})

function padZero(num) {
  return num.toString().padStart(2, '0')
}

onLoad((options) => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  realUsedSeconds.value = 0
  studyRecordId.value = options.id || null
  console.log('番茄钟参数：id=', studyRecordId.value)
  currentPhase.value = 'focus'
  totalSeconds.value = focusDuration * 60
  currentSeconds.value = totalSeconds.value
  startTimer()
})

onUnmounted(() => {
  stopTimer()
})

function startTimer() {
  timer = setInterval(() => {
    if (!isPaused.value) {
      if (currentSeconds.value > 0) {
        currentSeconds.value--
        if (currentPhase.value === 'focus') {
          realUsedSeconds.value++
        }
      } else {
        switchPhase()
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

function switchPhase() {
  if (currentPhase.value === 'focus') {
    currentPhase.value = 'break'
    totalSeconds.value = breakDuration * 60
    currentSeconds.value = totalSeconds.value
  } else {
    currentPhase.value = 'focus'
    totalSeconds.value = focusDuration * 60
    currentSeconds.value = totalSeconds.value
  }
}

function handlePause() {
  isPaused.value = !isPaused.value
}

function handleStop() {
  stopTimer()
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
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 80rpx 30rpx;
  position: relative;
}

.pomodoro-leaves {
  position: absolute;
  top: 80rpx;
  z-index: 10;
}

.leaf {
  width: 60rpx;
  height: 80rpx;
  background-color: #4CAF50;
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  position: absolute;
}

.leaf.left {
  transform: rotate(-30deg);
  right: 50%;
  margin-right: 10rpx;
}

.leaf.right {
  transform: rotate(30deg);
  left: 50%;
  margin-left: 10rpx;
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
  margin-top: 40rpx;
}

.timer-circle.focus-mode {
  border: 8rpx solid #E53935;
}

.timer-circle.break-mode {
  border: 8rpx solid #1e7d7b;
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

.phase-label {
  font-size: 28rpx;
  color: #999999;
  margin-top: 30rpx;
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
  margin-bottom: 48rpx;
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