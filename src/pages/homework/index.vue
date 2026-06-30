<template>
  <view class="page-container">
    <view class="nav-bar">
      <text class="nav-title">青耘学堂</text>
    </view>
    
    <view class="page-header">
      <text class="page-title">我的作业</text>
    </view>
    
    <view class="homework-list">
      <view 
        class="homework-card" 
        :class="{ 'urgent': item.urgent }"
        v-for="(item, index) in homeworkList" 
        :key="index"
        @click="handleCardClick(item)"
      >
        <view class="card-border" :style="{ backgroundColor: item.borderColor }"></view>
        <view class="card-content">
          <view class="card-header">
            <view class="course-tag" :style="{ backgroundColor: item.tagBgColor, color: item.tagColor }">
              {{ item.course }}
            </view>
            <text class="homework-title">{{ item.title }}</text>
          </view>
          <view class="card-body">
            <text class="deadline" :class="{ 'urgent': item.urgent }">
              截止时间：{{ item.deadline }}
              <text v-if="item.urgent" class="urgent-text">（即将截止）</text>
            </text>
            <text class="status" :style="{ color: item.statusColor }">{{ item.status }}</text>
          </view>
          <view class="card-footer">
            <view 
              class="action-btn" 
              :class="{ 'disabled': item.submitted }"
              :style="{ backgroundColor: item.btnBgColor, color: item.btnTextColor }"
              @click.stop="handleActionClick(item)"
            >
              {{ item.btnText }}
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
const homeworkList = [
  {
    course: '高等数学',
    title: '第三章练习题：微分中值定理',
    deadline: '2026-07-15 23:59',
    status: '未提交',
    submitted: false,
    urgent: false,
    borderColor: '#4CAF50',
    tagBgColor: '#E8F5E9',
    tagColor: '#4CAF50',
    statusColor: '#999999',
    btnBgColor: '#4CAF50',
    btnTextColor: '#FFFFFF',
    btnText: '提交作业'
  },
  {
    course: '大学英语',
    title: '作文：My University Life',
    deadline: '2026-07-10 12:00',
    status: '未提交',
    submitted: false,
    urgent: true,
    borderColor: '#E74C3C',
    tagBgColor: '#FDEDEC',
    tagColor: '#E74C3C',
    statusColor: '#999999',
    btnBgColor: '#4CAF50',
    btnTextColor: '#FFFFFF',
    btnText: '提交作业'
  },
  {
    course: '数据结构',
    title: '二叉树遍历实验报告',
    deadline: '2026-07-20 23:59',
    status: '已提交',
    submitted: true,
    urgent: false,
    borderColor: '#4CAF50',
    tagBgColor: '#E8F5E9',
    tagColor: '#4CAF50',
    statusColor: '#4CAF50',
    btnBgColor: '#F5F5F5',
    btnTextColor: '#999999',
    btnText: '重新提交'
  }
]

function handleCardClick(item) {
  console.log('点击作业卡片:', item.title)
}

function handleActionClick(item) {
  console.log('点击操作按钮:', item.btnText, item.title)
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

.homework-list {
  padding: 0 30rpx;
}

.homework-card {
  display: flex;
  background-color: #FFFFFF;
  border-radius: 16rpx;
  margin-bottom: 24rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.card-border {
  width: 8rpx;
  flex-shrink: 0;
}

.card-content {
  flex: 1;
  padding: 24rpx;
}

.card-header {
  margin-bottom: 16rpx;
}

.course-tag {
  display: inline-block;
  font-size: 22rpx;
  padding: 6rpx 16rpx;
  border-radius: 8rpx;
  margin-bottom: 12rpx;
}

.homework-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #333333;
  display: block;
}

.card-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.deadline {
  font-size: 24rpx;
  color: #999999;
}

.deadline.urgent {
  color: #E74C3C;
}

.urgent-text {
  font-size: 22rpx;
}

.status {
  font-size: 24rpx;
}

.card-footer {
  display: flex;
  justify-content: flex-end;
}

.action-btn {
  font-size: 24rpx;
  padding: 10rpx 28rpx;
  border-radius: 20rpx;
}

.action-btn.disabled {
  pointer-events: none;
}
</style>
