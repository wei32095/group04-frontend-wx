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
const noticeList = [
  {
    icon: '📢',
    iconBgColor: '#FFF3E0',
    iconColor: '#FF9800',
    title: '系统公告 - 本学期期末安排已发布',
    date: '2026-07-01',
    desc: '各位同学，本学期的期末考试及放假时间安排已经发布在教务系统中，请大家及时查阅并做好复习准备。',
    read: false
  },
  {
    icon: '📚',
    iconBgColor: '#E3F2FD',
    iconColor: '#2196F3',
    title: '课程提醒 - 高等数学下周将进行期中测验',
    date: '2026-06-28',
    desc: '张教授提醒：下周三（7月3日）第二节课将进行高等数学期中测验，范围包含前三章内容。',
    read: false
  },
  {
    icon: '✅',
    iconBgColor: '#E8F5E9',
    iconColor: '#4CAF50',
    title: '作业提醒 - 数据结构实验报告已批改完成',
    date: '2026-06-25',
    desc: '你的"二叉树遍历实验报告"已经批改完成，得分：A。点击查看老师评语。',
    read: true
  }
]

function handleCardClick(item) {
  console.log('点击通知卡片:', item.title)
}

function handleMarkAllRead() {
  console.log('全部标记为已读')
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
