<template>
  <view class="page-container">
    <view class="nav-bar">
      <text class="nav-title">青耘学堂</text>
    </view>
    
    <view class="user-card">
      <view class="avatar-wrap">
        <image class="avatar" :src="userStore.userInfo?.avatar || defaultAvatar" mode="aspectFill" />
      </view>
      <view class="user-info">
        <text class="user-name">{{ userStore.userInfo?.name || '张同学' }}</text>
        <text class="user-class">{{ userStore.userInfo?.id || '' }}</text>
      </view>
    </view>
    
    <view class="stats-row">
      <view class="stat-card" @click="handleStatClick('ongoing')">
        <text class="stat-num">0</text>
        <text class="stat-label">进行中课程</text>
      </view>
      <view class="stat-card" @click="handleStatClick('completed')">
        <text class="stat-num">0</text>
        <text class="stat-label">已完成课程</text>
      </view>
      <view class="stat-card highlight" @click="handleStatClick('totalScore')">
        <text class="stat-num">{{ userStore.userInfo?.points || 0 }}</text>
        <text class="stat-label">花卉积分</text>
      </view>
    </view>
    
    <view class="menu-card">
      <view class="menu-item" @click="handleMenuClick('analysis')">
        <view class="menu-icon-wrap" style="background-color: #E3F2FD;">
          <text class="menu-icon" style="color: #2196F3;">📊</text>
        </view>
        <text class="menu-text">学情分析</text>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @click="handleMenuClick('flower')">
        <view class="menu-icon-wrap" style="background-color: #E8F5E9;">
          <text class="menu-icon" style="color: #4CAF50;">🌱</text>
        </view>
        <text class="menu-text">青耘花卉培育</text>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @click="handleMenuClick('profile')">
        <view class="menu-icon-wrap" style="background-color: #E8F5E9;">
          <text class="menu-icon" style="color: #4CAF50;">👤</text>
        </view>
        <text class="menu-text">个人信息</text>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item danger" @click="handleLogout">
        <view class="menu-icon-wrap" style="background-color: #FDEDEC;">
          <text class="menu-icon" style="color: #E74C3C;">🚪</text>
        </view>
        <text class="menu-text">退出登录</text>
        <text class="menu-arrow">›</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { onShow } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores/user'
import http from '@/utils/request'

const userStore = useUserStore()

const defaultAvatar = 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=young%20student%20avatar%20portrait%20friendly%20smile&image_size=square'

onShow(() => {
  fetchUserInfo()
})

async function fetchUserInfo() {
  try {
    uni.showLoading({ title: '加载中...' })
    const res = await http.get('/info')
    console.log('获取个人信息:', res)
    if (res) {
      userStore.updateUserInfo({
        id: 'QY' + String(res.id).padStart(9, '0'),
        name: res.name || '',
        avatar: res.avatar || defaultAvatar,
        points: res.points || 0
      })
    }
  } catch (error) {
    console.error('获取个人信息失败:', error)
  } finally {
    uni.hideLoading()
  }
}

function handleStatClick(type) {
  console.log('点击统计:', type)
}

function handleMenuClick(type) {
  console.log('点击菜单:', type)
  if (type === 'profile') {
    uni.navigateTo({ url: '/pages/userinfo/index' })
  } else if (type === 'analysis') {
    uni.navigateTo({ url: '/pages/analysis/index' })
  }
}

function handleLogout() {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    confirmColor: '#E74C3C',
    success: (res) => {
      if (res.confirm) {
        userStore.clearLoginInfo()
        uni.redirectTo({ url: '/pages/login/index' })
      }
    }
  })
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

.user-card {
  display: flex;
  align-items: center;
  padding: 40rpx 30rpx;
  background-color: #FFFFFF;
}

.avatar-wrap {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 24rpx;
  border: 4rpx solid #E8F5E9;
}

.avatar {
  width: 100%;
  height: 100%;
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 36rpx;
  font-weight: 600;
  color: #333333;
  display: block;
  margin-bottom: 8rpx;
}

.user-class {
  font-size: 26rpx;
  color: #666666;
  display: block;
  margin-bottom: 12rpx;
}



.stats-row {
  display: flex;
  padding: 0 30rpx;
  margin-top: 20rpx;
}

.stat-card {
  flex: 1;
  background-color: #FFFFFF;
  border-radius: 16rpx;
  padding: 24rpx 0;
  text-align: center;
  margin-right: 16rpx;
}

.stat-card:last-child {
  margin-right: 0;
}

.stat-card.highlight .stat-num {
  color: #FF9800;
}

.stat-num {
  font-size: 44rpx;
  font-weight: 700;
  color: #4CAF50;
  display: block;
}

.stat-label {
  font-size: 22rpx;
  color: #999999;
  margin-top: 8rpx;
  display: block;
}

.menu-card {
  margin: 24rpx 30rpx;
  background-color: #FFFFFF;
  border-radius: 16rpx;
  overflow: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 28rpx 30rpx;
  border-bottom: 2rpx solid #F5F5F5;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item.danger .menu-text {
  color: #E74C3C;
}

.menu-icon-wrap {
  width: 64rpx;
  height: 64rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
}

.menu-icon {
  font-size: 32rpx;
}

.menu-text {
  flex: 1;
  font-size: 30rpx;
  color: #333333;
}

.menu-arrow {
  font-size: 36rpx;
  color: #CCCCCC;
}
</style>
