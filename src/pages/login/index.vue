<template>
  <view class="login-page">
    <view class="page-header">
      <text class="header-title">青耘学堂</text>
    </view>
    
    <view class="logo-wrap">
      <image class="logo" :src="logoUrl" mode="aspectFit" />
    </view>
    
    <view class="login-card">
      <text class="login-desc">首次登录即自动注册</text>
      
      <view class="wechat-login-btn" @click="handleWechatLogin">
        <text class="wechat-icon">W</text>
        <text class="wechat-btn-text">微信登录</text>
      </view>
      
      <view class="agreement-wrap">
        <text class="agreement-text">登录即表示同意</text>
        <text class="agreement-link">《用户协议》</text>
        <text class="agreement-text">及</text>
        <text class="agreement-link">《隐私政策》</text>
      </view>
    </view>
    
    <view class="copyright">
      <text class="copyright-text">© 2026 小程序平台 版权所有</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { USE_MOCK_LOGIN, http } from '@/utils/request'

const userStore = useUserStore()

const logoUrl = ref('/static/logo.png?' + Date.now())

// 模拟登录生成假 token
function generateMockToken() {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2)
  return `mock_token_${timestamp}_${random}`
}

// 模拟登录逻辑（不需要后端服务器）
async function mockWechatLogin() {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('[DEBUG] 模拟登录成功')
      resolve({
        token: generateMockToken(),
        userInfo: {
          id: 'mock_user_001',
          nickname: '测试用户',
          avatar: '',
          phone: '13800138000'
        },
        userType: 'student'
      })
    }, 800)
  })
}

// 真实登录逻辑（需要后端服务器）
async function realWechatLogin() {
  const loginRes = await new Promise((resolve, reject) => {
    wx.login({
      success: resolve,
      fail: reject
    })
  })
  
  const { code } = loginRes
  
  const res = await http.post('/login/mp', { code })
  
  return res
}

async function autoWechatLogin() {
  uni.showLoading({ title: '微信登录中...' })
  
  try {
    if (userStore.token) {
      console.log('[DEBUG] 已有token，直接进入')
      uni.hideLoading()
      setTimeout(() => {
        uni.switchTab({ url: '/pages/course/index' })
      }, 500)
      return
    }
    
    let res
    if (USE_MOCK_LOGIN) {
      res = await mockWechatLogin()
    } else {
      res = await realWechatLogin()
    }
    
    if (res.token) {
      userStore.setLoginInfo({
        token: res.token,
        userInfo: res.userInfo || {},
        userType: res.userType
      })
      
      uni.hideLoading()
      uni.showToast({ title: '登录成功', icon: 'success' })
      
      setTimeout(() => {
        uni.switchTab({ url: '/pages/course/index' })
      }, 1000)
    } else {
      uni.hideLoading()
    }
  } catch (error) {
    uni.hideLoading()
    console.error('自动登录失败:', error)
    uni.showToast({ title: '登录失败，请重试', icon: 'none' })
  }
}

function handleWechatLogin() {
  autoWechatLogin()
}

onMounted(() => {
  autoWechatLogin()
})
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #E8F5E9 0%, #F0F8FF 100%);
  padding-bottom: 40rpx;
}

.page-header {
  padding: 60rpx 30rpx 30rpx;
  background: linear-gradient(90deg, #4CAF50 0%, #4A90D9 100%);
  text-align: center;
}

.header-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #FFFFFF;
}

.logo-wrap {
  display: flex;
  justify-content: center;
  padding: 60rpx 0;
}

.logo {
  width: 160rpx;
  height: 160rpx;
  background-color: #FFFFFF;
  border-radius: 30rpx;
  box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.1);
}

.login-card {
  margin: 40rpx 30rpx;
  padding: 60rpx 40rpx;
  background-color: #FFFFFF;
  border-radius: 24rpx;
  box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.login-desc {
  font-size: 26rpx;
  color: #999999;
  margin-bottom: 60rpx;
}

.wechat-login-btn {
  width: 100%;
  height: 100rpx;
  background: linear-gradient(90deg, #07C160 0%, #10AE68 100%);
  border-radius: 50rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40rpx;
}

.wechat-icon {
  font-size: 40rpx;
  font-weight: 700;
  color: #FFFFFF;
  margin-right: 16rpx;
}

.wechat-btn-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #FFFFFF;
}

.agreement-wrap {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
}

.agreement-text {
  font-size: 22rpx;
  color: #999999;
}

.agreement-link {
  font-size: 22rpx;
  color: #4CAF50;
  margin: 0 4rpx;
}

.copyright {
  text-align: center;
  margin-top: 40rpx;
}

.copyright-text {
  font-size: 22rpx;
  color: #999999;
}
</style>