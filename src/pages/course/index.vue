<template>
  <view class="course-page">
    <view class="nav-bar">
      <text class="nav-title">青耘学堂</text>
    </view>

    <view class="add-course-card">
      <view class="add-course-header">
        <text class="add-icon">📝</text>
        <text class="add-title">加入新课程</text>
        <text class="add-desc">输入6位课程邀请码</text>
      </view>
      <view class="add-course-input-wrap">
        <input 
          class="course-code-input" 
          placeholder="课程码" 
          v-model="courseCode"
          maxlength="6"
          @input="handleCourseCodeInput"
        />
        <view class="join-btn" @click="handleJoinCourse">
          <text class="join-btn-text">加入</text>
        </view>
      </view>
    </view>

    <view class="course-list-header">
      <text class="course-list-title">已加入的课程</text>
      <view class="layout-switch">
        <view 
          class="layout-btn" 
          :class="{ active: layoutType === 'list' }"
          @click="handleLayoutSwitch('list')"
        >📋</view>
        <view 
          class="layout-btn" 
          :class="{ active: layoutType === 'grid' }"
          @click="handleLayoutSwitch('grid')"
        >▦</view>
      </view>
    </view>

    <view class="course-grid" v-if="layoutType === 'grid'">
      <view 
        class="course-card" 
        v-for="course in courseList" 
        :key="course.id"
        @click="handleCourseClick(course)"
      >
        <view class="course-card-header" :style="{ background: course.gradient }">
          <text class="course-code">{{ course.code }}</text>
          <view class="course-tag" :class="course.tagType">
            <text class="course-tag-text">{{ course.tag }}</text>
          </view>
        </view>
        <view class="course-card-body">
          <text class="course-name">{{ course.name }}</text>
          <text class="course-teacher">{{ course.teacher }}</text>
          <view class="course-progress-wrap">
            <text class="progress-label">进度</text>
            <view class="progress-bar-bg">
              <view class="progress-bar-fill" :style="{ width: course.progress + '%' }"></view>
            </view>
            <text class="progress-value">{{ course.progress }}%</text>
          </view>
        </view>
      </view>
    </view>

    <view class="course-list" v-else>
      <view 
        class="course-list-item" 
        v-for="course in courseList" 
        :key="course.id"
        @click="handleCourseClick(course)"
      >
        <view class="course-list-header-item" :style="{ background: course.gradient }">
          <text class="course-code">{{ course.code }}</text>
          <view class="course-tag" :class="course.tagType">
            <text class="course-tag-text">{{ course.tag }}</text>
          </view>
        </view>
        <view class="course-list-body">
          <text class="course-name">{{ course.name }}</text>
          <text class="course-teacher">{{ course.teacher }}</text>
          <view class="course-list-progress">
            <text class="progress-label">进度</text>
            <view class="progress-bar-bg">
              <view class="progress-bar-fill" :style="{ width: course.progress + '%' }"></view>
            </view>
            <text class="progress-value">{{ course.progress }}%</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const courseCode = ref('')
const layoutType = ref('grid')

const courseList = ref([
  {
    id: 1,
    name: '高等数学（上）',
    code: 'MATH',
    teacher: '张教授',
    progress: 75,
    tag: '必修课',
    tagType: 'required',
    gradient: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)'
  },
  {
    id: 2,
    name: '大学英语II',
    code: 'ENGLISH',
    teacher: '李老师',
    progress: 90,
    tag: '公共课',
    tagType: 'public',
    gradient: 'linear-gradient(135deg, #2196F3 0%, #1565C0 100%)'
  },
  {
    id: 3,
    name: '数据结构与算法',
    code: 'DATA',
    teacher: '王老师',
    progress: 45,
    tag: '专业课',
    tagType: 'professional',
    gradient: 'linear-gradient(135deg, #FF9800 0%, #EF6C00 100%)'
  },
  {
    id: 4,
    name: '线性代数',
    code: 'LINEAR',
    teacher: '陈教授',
    progress: 30,
    tag: '必修课',
    tagType: 'required',
    gradient: 'linear-gradient(135deg, #9C27B0 0%, #6A1B9A 100%)'
  }
])

