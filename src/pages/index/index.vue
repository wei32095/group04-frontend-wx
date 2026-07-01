<template>
  <view class="page-container">
    <view class="nav-bar">
      <text class="nav-title">青耘学堂</text>
    </view>
    
    <view class="page-header">
      <text class="page-title">系统通知</text>
      <view class="mark-all-btn" @click="handleMarkAllRead">
        <text class="mark-all-text">全部标记为已读</text>
      </view>
    </view>
    
    <view class="notice-list">
      <view 
        class="notice-card" 
        v-for="(item, index) in noticeList" 
        :key="index"
        @click="handleCardClick(item)"
      >
        <view class="card-left">
          <view class="icon-circle" :style="{ backgroundColor: item.iconBgColor }">
            <text class="icon-text" :style="{ color: item.iconColor }">{{ item.icon }}</text>
          </view>
          <view class="card-content">
            <view class="content-header">
              <text class="notice-title">{{ item.title }}</text>
              <text class="notice-date">{{ item.date }}</text>
            </view>
            <text class="notice-desc">{{ item.desc }}</text>
          </view>
        </view>
        <view class="card-right">
          <view v-if="!item.read" class="unread-dot"></view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import http from '@/utils/request'

const noticeList = ref([])
const prevUnread = ref(0)
let pollTimer = null

const iconConfig = {
  0: { icon: '📢', iconBgColor: '#FFF3E0', iconColor: '#FF9800' },
  1: { icon: '📚', iconBgColor: '#E3F2FD', iconColor: '#2196F3' },
  2: { icon: '✅', iconBgColor: '#E8F5E9', iconColor: '#4CAF50' },
  4: { icon: '📝', iconBgColor: '#F3E5F5', iconColor: '#9C27B0' },
  default: { icon: '📌', iconBgColor: '#E0E0E0', iconColor: '#666666' }
}

function getIconConfig(type) {
  return iconConfig[type] || iconConfig.default
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${month}月${day}日`
}

onMounted(() => {
  fetchNotices()
  startPolling()
})

onUnmounted(() => {
  stopPolling()
})

function startPolling() {
  pollTimer = setInterval(() => {
    fetchNotices()
  }, 30000)
}

function stopPolling() {
  if (pollTimer) {
    clearInterval(pollTimer)
    pollTimer = null
  }
}

async function fetchNotices() {
  try {
    const res = await http.get('/notices', { page: 1, size: 10 }, { loading: false })
    console.log('获取通知列表:', res)
    if (res) {
      const list = res.location || []
      noticeList.value = list.map(item => {
        const iconCfg = getIconConfig(item.noticeType)
        return {
          id: item.id,
          icon: iconCfg.icon,
          iconBgColor: iconCfg.iconBgColor,
          iconColor: iconCfg.iconColor,
          title: item.noticeTitle || '',
          date: formatDate(item.pushTime),
          desc: item.noticeContent || '',
          read: item.noticeStatus === 1
        }
      })
      
      const currentUnread = res.unreadCount || 0
      if (currentUnread > prevUnread.value) {
        uni.showToast({ title: '您有新的通知', icon: 'none' })
      }
      prevUnread.value = currentUnread
    }
  } catch (error) {
    console.error('获取通知列表失败:', error)
  }
}

async function handleCardClick(item) {
  const notice = noticeList.value.find(n => n.id === item.id)
  if (notice) {
    notice.read = true
  }
  
  try {
    await http.put(`/notices/read/${item.id}`)
    console.log('标记通知已读成功:', item.id)
  } catch (error) {
    console.error('标记通知已读失败:', error)
  }
}

async function handleMarkAllRead() {
  noticeList.value.forEach(item => {
    item.read = true
  })
  
  try {
    await http.put('/notices/read-all')
    console.log('全部标记通知已读成功')
    uni.showToast({ title: '已全部已读', icon: 'success' })
  } catch (error) {
    console.error('全部标记通知已读失败:', error)
  }
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  background-color: #F5F5F5;
}

.page-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333333;
}

.mark-all-btn {
  padding: 8rpx 20rpx;
}

.mark-all-text {
  font-size: 26rpx;
  color: #4CAF50;
}

.notice-list {
  padding: 0 30rpx;
}

.notice-card {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background-color: #FFFFFF;
  border-radius: 16rpx;
  padding: 28rpx;
  margin-bottom: 20rpx;
}

.card-left {
  display: flex;
  flex: 1;
}

.icon-circle {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.icon-text {
  font-size: 32rpx;
}

.card-content {
  flex: 1;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.notice-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333333;
  flex: 1;
  margin-right: 16rpx;
}

.notice-date {
  font-size: 22rpx;
  color: #999999;
  flex-shrink: 0;
}

.notice-desc {
  font-size: 24rpx;
  color: #666666;
  line-height: 1.6;
}

.card-right {
  display: flex;
  align-items: flex-start;
  padding-left: 16rpx;
}

.unread-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background-color: #E74C3C;
  margin-top: 8rpx;
}
</style>