function handleCourseClick(course) {
  console.log('点击课程:', course)
}

function handleCourseCodeInput(e) {
  console.log('输入课程码:', e.detail.value)
}

function handleJoinCourse() {
  console.log('加入课程:', courseCode.value)
}

function handleLayoutSwitch(type) {
  layoutType.value = type
  console.log('切换布局:', type)
}

function handleNoticeClick() {
  console.log('点击通知')
  uni.switchTab({ url: '/pages/index/index' })
}

function handleAvatarClick() {
  console.log('点击头像')
  uni.switchTab({ url: '/pages/profile/index' })
}

onMounted(() => {})
</script>

<style scoped>
page {
  background-color: #F5F5F5;
  width: 100%;
  max-width: 750rpx;
  margin: 0 auto;
}

.course-page {
  min-height: 100vh;
  background-color: #F5F5F5;
  padding-bottom: 120rpx;
  box-sizing: border-box;
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

.add-course-card {
  margin: 20rpx;
  padding: 30rpx;
  background-color: #FFFFFF;
  border-radius: 20rpx;
}

.add-course-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.add-icon {
  font-size: 28rpx;
  margin-right: 12rpx;
}

.add-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-right: 12rpx;
}

.add-desc {
  font-size: 24rpx;
  color: #999;
}

.add-course-input-wrap {
  display: flex;
  align-items: center;
}

.course-code-input {
  flex: 1;
  height: 80rpx;
  padding: 0 20rpx;
  background-color: #F5F5F5;
  border-radius: 12rpx;
  font-size: 28rpx;
  margin-right: 20rpx;
}

.join-btn {
  padding: 0 36rpx;
  height: 80rpx;
  background-color: #4CAF50;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.join-btn-text {
  font-size: 28rpx;
  color: #FFFFFF;
  font-weight: 500;
}

.course-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20rpx;
  margin-bottom: 20rpx;
}

.course-list-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.layout-switch {
  display: flex;
}

.layout-btn {
  width: 56rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #FFFFFF;
  border-radius: 8rpx;
  font-size: 28rpx;
  margin-left: 10rpx;
}

.layout-btn.active {
  background-color: #4A90D9;
}

.course-grid {
  display: flex;
  flex-wrap: wrap;
  padding: 0 20rpx;
  gap: 20rpx;
}

.course-card {
  flex: 1;
  min-width: calc(50% - 20rpx);
  max-width: calc(50% - 10rpx);
  background-color: #FFFFFF;
  border-radius: 20rpx;
  overflow: hidden;
}

.course-card-header {
  padding: 30rpx 20rpx;
  position: relative;
}

.course-code {
  font-size: 40rpx;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 4rpx;
}

.course-tag {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
  background-color: rgba(255, 255, 255, 0.3);
}

.course-tag-text {
  font-size: 20rpx;
  color: #FFFFFF;
}

.course-card-body {
  padding: 20rpx;
}

.course-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  display: block;
  margin-bottom: 8rpx;
}

.course-teacher {
  font-size: 24rpx;
  color: #999;
  display: block;
  margin-bottom: 16rpx;
}

.course-progress-wrap {
  display: flex;
  align-items: center;
}

.progress-label {
  font-size: 22rpx;
  color: #999;
  margin-right: 12rpx;
}

.progress-bar-bg {
  flex: 1;
  height: 12rpx;
  background-color: #E0E0E0;
  border-radius: 6rpx;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background-color: #4CAF50;
  border-radius: 6rpx;
  transition: width 0.3s ease;
}

.progress-value {
  font-size: 24rpx;
  color: #4CAF50;
  font-weight: 600;
  margin-left: 12rpx;
}

.course-list {
  padding: 0 20rpx;
}

.course-list-item {
  display: flex;
  background-color: #FFFFFF;
  border-radius: 20rpx;
  overflow: hidden;
  margin-bottom: 20rpx;
}

.course-list-header-item {
  width: 200rpx;
  flex-shrink: 0;
  padding: 30rpx 20rpx;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.course-list-body {
  flex: 1;
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.course-list-progress {
  display: flex;
  align-items: center;
}
</style>